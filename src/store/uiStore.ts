import { create } from "zustand";
import type { FindingCategory } from "../types/api";
import type { SearchCreateResult } from "../schemas/apiSchemas";

type CategoryFilter = "ALL" | FindingCategory;

type UiState = {
  selectedSearchRunId: string | null;
  selectedFindingId: string | null;
  activeCategory: CategoryFilter;
  transientRun: SearchCreateResult | null;
  lastSearchParams: string | null;
  pendingSearchQuery: string | null;
  setSelectedSearchRunId: (value: string | null) => void;
  setSelectedFindingId: (value: string | null) => void;
  setActiveCategory: (value: CategoryFilter) => void;
  setTransientRun: (value: SearchCreateResult | null) => void;
  setLastSearchParams: (value: string | null) => void;
  setPendingSearchQuery: (value: string | null) => void;
};

export const useUiStore = create<UiState>((set) => ({
  selectedSearchRunId: null,
  selectedFindingId: null,
  activeCategory: "ALL",
  transientRun: null,
  lastSearchParams: null,
  pendingSearchQuery: null,
  setSelectedSearchRunId: (value) =>
    set(() => ({
      selectedSearchRunId: value,
      selectedFindingId: null
    })),
  setSelectedFindingId: (value) => set(() => ({ selectedFindingId: value })),
  setActiveCategory: (value) => set(() => ({ activeCategory: value })),
  setTransientRun: (value) => set(() => ({ transientRun: value })),
  setLastSearchParams: (value) => set(() => ({ lastSearchParams: value })),
  setPendingSearchQuery: (value) => set(() => ({ pendingSearchQuery: value }))
}));
