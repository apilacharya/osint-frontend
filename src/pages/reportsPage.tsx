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
  const paginatedItems = items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (!isLoggedIn) {
    return (
      <Card className="p-5">
        <p className="text-sm text-slate-700">Login is required to view generated reports.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">Report Filters</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Select
            value={format ?? ""}
            onChange={(event) => {
              const next = new URLSearchParams(searchParams);
              if (event.target.value) next.set("format", event.target.value);
              else next.delete("format");
              setCurrentPage(1);
              setSearchParams(next);
            }}
          >
            <option value="">All formats</option>
            <option value="MARKDOWN">MARKDOWN</option>
            <option value="PDF">PDF</option>
          </Select>
          <Input
            value={searchRunId ?? ""}
            onChange={(event) => {
              const next = new URLSearchParams(searchParams);
              if (event.target.value) next.set("searchRunId", event.target.value);
              else next.delete("searchRunId");
              setCurrentPage(1);
              setSearchParams(next);
            }}
            placeholder="Filter by Search Run ID"
          />
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">Downloaded Reports</h2>
        {reportsQuery.isFetching && items.length === 0 && (
          <div className="mb-3 inline-flex items-center gap-2 text-xs font-medium text-slate-500">
            <Spin size="small" />
            Loading reports...
          </div>
        )}
        <div className="space-y-3">
          {paginatedItems.map((report) => (
            <Card key={report.id} className="px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{report.fileName}</p>
                  <p className="text-xs text-slate-600">
                    {report.format} · {formatDateTime(report.createdAt)}
                  </p>
                  <p className="text-xs text-slate-500">
                    Run: {report.searchRun.query} ({report.searchRun.id})
                  </p>
                </div>
                <Button type="button" variant="outline" onClick={() => triggerReportDownload(report)}>
                  Download
                </Button>
              </div>
            </Card>
          ))}
          {!reportsQuery.isLoading && items.length === 0 && <p className="text-sm text-slate-600">No reports found.</p>}
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
