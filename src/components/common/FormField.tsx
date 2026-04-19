import type { FieldError } from "react-hook-form";
import { Input } from "../ui/input";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: FieldError;
  helpText?: string;
  optional?: boolean;
};

export const FormField = ({
  label,
  error,
  helpText,
  optional = false,
  ...inputProps
}: Props) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-slate-700">
      {label}
      {optional && <span className="text-slate-400"> (optional)</span>}
    </label>
    <Input {...inputProps} />
    {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    {helpText && !error && <p className="mt-1 text-xs text-slate-500">{helpText}</p>}
  </div>
);
