"use client";

import { create } from "zustand";

export type SortOption = "featured" | "price-asc" | "price-desc";

type ProductFiltersState = {
  query: string;
  category: string | null;
  sort: SortOption;
  setQuery: (query: string) => void;
  setCategory: (category: string | null) => void;
  setSort: (sort: SortOption) => void;
  reset: () => void;
};

export const useProductFilters = create<ProductFiltersState>((set) => ({
  query: "",
  category: null,
  sort: "featured",
  setQuery: (query) => set({ query }),
  setCategory: (category) => set({ category }),
  setSort: (sort) => set({ sort }),
  reset: () => set({ query: "", category: null, sort: "featured" }),
}));