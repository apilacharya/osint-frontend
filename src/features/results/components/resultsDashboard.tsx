import { useState } from "react";
import clsx from "clsx";
import type { Finding } from "../../../schemas/apiSchemas";
import type { FindingCategory } from "../../../types/api";
import { formatDateTime } from "../../../lib/date";
import { Icon } from "@iconify/react";
import { Skeleton } from "../../../components/ui/skeleton";
import { Pagination } from "antd";

type CategoryFilter = "ALL" | FindingCategory;

type Props = {
  findings: Finding[];
  activeCategory: CategoryFilter;
  selectedFindingId: string | null;
  isLoading?: boolean;
  onSelectFinding: (id: string) => void;
  onCategoryChange: (category: CategoryFilter) => void;
};

const categories: CategoryFilter[] = ["ALL", "SOCIAL", "INFRASTRUCTURE", "CONTEXTUAL"];

const categoryMeta: Record<FindingCategory, { icon: string; label: string; accent: string }> = {
  SOCIAL: { icon: "mdi:github", label: "Social", accent: "border-l-violet-500" },
  INFRASTRUCTURE: { icon: "mdi:google", label: "Infrastructure", accent: "border-l-amber-500" },
  CONTEXTUAL: { icon: "mdi:wikipedia", label: "Contextual", accent: "border-l-sky-500" }
};

const confidenceBadge = (value: number) => {
  if (value >= 0.7) return "bg-emerald-50 text-emerald-700";
  if (value >= 0.4) return "bg-amber-50 text-amber-700";
  return "bg-slate-100 text-slate-600";
};

const PAGE_SIZE = 7;

export const ResultsDashboard = ({
  findings,
  activeCategory,
  selectedFindingId,
  isLoading,
  onSelectFinding,
  onCategoryChange
}: Props) => {
  const countFor = (category: CategoryFilter) =>
    category === "ALL" ? findings.length : findings.filter((item) => item.category === category).length;
  const visibleCategories: FindingCategory[] =
    activeCategory === "ALL" ? ["SOCIAL", "INFRASTRUCTURE", "CONTEXTUAL"] : [activeCategory];
  const isAllView = activeCategory === "ALL";
  const [categoryPages, setCategoryPages] = useState<Record<FindingCategory, number>>({
    SOCIAL: 1,
    INFRASTRUCTURE: 1,
    CONTEXTUAL: 1
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (findings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Icon icon="mage:search" className="mb-3 h-10 w-10 text-slate-300" />
        <p className="text-sm font-medium text-slate-500">No findings returned by adapter target</p>
        <p className="mt-1 text-xs text-slate-400">Try modifying your search criteria or running a new search.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 overflow-hidden">
      {/* Category pills */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map((category) => {
          const count = countFor(category);
          const isActive = activeCategory === category;
          return (
             <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={clsx(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                isActive
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {category === "ALL" ? "All" : categoryMeta[category].label}
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
        })}
      </div>

      {/* Category sections */}
      <div className={clsx(isAllView ? "space-y-10" : "space-y-6")}>
        {visibleCategories.map((category) => {
          const categoryFindings = findings.filter((item) => item.category === category);
          if (categoryFindings.length === 0) return null;

          const meta = categoryMeta[category];
          const page = categoryPages[category] ?? 1;
          const maxPage = Math.max(1, Math.ceil(categoryFindings.length / PAGE_SIZE));
          const safePage = Math.min(page, maxPage);
          const visible = isAllView
            ? categoryFindings.slice(0, 3)
            : categoryFindings.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
          const remaining = categoryFindings.length - visible.length;

          return (
            <div key={category} className="overflow-hidden">
              {/* Category header */}
              <div className="mb-3 flex items-center gap-2">
                <Icon icon={meta.icon} className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {meta.label}
                </span>
                <span className="text-xs text-slate-400">
                  {categoryFindings.length} {categoryFindings.length === 1 ? "finding" : "findings"}
                </span>
              </div>

              {/* Finding cards */}
              <div className="space-y-4">
                {visible.map((finding) => (
                  <button
                    type="button"
                    key={finding.id}
                    onClick={() => onSelectFinding(finding.id)}
                    className={clsx(
                      "group block w-full overflow-hidden rounded-lg border-l-[3px] bg-white p-3 text-left transition-all",
                      meta.accent,
                      selectedFindingId === finding.id
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
                ))}
              </div>

              {isAllView && remaining > 0 && (
                <button
                  type="button"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800"
                  onClick={() => onCategoryChange(category)}
                >
                  View all {categoryFindings.length} {meta.label.toLowerCase()} findings
                  <Icon icon="mage:chevron-right" className="h-3 w-3" />
                </button>
              )}

              {!isAllView && categoryFindings.length > PAGE_SIZE && (
                <div className="mt-4 flex justify-center">
                  <Pagination
                    current={safePage}
                    pageSize={PAGE_SIZE}
                    total={categoryFindings.length}
                    showSizeChanger={false}
                    onChange={(nextPage) => setCategoryPages((prev) => ({ ...prev, [category]: nextPage }))}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
