import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { searchFormSchema, type SearchFormInput, type SearchFormValues } from "../../../schemas/searchSchemas";
import { Button } from "../../../components/ui/button";
import { Select } from "../../../components/ui/select";
import { FormField } from "../../../components/common/FormField";

type Props = {
  isLoggedIn: boolean;
  initialValues?: SearchFormValues;
  onSubmitStart?: (submitted: SearchFormInput) => void;
  onClear?: () => void;
};

const emptyFormValues: SearchFormValues = {
  query: "",
  entityType: "UNKNOWN",
  aliases: "",
  location: "",
  industry: ""
};

function SearchFormFields({ form, mode }: { form: any; mode: "guest" | "authenticated" }) {
  return (
    <>
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-700">Target name</label>
          <button
            type="button"
            title="Clear all fields"
            onClick={() => form.reset(emptyFormValues)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Icon icon="mage:multiply" className="h-4 w-4" />
          </button>
        </div>
        <FormField
          {...form.register("query")}
          label=""
          placeholder="Company or individual"
          error={form.formState.errors.query}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Entity type</label>
        <Select {...form.register("entityType")}>
          <option value="UNKNOWN">Unknown</option>
          <option value="COMPANY">Company</option>
          <option value="PERSON">Person</option>
        </Select>
      </div>

      <FormField
        {...form.register("aliases")}
        label="Aliases (comma separated)"
        placeholder="Acme Inc, Acme Corporation"
        error={form.formState.errors.aliases}
        optional
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField
          {...form.register("location")}
          label="Location"
          placeholder="Kathmandu"
          error={form.formState.errors.location}
          optional
        />
        <FormField
          {...form.register("industry")}
          label="Industry"
          placeholder="Fintech"
          error={form.formState.errors.industry}
          optional
        />
      </div>

      {mode === "guest" && (
        <p className="text-xs text-slate-500">
          Guest search runs are temporary and not saved to history.
        </p>
      )}
    </>
  );
}

export const SearchForm = ({ isLoggedIn, initialValues, onSubmitStart }: Props) => {
  const defaultValues = useMemo<SearchFormValues>(
    () => ({
      query: initialValues?.query ?? "",
      entityType: initialValues?.entityType ?? "UNKNOWN",
      aliases: initialValues?.aliases ?? "",
      location: initialValues?.location ?? "",
      industry: initialValues?.industry ?? ""
    }),
    [initialValues]
  );

  const form = useForm<SearchFormValues, unknown, SearchFormInput>({
    resolver: zodResolver(searchFormSchema),
    defaultValues
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const onSubmit = form.handleSubmit((parsed) => {
    onSubmitStart?.(parsed);
  });

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <SearchFormFields form={form} mode={isLoggedIn ? "authenticated" : "guest"} />
      <Button type="submit" className="w-full">
        <Icon icon="mage:search" className="h-4 w-4" />
        Run OSINT Search
      </Button>
    </form>
  );
};
