export type EntityType = "PERSON" | "COMPANY" | "UNKNOWN";
export type FindingCategory = "SOCIAL" | "INFRASTRUCTURE" | "CONTEXTUAL";
export type RiskSeverity = "low" | "medium" | "high" | "critical";
export type ReportFormat = "MARKDOWN" | "PDF";
export type SearchMode = "guest" | "authenticated";

export type SearchCreateInput = {
  query: string;
  entityType?: EntityType;
  context?: {
    aliases?: string[];
    location?: string;
    industry?: string;
  };
};

export type SearchRunListParams = {
  query?: string;
  status?: "RUNNING" | "COMPLETED" | "FAILED";
  entityType?: EntityType;
};

export type SearchRunDetailParams = {
  category?: FindingCategory;
  riskSeverity?: RiskSeverity;
  sourceProvider?: string;
  minConfidence?: number;
};

export type CreateReportInput = {
  searchRunId: string;
  format: "markdown" | "pdf";
};

export type ReportListParams = {
  searchRunId?: string;
  format?: ReportFormat;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};
