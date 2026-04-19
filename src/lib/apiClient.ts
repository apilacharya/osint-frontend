import axios from "axios";
import { z } from "zod";
import { errorEnvelopeSchema, toSuccessEnvelopeSchema } from "../schemas/apiSchemas";
import type {
  CreateReportInput,
  LoginInput,
  RegisterInput,
  ReportListParams,
  SearchCreateInput,
  SearchRunListParams
} from "../types/api";
import {
  authSessionSchema,
  findingSchema,
  reportSchema,
  reportListItemSchema,
  searchCreateResultSchema,
  searchListItemSchema,
  searchRunDetailSchema
} from "../schemas/apiSchemas";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";
const http = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export type ApiClientError = Error & {
  status: number;
  code?: number;
  type?: string;
  isApiClientError: true;
};

const createApiClientError = (message: string, status: number, code?: number, type?: string): ApiClientError => {
  const error = new Error(message) as ApiClientError;
  error.status = status;
  error.code = code;
  error.type = type;
  error.isApiClientError = true;
  return error;
};

const parseSuccessData = <T extends z.ZodTypeAny>(payload: unknown, dataSchema: T): z.infer<T> => {
  const envelopeSchema = toSuccessEnvelopeSchema(dataSchema);
  const parsed = envelopeSchema.safeParse(payload);
  if (!parsed.success) {
    throw createApiClientError("Unexpected API response format.", 500);
  }

  const envelope = parsed.data as { data: z.infer<T> };
  return envelope.data;
};

const request = async <T extends z.ZodTypeAny>(
  method: "GET" | "POST",
  path: string,
  dataSchema: T,
  payload?: unknown,
  signal?: AbortSignal
): Promise<z.infer<T>> => {
  try {
    const response = await http.request({
      method,
      url: path,
      data: method === "POST" ? payload : undefined,
      params: method === "GET" ? payload : undefined,
      signal
    });
    return parseSuccessData(response.data, dataSchema);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const parsedError = errorEnvelopeSchema.safeParse(error.response?.data);
      if (parsedError.success) {
        throw createApiClientError(
          parsedError.data.error.message,
          error.response?.status ?? 500,
          parsedError.data.error.code,
          parsedError.data.error.type
        );
      }
      throw createApiClientError(error.message || "Request failed.", error.response?.status ?? 500);
    }
    throw createApiClientError("Request failed.", 500);
  }
};

export const apiClient = {
  register: (input: RegisterInput) => request("POST", "/auth/register", authSessionSchema, input),
  login: (input: LoginInput) => request("POST", "/auth/login", authSessionSchema, input),
  logout: () => request("POST", "/auth/logout", z.object({ loggedOut: z.boolean() })),
  getAuthSession: () => request("GET", "/auth/me", authSessionSchema),
  runSearch: async (input: SearchCreateInput, signal?: AbortSignal) => {
    const aliases = input.context?.aliases?.filter(Boolean) ?? [];
    return request(
      "GET",
      "/search",
      searchCreateResultSchema,
      {
        q: input.query,
        entityType: input.entityType,
        aliases: aliases.length > 0 ? aliases.join(",") : undefined,
        location: input.context?.location,
        industry: input.context?.industry
      },
      signal
    );
  },
  listSearchRuns: async (params: SearchRunListParams = {}) => {
    const result = await request("GET", "/history", z.array(searchListItemSchema), {
      query: params.query,
      status: params.status,
      entityType: params.entityType
    });
    return result;
  },
  getHomepageData: async (signal?: AbortSignal) => {
    const result = await request(
      "GET",
      "/search",
      z.object({
        sources: z.object({
          all: z.array(z.object({ provider: z.string(), category: z.enum(["SOCIAL", "INFRASTRUCTURE", "CONTEXTUAL"]) })),
          byCategory: z.record(z.string(), z.array(z.string()))
        }),
        feed: z.array(findingSchema)
      }),
      undefined,
      signal
    );
    return result;
  },
  listSearchSources: async (signal?: AbortSignal) => {
    const data = await apiClient.getHomepageData(signal);
    return data.sources;
  },
  getDiscoveryFeed: async (signal?: AbortSignal) => {
    const data = await apiClient.getHomepageData(signal);
    return data.feed;
  },
  getSearchRun: async (id: string) => {
    const result = await request("GET", `/search/${id}`, searchRunDetailSchema);
    return result;
  },
  createReport: (input: CreateReportInput) => request("POST", "/reports", reportSchema, input),
  listReports: async (params: ReportListParams = {}) => {
    const result = await request("GET", "/reports", z.array(reportListItemSchema), {
      searchRunId: params.searchRunId,
      format: params.format
    });
    return result;
  },
  getReport: async (id: string) => {
    const result = await request("GET", `/reports/${id}`, reportSchema);
    return result;
  }
};
