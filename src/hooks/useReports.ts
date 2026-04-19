import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import type { CreateReportInput, ReportListParams } from "../types/api";

export const useCreateReport = () =>
  useMutation({
    mutationFn: (input: CreateReportInput) => apiClient.createReport(input)
  });

export const useReports = (params: ReportListParams = {}, enabled = true) =>
  useQuery({
    queryKey: ["reports", params],
    queryFn: () => apiClient.listReports(params),
    enabled
  });
