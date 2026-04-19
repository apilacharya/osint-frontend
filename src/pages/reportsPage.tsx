import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuthSession } from "../hooks/useAuth";
import { useReports } from "../hooks/useReports";
import { formatDateTime } from "../lib/date";
import { triggerReportDownload } from "../lib/reportDownload";
import { Select } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Pagination, Spin } from "antd";

function ReportFilters({
  format,
  searchRunId,
  onFilterChange
}: {
  format: string;
  searchRunId: string;
  onFilterChange: (key: string, value: string) => void;
}) {
  return (
    <Card className="p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">Report Filters</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Select value={format} onChange={(e) => onFilterChange("format", e.target.value)}>
          <option value="">All formats</option>
          <option value="MARKDOWN">MARKDOWN</option>
          <option value="PDF">PDF</option>
        </Select>
        <Input
          value={searchRunId}
          onChange={(e) => onFilterChange("searchRunId", e.target.value)}
          placeholder="Filter by Search Run ID"
        />
      </div>
    </Card>
  );
}

function ReportCard({ report }: { report: any }) {
  return (
    <Card className="px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{report.fileName}</p>
          <p className="text-xs text-slate-600 mt-1">
            {report.format} · {formatDateTime(report.createdAt)}
          </p>
          <p className="text-xs text-slate-500 mt-1 truncate">
            Run: {report.searchRun.query} ({report.searchRun.id})
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => triggerReportDownload(report)}
          className="shrink-0"
        >
          Download
        </Button>
      </div>
    </Card>
  );
}

function ReportsList({
  items,
  isLoading,
  currentPage,
  pageSize,
  onPageChange
}: {
  items: any[];
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  const paginatedItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Card className="p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">Downloaded Reports</h2>
      {isLoading && items.length === 0 && (
        <div className="mb-3 inline-flex items-center gap-2 text-xs font-medium text-slate-500">
          <Spin size="small" />
          Loading reports...
        </div>
      )}
      <div className="space-y-3">
        {paginatedItems.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
        {!isLoading && items.length === 0 && (
          <p className="text-sm text-slate-600">No reports found.</p>
        )}
        {items.length > pageSize && (
          <div className="mt-4 flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={items.length}
              showSizeChanger={false}
              onChange={onPageChange}
            />
          </div>
        )}
      </div>
    </Card>
  );
}

export const ReportsPage = () => {
  const PAGE_SIZE = 7;
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  
  const authSessionQuery = useAuthSession();
  const isLoggedIn = authSessionQuery.data?.authenticated === true;

  const format = (searchParams.get("format") as "MARKDOWN" | "PDF" | null) ?? undefined;
  const searchRunId = searchParams.get("searchRunId") ?? undefined;

  const reportsQuery = useReports({ format, searchRunId }, isLoggedIn);
  const items = reportsQuery.data ?? [];

  function onFilterChange(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setCurrentPage(1);
    setSearchParams(next);
  }

  if (!isLoggedIn) {
    return (
      <Card className="p-5">
        <p className="text-sm text-slate-700">Login is required to view generated reports.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <ReportFilters
        format={format ?? ""}
        searchRunId={searchRunId ?? ""}
        onFilterChange={onFilterChange}
      />
      <ReportsList
        items={items}
        isLoading={reportsQuery.isFetching && items.length === 0}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
