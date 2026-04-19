import clsx from "clsx";
import type { FindingCategory } from "../../types/api";

type Props = {
  category: "ALL" | FindingCategory;
  count: number;
  isActive: boolean;
  onClick: () => void;
};

const categoryMeta: Record<FindingCategory, string> = {
  SOCIAL: "Social",
  INFRASTRUCTURE: "Infrastructure",
  CONTEXTUAL: "Contextual"
};

export function CategoryPill({ category, count, isActive, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
        isActive
          ? "bg-slate-900 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      )}
    >
      {category === "ALL" ? "All" : categoryMeta[category]}
      <span
        className={clsx(
          "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold",
          isActive ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-500"
        )}
      >
        {count}
      </span>
    </button>
  );
}
