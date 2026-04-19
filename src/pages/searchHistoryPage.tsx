import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSearchRuns } from "../hooks/useSearch";
import { useAuthSession } from "../hooks/useAuth";
import { formatDateTime } from "../lib/date";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { Card } from "../components/ui/card";
import { Pagination, Spin } from "antd";

export const SearchHistoryPage = () => {
  const PAGE_SIZE = 7;
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const authSessionQuery = useAuthSession();
  const isLoggedIn = authSessionQuery.data?.authenticated === true;

  const query = searchParams.get("query") ?? undefined;
  const entityType = (searchParams.get("entityType") as "PERSON" | "COMPANY" | "UNKNOWN" | null) ?? undefined;

  const listQuery = useSearchRuns({ query, entityType }, isLoggedIn);
  const items = listQuery.data ?? [];
  const paginatedItems = items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const onFilterChange = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setCurrentPage(1);
    setSearchParams(next);
  };

  const filterDefaults = useMemo(
    () => ({
      query: query ?? "",
      entityType: entityType ?? ""
    }),
    [entityType, query]
  );

  const toSearchLink = (run: (typeof items)[number]) => {
    const next = new URLSearchParams();
    next.set("q", run.query);
    next.set("entityType", run.entity.type);

    const context = run.queryContext as {
      aliases?: string[];
      location?: string;
      industry?: string;
    } | null;

    if (context?.aliases?.length) {
      next.set("aliases", context.aliases.join(", "));
    }
    if (context?.location) {
      next.set("location", context.location);
    }
    if (context?.industry) {
      next.set("industry", context.industry);
    }

    return `/?${next.toString()}`;
  };

  if (!isLoggedIn) {
    return (
      <Card className="p-5">
        <p className="text-sm text-slate-700">Login is required to view search history.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">Search History</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Input
            value={filterDefaults.query}
            onChange={(event) => onFilterChange("query", event.target.value)}
            placeholder="Filter by target"
          />
          <Select
            value={filterDefaults.entityType}
            onChange={(event) => onFilterChange("entityType", event.target.value)}
          >
            <option value="">All entity types</option>
            <option value="PERSON">PERSON</option>
            <option value="COMPANY">COMPANY</option>
            <option value="UNKNOWN">UNKNOWN</option>
          </Select>
        </div>
      </Card>

      <Card className="p-5">
        {listQuery.isFetching && items.length === 0 && (
          <div className="mb-3 inline-flex items-center gap-2 text-xs font-medium text-slate-500">
            <Spin size="small" />
            Loading search history...
          </div>
        )}
        <div className="space-y-3">
          {paginatedItems.map((run) => (
            <Card key={run.id} className="p-0">
              <Link to={toSearchLink(run)} className="block rounded-xl px-4 py-4 hover:bg-slate-50">
                <p className="text-sm font-semibold text-slate-900">{run.query}</p>
                <p className="mt-1 text-xs text-slate-500">{formatDateTime(run.startedAt)}</p>
                <p className="mt-1 text-xs text-slate-600">
                  Findings: {run._count.findings}
                </p>
              </Link>
            </Card>
          ))}
          {!listQuery.isLoading && items.length === 0 && <p className="text-sm text-slate-600">No search runs found.</p>}
          {items.length > PAGE_SIZE && (
            <div className="mt-4 flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={PAGE_SIZE}
                total={items.length}
                showSizeChanger={false}
                onChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </div>

      </Card>
    </div>
  );
};
