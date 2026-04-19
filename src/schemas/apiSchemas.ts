import { z } from "zod";

export const errorEnvelopeSchema = z.object({
  success: z.literal(false),
  data: z.null(),
  meta: z.record(z.string(), z.unknown()).default({}),
  error: z.object({
    code: z.number(),
    type: z.string(),
    message: z.string(),
    details: z.record(z.string(), z.unknown()).optional()
  })
});

export const toSuccessEnvelopeSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    meta: z.record(z.string(), z.unknown()).default({}),
    error: z.null()
  });

const entitySchema = z.object({
  id: z.string(),
  name: z.string(),
  normalizedName: z.string(),
  type: z.enum(["PERSON", "COMPANY", "UNKNOWN"]),
  aliases: z.array(z.string()),
  location: z.string().nullable(),
  industry: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string()
});

const sourceSchema = z.object({
  id: z.string(),
  provider: z.string(),
  url: z.string().url(),
  retrievedAt: z.string()
});

const riskAssessmentSchema = z.object({
  id: z.string(),
  findingId: z.string(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  score: z.number(),
  rationale: z.string(),
  createdAt: z.string()
});

export const findingSchema = z.object({
  id: z.string(),
  category: z.enum(["SOCIAL", "INFRASTRUCTURE", "CONTEXTUAL"]),
  title: z.string(),
  summary: z.string(),
  confidence: z.number(),
  confidenceSignals: z.record(z.string(), z.unknown()),
  rawPayload: z.record(z.string(), z.unknown()),
  retrievedAt: z.string(),
  entityId: z.string(),
  searchRunId: z.string(),
  sourceId: z.string(),
  source: sourceSchema,
  riskAssessment: riskAssessmentSchema.nullable()
});

export const reportSchema = z.object({
  id: z.string(),
  searchRunId: z.string(),
  format: z.enum(["MARKDOWN", "PDF"]),
  fileName: z.string(),
  content: z.string(),
  createdAt: z.string()
});

export const reportListItemSchema = reportSchema.extend({
  searchRun: z.object({
    id: z.string(),
    query: z.string()
  })
});

export const authUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.string()
});

export const authSessionSchema = z.object({
  authenticated: z.boolean(),
  mode: z.enum(["guest", "authenticated"]).optional(),
  user: authUserSchema.nullable()
});

export const searchCreateResultSchema = z.object({
  id: z.string(),
  status: z.enum(["RUNNING", "COMPLETED", "FAILED"]),
  persisted: z.boolean(),
  query: z.string(),
  startedAt: z.string(),
  completedAt: z.string(),
  entity: entitySchema,
  findingCount: z.number(),
  findings: z.array(findingSchema)
});

export const searchListItemSchema = z.object({
  id: z.string(),
  query: z.string(),
  queryContext: z.unknown(),
  status: z.enum(["RUNNING", "COMPLETED", "FAILED"]),
  startedAt: z.string(),
  completedAt: z.string().nullable(),
  entityId: z.string(),
  entity: entitySchema,
  _count: z.object({
    findings: z.number(),
    reports: z.number()
  })
});

export const searchRunDetailSchema = z.object({
  id: z.string(),
  query: z.string(),
  queryContext: z.unknown(),
  status: z.enum(["RUNNING", "COMPLETED", "FAILED"]),
  startedAt: z.string(),
  completedAt: z.string().nullable(),
  entityId: z.string(),
  entity: entitySchema,
  findings: z.array(findingSchema),
  reports: z.array(reportSchema)
});

export const searchSourcesSchema = z.object({
  all: z.array(
    z.object({
      provider: z.string(),
      category: z.enum(["SOCIAL", "INFRASTRUCTURE", "CONTEXTUAL"])
    })
  ),
  byCategory: z.record(z.string(), z.array(z.string()))
});

export type SearchCreateResult = z.infer<typeof searchCreateResultSchema>;
export type SearchListItem = z.infer<typeof searchListItemSchema>;
export type SearchRunDetail = z.infer<typeof searchRunDetailSchema>;
export type Finding = z.infer<typeof findingSchema>;
export type AuthSession = z.infer<typeof authSessionSchema>;
export type ReportListItem = z.infer<typeof reportListItemSchema>;
export type SearchSources = z.infer<typeof searchSourcesSchema>;
