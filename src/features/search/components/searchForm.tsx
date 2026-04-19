import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { searchFormSchema, type SearchFormInput, type SearchFormValues } from "../../../schemas/searchSchemas";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Select } from "../../../components/ui/select";

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

export const SearchForm = ({ isLoggedIn, initialValues, onSubmitStart, onClear }: Props) => {
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
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-700">Target name</label>
          <button 
            type="button" 
            title="Clear all fields"
            onClick={() => {
              form.reset(emptyFormValues);
              onClear?.();
            }}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Icon icon="mage:multiply" className="h-4 w-4" />
          </button>
        </div>
        <Input
          {...form.register("query")}
          placeholder="Company or individual"
        />
        {form.formState.errors.query && (
          <p className="mt-1 text-xs text-red-600">{form.formState.errors.query.message}</p>
        )}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Entity type</label>
        <Select {...form.register("entityType")}>
          <option value="UNKNOWN">Unknown</option>
          <option value="COMPANY">Company</option>
          <option value="PERSON">Person</option>
        </Select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Aliases (comma separated)</label>
        <Input {...form.register("aliases")} placeholder="Acme Inc, Acme Corporation" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Location</label>
          <Input {...form.register("location")} placeholder="Kathmandu" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Industry</label>
          <Input {...form.register("industry")} placeholder="Fintech" />
        </div>
      </div>
      <Button type="submit" className="w-full">
        <Icon icon="mage:search" className="h-4 w-4" />
        Run OSINT Search
      </Button>
      {!isLoggedIn && <p className="text-xs text-slate-500">Guest search runs are temporary and not saved to history.</p>}
    </form>
  );
};
