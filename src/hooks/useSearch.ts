import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import type { EntityType, SearchRunListParams } from "../types/api";

export const useSearchRuns = (params: SearchRunListParams = {}, enabled = true) =>
  useQuery({
    queryKey: ["search-runs", params],
    queryFn: () => apiClient.listSearchRuns(params),
    enabled
  });

type SearchDataParams = {
  query: string;
  entityType: string;
  aliases?: string;
  location?: string;
  industry?: string;
};

export const useSearchData = (params: SearchDataParams, enabled = true) =>
  useQuery({
    queryKey: ["search-data", params],
    queryFn: ({ signal }) =>
      apiClient.runSearch(
        {
          query: params.query,
          entityType: params.entityType as EntityType,
          context: {
            aliases: params.aliases
              ? params.aliases
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean)
              : undefined,
            location: params.location || undefined,
            industry: params.industry || undefined
          }
        },
        signal
      ),
    enabled: Boolean(params.query) && enabled,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });

export const useSearchSources = () =>
  useQuery({
    queryKey: ["homepage-data"],
    queryFn: async ({ signal }) => {
      return apiClient.getHomepageData(signal);
    },
    select: (data) => data.sources
  });

export const useDiscoveryFeed = () =>
  useQuery({
    queryKey: ["homepage-data"],
    queryFn: async ({ signal }) => {
      return apiClient.getHomepageData(signal);
    },
    select: (data) => data.feed
  });
