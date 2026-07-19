"use client";
import * as React from "react";
import { useDebounced } from "./useDebounced";
import { usePersistentState } from "./usePersistentState";

export type View = "all" | "fav" | "recent" | "later";

/** Owns the search/sort/category/rating filter state that drives the query. */
export function useFilters() {
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounced(query, 200);
  const [view, setViewRaw] = usePersistentState<View>("joi:filters:view", "all");
  const [activeCat, setActiveCat] = usePersistentState<string>("joi:filters:cat", "All");
  const [sortKey, setSortKey] = usePersistentState<string>("joi:filters:sort", "recent");
  const [minRating, setMinRating] = usePersistentState<number>("joi:filters:minRating", 0);

  // Selecting "Recently added" also pins the sort.
  const setView = React.useCallback((v: View) => {
    setViewRaw(v);
    if (v === "recent") setSortKey("recent");
  }, []);

  const resetFilters = React.useCallback(() => {
    setMinRating(0);
    setView("all");
    setActiveCat("All");
    setQuery("");
  }, [setView]);

  return {
    query,
    setQuery,
    debouncedQuery,
    view,
    setView,
    activeCat,
    setActiveCat,
    sortKey,
    setSortKey,
    minRating,
    setMinRating,
    resetFilters,
  };
}

export type FiltersApi = ReturnType<typeof useFilters>;
