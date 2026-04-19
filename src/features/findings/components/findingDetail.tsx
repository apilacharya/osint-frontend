import clsx from "clsx";
import type { Finding } from "../../../schemas/apiSchemas";
import { formatDateTime } from "../../../lib/date";

type Props = {
  finding: Finding | null;
};

const severityColor: Record<string, string> = {
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  critical: "bg-red-50 text-red-700 border-red-200"
};

export const FindingDetail = ({ finding }: Props) => {
  if (!finding) {
    return null;
  }

  const imageContext =
    (finding.rawPayload.avatar_url as string | undefined) ||
    (finding.rawPayload.avatarUrl as string | undefined) ||
    (finding.rawPayload.image as string | undefined) ||
    ((finding.rawPayload.thumbnail as { source?: string } | undefined)?.source as string | undefined) ||
    (finding.rawPayload.logo_url as string | undefined);

  return (
    <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
      {/* Header with optional image */}
      <div className="flex items-start gap-3">
        {imageContext && (
          <img
            src={imageContext}
            alt={finding.title}
            className="h-14 w-14 shrink-0 rounded-lg border border-slate-200 object-cover"
            loading="lazy"
          />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="break-words text-sm font-semibold text-slate-900">{finding.title}</h3>
          <p className="mt-1 break-words text-sm leading-relaxed text-slate-600">{finding.summary}</p>
        </div>
      </div>

      {/* Metadata grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg bg-slate-50 p-3 text-sm">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Category</dt>
          <dd className="mt-0.5 font-medium text-slate-800">{finding.category}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Confidence</dt>
          <dd className="mt-0.5 font-medium text-slate-800">{(finding.confidence * 100).toFixed(0)}%</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Source</dt>
          <dd className="mt-0.5">
            <a
              className="break-all text-sm text-blue-600 hover:underline"
              target="_blank"
              rel="noreferrer"
              href={finding.source.url}
            >
              {finding.source.url}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Retrieved</dt>
          <dd className="mt-0.5 text-slate-700">{formatDateTime(finding.retrievedAt)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Provider</dt>
          <dd className="mt-0.5 text-slate-700">{finding.source.provider ?? "--"}</dd>
        </div>
      </div>

      {/* Risk assessment */}
      {finding.riskAssessment && (
        <div
          className={clsx(
            "rounded-lg border p-3 text-sm",
            severityColor[finding.riskAssessment.severity] ?? "bg-slate-50 text-slate-700 border-slate-200"
          )}
        >
          <p className="font-semibold">
            Risk: {finding.riskAssessment.severity} ({finding.riskAssessment.score})
          </p>
          <p className="mt-1 text-sm opacity-80">{finding.riskAssessment.rationale}</p>
        </div>
      )}

      {/* Raw payload */}
      <details className="group">
        <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-wide text-slate-400 transition-colors hover:text-slate-600">
          Raw payload
        </summary>
        <pre className="mt-2 max-h-52 overflow-auto rounded-lg bg-slate-950 p-3 text-xs leading-relaxed text-slate-300">
          {JSON.stringify(finding.rawPayload, null, 2)}
        </pre>
      </details>
    </div>
  );
};
