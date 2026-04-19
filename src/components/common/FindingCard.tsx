import clsx from "clsx";
import { Icon } from "@iconify/react";
import type { Finding } from "../../schemas/apiSchemas";
import { formatDateTime } from "../../lib/date";

type Props = {
  finding: Finding;
  isSelected: boolean;
  categoryAccent: string;
  onSelect: () => void;
};

const confidenceBadge = (value: number) => {
  if (value >= 0.7) return "bg-emerald-50 text-emerald-700";
  if (value >= 0.4) return "bg-amber-50 text-amber-700";
  return "bg-slate-100 text-slate-600";
};

export function FindingCard({ finding, isSelected, categoryAccent, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={clsx(
        "group block w-full overflow-hidden rounded-lg border-l-[3px] bg-white p-3 text-left transition-all",
        categoryAccent,
        isSelected
          ? "border border-l-[3px] border-slate-300 shadow-sm"
          : "border border-l-[3px] border-transparent hover:border-slate-200 hover:shadow-sm"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="truncate text-sm font-medium text-slate-800">{finding.title}</p>
        <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-slate-500">
          <Icon icon="mage:eye" className="h-3.5 w-3.5" />
          View
        </span>
      </div>
      <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
        {finding.summary}
      </p>
      <div className="mt-2 flex items-center gap-2 overflow-hidden text-[11px] text-slate-400">
        <span
          className={clsx(
            "inline-flex shrink-0 items-center rounded px-1.5 py-0.5 font-medium",
            confidenceBadge(finding.confidence)
          )}
        >
          {(finding.confidence * 100).toFixed(0)}%
        </span>
        <span className="truncate">{formatDateTime(finding.retrievedAt)}</span>
        <a
          href={finding.source.url}
          target="_blank"
          rel="noreferrer"
          className="ml-auto shrink-0 text-blue-600 hover:underline"
          onClick={(event) => event.stopPropagation()}
        >
          Source
        </a>
      </div>
    </button>
  );
}
