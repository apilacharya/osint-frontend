import { Icon } from "@iconify/react";
import { Pagination } from "antd";
import type { Finding } from "../../schemas/apiSchemas";
import type { FindingCategory } from "../../types/api";
import { FindingCard } from "./FindingCard";

type Props = {
  category: FindingCategory;
  findings: Finding[];
  selectedFindingId: string | null;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSelectFinding: (id: string) => void;
  onViewAll?: () => void;
  showPagination?: boolean;
  maxPreviewCount?: number;
};

const categoryMeta: Record<FindingCategory, { icon: string; label: string; accent: string }> = {
  SOCIAL: { icon: "mdi:github", label: "Social", accent: "border-l-violet-500" },
  INFRASTRUCTURE: { icon: "mdi:google", label: "Infrastructure", accent: "border-l-amber-500" },
  CONTEXTUAL: { icon: "mdi:wikipedia", label: "Contextual", accent: "border-l-sky-500" }
};

export function CategorySection({
  category,
  findings,
  selectedFindingId,
  pageSize,
  currentPage,
  onPageChange,
  onSelectFinding,
  onViewAll,
  showPagination = false,
  maxPreviewCount = 3
}: Props) {
  if (findings.length === 0) return null;

  const meta = categoryMeta[category];
  const maxPage = Math.max(1, Math.ceil(findings.length / pageSize));
  const safePage = Math.min(currentPage, maxPage);
  const isPreview = !showPagination;
  
  const visibleFindings = isPreview
    ? findings.slice(0, maxPreviewCount)
    : findings.slice((safePage - 1) * pageSize, safePage * pageSize);
  
  const remaining = findings.length - visibleFindings.length;

  return (
    <div className="overflow-hidden">
      <div className="mb-3 flex items-center gap-2">
        <Icon icon={meta.icon} className="h-4 w-4 text-slate-400" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {meta.label}
        </span>
        <span className="text-xs text-slate-400">
          {findings.length} {findings.length === 1 ? "finding" : "findings"}
        </span>
      </div>

      <div className="space-y-4">
        {visibleFindings.map((finding) => (
          <FindingCard
            key={finding.id}
            finding={finding}
            isSelected={selectedFindingId === finding.id}
            categoryAccent={meta.accent}
            onSelect={() => onSelectFinding(finding.id)}
          />
        ))}
      </div>

      {isPreview && remaining > 0 && onViewAll && (
        <button
          type="button"
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800"
          onClick={onViewAll}
        >
          View all {findings.length} {meta.label.toLowerCase()} findings
          <Icon icon="mage:chevron-right" className="h-3 w-3" />
        </button>
      )}

      {showPagination && findings.length > pageSize && (
        <div className="mt-4 flex justify-center">
          <Pagination
            current={safePage}
            pageSize={pageSize}
            total={findings.length}
            showSizeChanger={false}
            onChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
