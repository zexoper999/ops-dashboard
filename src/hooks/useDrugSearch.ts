import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { DrugSearchMode, DrugSearchResponse } from "@/types/drug";

const DEBOUNCE_MS = 400;

export function useDrugSearch(query: string, mode: DrugSearchMode) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  return useQuery<DrugSearchResponse>({
    queryKey: ["drug-search", debouncedQuery, mode],
    queryFn: () =>
      api.get(`/api/drug-search?q=${encodeURIComponent(debouncedQuery)}&mode=${mode}`),
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });
}
