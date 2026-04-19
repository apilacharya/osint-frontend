import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "../components/ui/card";
import { SearchForm } from "../features/search/components/searchForm";
import { ResultsDashboard } from "../features/results/components/resultsDashboard";
import { FindingDetail } from "../features/findings/components/findingDetail";
import { ReportActions } from "../features/reports/components/reportActions";
import { AuthPanel } from "../features/auth/components/authPanel";
import { useDiscoveryFeed, useSearchData, useSearchSources } from "../hooks/useSearch";
import { useAuthSession } from "../hooks/useAuth";
import type { Finding } from "../schemas/apiSchemas";
import type { FindingCategory } from "../types/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Icon } from "@iconify/react";
import type { SearchFormValues } from "../schemas/searchSchemas";
import { useUiStore } from "../store/uiStore";

const sourceCategoryIcon: Record<FindingCategory, string> = {
  SOCIAL: "mdi:github",
  INFRASTRUCTURE: "mdi:google",
  CONTEXTUAL: "mdi:wikipedia"
};

export const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);
  const [isFindingModalOpen, setIsFindingModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"ALL" | "SOCIAL" | "INFRASTRUCTURE" | "CONTEXTUAL">("ALL");
  const setLastSearchParams = useUiStore((state) => state.setLastSearchParams);
  const authSessionQuery = useAuthSession();
  const isLoggedIn = authSessionQuery.data?.authenticated === true;
  const initialFormValues = useMemo<SearchFormValues>(() => {
    const entityType = searchParams.get("entityType");
    const parsedEntityType =
      entityType === "PERSON" || entityType === "COMPANY" || entityType === "UNKNOWN" ? entityType : "UNKNOWN";

    return {
      query: searchParams.get("q") ?? "",
      entityType: parsedEntityType,
      aliases: searchParams.get("aliases") ?? "",
      location: searchParams.get("location") ?? "",
      industry: searchParams.get("industry") ?? ""
    };
  }, [searchParams]);
  const queryFromUrl = initialFormValues.query.trim();

  const sourcesQuery = useSearchSources();
  const searchDataQuery = useSearchData(
    {
      query: queryFromUrl,
      entityType: initialFormValues.entityType,
      aliases: initialFormValues.aliases,
      location: initialFormValues.location,
      industry: initialFormValues.industry
    },
    queryFromUrl.length > 0
  );
  const discoveryFeedQuery = useDiscoveryFeed();

  const currentRun = queryFromUrl ? (searchDataQuery.data ?? null) : null;
  const activeFindings = useMemo(() => {
    if (currentRun) {
      return currentRun.findings;
    }
    if (!queryFromUrl) {
      return discoveryFeedQuery.data ?? [];
    }
    return [];
  }, [currentRun, discoveryFeedQuery.data, queryFromUrl]);

  const isResultsLoading =
    (queryFromUrl
      ? searchDataQuery.isFetching
      : !currentRun && discoveryFeedQuery.isLoading);
  const effectiveSelectedFindingId =
    selectedFindingId && activeFindings.some((item: Finding) => item.id === selectedFindingId)
      ? selectedFindingId
      : (activeFindings[0]?.id ?? null);
  const selectedFinding = activeFindings.find((item: Finding) => item.id === effectiveSelectedFindingId) ?? null;

  return (
    <section>
      <div className={`grid grid-cols-1 gap-4 ${isLoggedIn ? "xl:grid-cols-[320px_1fr]" : "xl:grid-cols-[320px_1fr_320px]"}`}>
        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">New Search</h2>
            <SearchForm
              isLoggedIn={isLoggedIn}
              initialValues={initialFormValues}
              onSubmitStart={(submitted) => {
                const nextParams = new URLSearchParams(searchParams);
                nextParams.set("q", submitted.query);
                nextParams.set("entityType", submitted.entityType);
                if (submitted.aliases) {
                  nextParams.set("aliases", submitted.aliases);
                } else {
                  nextParams.delete("aliases");
                }
                if (submitted.location) {
                  nextParams.set("location", submitted.location);
                } else {
                  nextParams.delete("location");
                }
                if (submitted.industry) {
                  nextParams.set("industry", submitted.industry);
                } else {
                  nextParams.delete("industry");
                }

                const nextSearch = nextParams.toString();
                setLastSearchParams(nextSearch || null);
                setSelectedFindingId(null);
                setIsFindingModalOpen(false);
                navigate(`/?${nextSearch}`);
              }}
              onClear={() => {
                setLastSearchParams(null);
                setSelectedFindingId(null);
                setIsFindingModalOpen(false);
                navigate("/");
              }}
            />
          </Card>

          <Card className="p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-600">Sources</h2>
            <div className="space-y-5">
              {sourcesQuery.data?.all.map((source) => (
                <Card key={`${source.category}-${source.provider}`} className="px-4 py-4">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Icon icon={sourceCategoryIcon[source.category]} className="h-4 w-4" />
                    {source.provider}
                  </p>
                  <p className="text-xs text-slate-500">{source.category}</p>
                </Card>
              ))}
              {!sourcesQuery.isLoading && (sourcesQuery.data?.all.length ?? 0) === 0 && (
                <p className="text-sm text-slate-600">No sources configured.</p>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                {queryFromUrl ? `Search Results: ${queryFromUrl}` : currentRun ? `Search Results: ${currentRun.query}` : "Discovery Feed"}
              </h2>
              {isLoggedIn && currentRun?.id && <ReportActions searchRunId={currentRun.id} />}
            </div>
            
            <ResultsDashboard
              isLoading={isResultsLoading}
              findings={activeFindings}
              activeCategory={activeCategory}
              selectedFindingId={selectedFindingId}
              onSelectFinding={(id) => {
                setSelectedFindingId(id);
                setIsFindingModalOpen(true);
              }}
              onCategoryChange={setActiveCategory}
            />
          </Card>
        </div>

        {!isLoggedIn && (
          <div className="space-y-4">
            <Card className="p-5">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">Access features</h2>
              <AuthPanel />
            </Card>
          </div>
        )}
      </div>

      <Dialog open={isFindingModalOpen} onOpenChange={setIsFindingModalOpen}>
        <DialogContent>
          <DialogHeader className="flex items-center justify-between">
            <DialogTitle>Finding Detail</DialogTitle>
          </DialogHeader>
          <FindingDetail finding={selectedFinding} />
          <div className="mt-3 flex justify-end">
            <Button variant="outline" onClick={() => setIsFindingModalOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
