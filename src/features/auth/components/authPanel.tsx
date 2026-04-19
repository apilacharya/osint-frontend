import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useAuthSession, useLogin, useRegister } from "../../../hooks/useAuth";
import { getErrorMessageFromCode } from "../../../lib/errorMessages";
import type { ApiClientError } from "../../../lib/apiClient";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  email: z.string().trim().email("Valid email is required."),
  password: z.string().min(8, "Password must be at least 8 characters.")
});

const loginSchema = z.object({
  email: z.string().trim().email("Valid email is required."),
  password: z.string().min(8, "Password must be at least 8 characters.")
});

const authFormSchema = z.object({
  name: z.string().trim().optional(),
  email: z.string().trim().email("Valid email is required."),
  password: z.string().min(8, "Password must be at least 8 characters.")
});

type AuthFormInput = z.infer<typeof authFormSchema>;
type AuthMode = "login" | "register";

function AuthModeToggle({ mode, onModeChange }: { mode: AuthMode; onModeChange: (m: AuthMode) => void }) {
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        onClick={() => onModeChange("login")}
        variant={mode === "login" ? "default" : "ghost"}
        size="sm"
      >
        Login
      </Button>
      <Button
        type="button"
        onClick={() => onModeChange("register")}
        variant={mode === "register" ? "default" : "ghost"}
        size="sm"
      >
        Register
      </Button>
    </div>
  );
}

function PasswordInput({ value, showPassword, onToggleShow, error }: any) {
  return (
    <>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          {...value}
          placeholder="Password"
          className="pr-10"
        />
        <button
          type="button"
          title={showPassword ? "Hide password" : "Show password"}
          onClick={onToggleShow}
          className="absolute inset-y-0 right-0 inline-flex items-center px-3 text-slate-500 hover:text-slate-700 transition-colors"
        >
          <Icon icon={showPassword ? "mage:eye-off" : "mage:eye"} className="h-4 w-4" />
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </>
  );
}

function UserProfile({ user }: { user: any }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-slate-900">{user.name}</p>
      <p className="text-xs text-slate-500">{user.email}</p>
      <p className="text-xs text-slate-500">Use the top navbar to logout.</p>
    </div>
  );
}

export const AuthPanel = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<AuthFormInput>({
    resolver: zodResolver(authFormSchema),
    defaultValues: { name: "", email: "", password: "" }
  });

  const sessionQuery = useAuthSession();
  const registerMutation = useRegister();
  const loginMutation = useLogin();
  const queryClient = useQueryClient();

  const isLoggedIn = sessionQuery.data?.authenticated === true;
  const activeUser = sessionQuery.data?.user;

  function onAuthError(error: unknown) {
    const apiError = error as ApiClientError;
    const explicitMessage = apiError.message?.trim();
    toast.error(explicitMessage || getErrorMessageFromCode(apiError.code));
  }

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (mode === "register") {
        const parsed = registerSchema.safeParse({
          name: values.name,
          email: values.email,
          password: values.password
        });
        if (!parsed.success) {
          form.setError("name", { message: parsed.error.issues[0]?.message ?? "Name is required." });
          return;
        }
        await registerMutation.mutateAsync(parsed.data);
        toast.success("Account created securely. You are now logged in.");
      } else {
        const parsed = loginSchema.safeParse({
          email: values.email,
          password: values.password
        });
        if (!parsed.success) {
          form.setError("email", { message: parsed.error.issues[0]?.message ?? "Invalid login details." });
          return;
        }
        await loginMutation.mutateAsync(parsed.data);
        toast.success("Logged in successfully.");
      }

      await queryClient.refetchQueries({ queryKey: ["auth-session"] });
      await queryClient.invalidateQueries({ queryKey: ["search-runs"] });
      form.setValue("password", "");
    } catch (error) {
      onAuthError(error);
    }
  });

  if (isLoggedIn && activeUser) {
    return <UserProfile user={activeUser} />;
  }

  return (
    <div className="space-y-3">
      <AuthModeToggle mode={mode} onModeChange={setMode} />
      <form className="space-y-2" onSubmit={onSubmit}>
        {mode === "register" && (
          <>
            <Input {...form.register("name")} placeholder="Name" />
            {form.formState.errors.name?.message && (
              <p className="text-xs text-red-600">{form.formState.errors.name.message}</p>
            )}
          </>
        )}
        <Input {...form.register("email")} placeholder="Email" />
        {form.formState.errors.email?.message && (
          <p className="text-xs text-red-600">{form.formState.errors.email.message}</p>
        )}
        <PasswordInput
          value={form.register("password")}
          showPassword={showPassword}
          onToggleShow={() => setShowPassword((current) => !current)}
          error={form.formState.errors.password}
        />
        <Button
          type="submit"
          disabled={registerMutation.isPending || loginMutation.isPending}
          className="w-full"
        >
          {mode === "register" ? "Create account" : "Login"}
        </Button>
      </form>
    </div>
  );
};
