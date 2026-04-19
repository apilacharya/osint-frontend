import { useState } from "react";
import type { Finding } from "../../../schemas/apiSchemas";
import type { FindingCategory } from "../../../types/api";
import { CategoryPill } from "../../../components/common/CategoryPill";
import { CategorySection } from "../../../components/common/CategorySection";
import { EmptyState } from "../../../components/common/EmptyState";
import { Skeleton } from "../../../components/ui/skeleton";

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
const PAGE_SIZE = 7;

function ResultsLoading() {
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

function CategoryPills({
  categories,
  activeCategory,
  countFor,
  onCategoryChange
}: {
  categories: CategoryFilter[];
  activeCategory: CategoryFilter;
  countFor: (cat: CategoryFilter) => number;
  onCategoryChange: (cat: CategoryFilter) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {categories.map((category) => (
        <CategoryPill
          key={category}
          category={category}
          count={countFor(category)}
          isActive={activeCategory === category}
          onClick={() => onCategoryChange(category)}
        />
      ))}
    </div>
  );
}

export const ResultsDashboard = ({
  findings,
  activeCategory,
  selectedFindingId,
  isLoading = false,
  onSelectFinding,
  onCategoryChange
}: Props) => {
  const [categoryPages, setCategoryPages] = useState<Record<FindingCategory, number>>({
    SOCIAL: 1,
    INFRASTRUCTURE: 1,
    CONTEXTUAL: 1
  });

  const countFor = (category: CategoryFilter) =>
    category === "ALL" ? findings.length : findings.filter((item) => item.category === category).length;

  const visibleCategories: FindingCategory[] =
    activeCategory === "ALL" ? ["SOCIAL", "INFRASTRUCTURE", "CONTEXTUAL"] : [activeCategory];

  const isAllView = activeCategory === "ALL";

  if (isLoading) return <ResultsLoading />;
  if (findings.length === 0) {
    return (
      <EmptyState
        title="No findings returned by adapter target"
        description="Try modifying your search criteria or running a new search."
      />
    );
  }

  return (
    <div className="space-y-5 overflow-hidden">
      <CategoryPills
        categories={categories}
        activeCategory={activeCategory}
        countFor={countFor}
        onCategoryChange={onCategoryChange}
      />

      <div className={isAllView ? "space-y-10" : "space-y-6"}>
        {visibleCategories.map((category) => {
          const categoryFindings = findings.filter((item) => item.category === category);
          const page = categoryPages[category] ?? 1;

          return (
            <CategorySection
              key={category}
              category={category}
              findings={categoryFindings}
              selectedFindingId={selectedFindingId}
              pageSize={PAGE_SIZE}
              currentPage={page}
              onPageChange={(nextPage) =>
                setCategoryPages((prev) => ({ ...prev, [category]: nextPage }))
              }
              onSelectFinding={onSelectFinding}
              onViewAll={() => onCategoryChange(category)}
              showPagination={!isAllView}
              maxPreviewCount={3}
            />
          );
        })}
      </div>
    </div>
  );
};
