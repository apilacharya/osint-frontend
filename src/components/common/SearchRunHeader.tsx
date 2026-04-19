import type { SearchCreateResult } from "../../schemas/apiSchemas";

type Props = {
  run: SearchCreateResult | null;
  defaultTitle?: string;
  queryFromUrl: string;
  actions?: React.ReactNode;
};

export function SearchRunHeader({ run, defaultTitle, queryFromUrl, actions }: Props) {
  const title = queryFromUrl
    ? `Search Results: ${queryFromUrl}`
    : run
      ? `Search Results: ${run.query}`
      : defaultTitle ?? "Discovery Feed";

  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
        {title}
      </h2>
      {actions}
    </div>
  );
}
