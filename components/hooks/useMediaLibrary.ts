"use client";
import { useState, useEffect, useCallback } from "react";
import type { Media } from "../MediaCard";
import type { NewEntry } from "../AddEntryModal";
import type { FiltersApi } from "./useFilters";

type ApiResponse = {
  items: Media[];
  totalAll: number;
  totalFav: number;
  totalLater: number;
  catCounts: Record<string, number>;
  tags: string[];
};

const EMPTY: ApiResponse = { items: [], totalAll: 0, totalFav: 0, totalLater: 0, catCounts: {}, tags: [] };

/**
 * Owns the media list: fetching it for the current filters, the open-detail
 * selection, and the optimistic mutations (favorite / bookmark / shuffle / create).
 */
export function useMediaLibrary(filters: FiltersApi) {
  const { debouncedQuery, activeCat, view, minRating, sortKey, setView, setActiveCat } = filters;

  const [data, setData] = useState<ApiResponse>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMedia, setOpenMedia] = useState<Media | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (debouncedQuery) params.set("q", debouncedQuery);
      if (activeCat !== "All") params.set("cat", activeCat);
      if (view === "fav") params.set("fav", "1");
      if (view === "later") params.set("bookmark", "1");
      if (minRating > 0) params.set("minRating", String(minRating));
      params.set("sort", sortKey);
      const res = await fetch(`/api/media?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: ApiResponse = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, activeCat, view, minRating, sortKey]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const toggleFav = useCallback(
    async (m: Media) => {
      const next = !m.fav;
      setData((d) => ({
        ...d,
        items:
          view === "fav" && !next
            ? d.items.filter((it) => it._id !== m._id)
            : d.items.map((it) => (it._id === m._id ? { ...it, fav: next } : it)),
        totalFav: Math.max(0, d.totalFav + (next ? 1 : -1)),
      }));
      setOpenMedia((cur) => (cur?._id === m._id ? { ...cur, fav: next } : cur));
      try {
        await fetch(`/api/media/${m._id}/favorite`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fav: next }),
        });
      } catch {
        refetch();
      }
    },
    [refetch, view]
  );

  const toggleBookmark = useCallback(
    async (m: Media) => {
      const next = !m.bookmark;
      setData((d) => ({
        ...d,
        items:
          view === "later" && !next
            ? d.items.filter((it) => it._id !== m._id)
            : d.items.map((it) => (it._id === m._id ? { ...it, bookmark: next } : it)),
        totalLater: Math.max(0, d.totalLater + (next ? 1 : -1)),
      }));
      setOpenMedia((cur) => (cur?._id === m._id ? { ...cur, bookmark: next } : cur));
      try {
        await fetch(`/api/media/${m._id}/bookmark`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookmark: next }),
        });
      } catch {
        refetch();
      }
    },
    [refetch, view]
  );

  const shuffle = useCallback(() => {
    setData((d) => ({ ...d, items: [...d.items].sort(() => Math.random() - 0.5) }));
  }, []);

  const createEntry = useCallback(
    async (entry: NewEntry): Promise<{ ok: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) return { ok: false, error: json.error ?? `HTTP ${res.status}` };
        // Surface the new entry: show everything, newest first.
        setView("recent");
        setActiveCat("All");
        await refetch();
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : "Network error" };
      }
    },
    [refetch, setView, setActiveCat]
  );

  const updateEntry = useCallback(
    async (id: string, entry: NewEntry): Promise<{ ok: boolean; error?: string }> => {
      try {
        const res = await fetch(`/api/media/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) return { ok: false, error: json.error ?? `HTTP ${res.status}` };
        setOpenMedia((cur) => (cur?._id === id ? { ...cur, ...json.item } : cur));
        await refetch();
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : "Network error" };
      }
    },
    [refetch]
  );

  const deleteEntry = useCallback(
    async (id: string): Promise<{ ok: boolean; error?: string }> => {
      try {
        const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          return { ok: false, error: json.error ?? `HTTP ${res.status}` };
        }
        setOpenMedia((cur) => (cur?._id === id ? null : cur));
        await refetch();
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : "Network error" };
      }
    },
    [refetch]
  );

  return {
    items: data.items,
    totalAll: data.totalAll,
    totalFav: data.totalFav,
    totalLater: data.totalLater,
    catCounts: data.catCounts,
    tags: data.tags,
    loading,
    error,
    openMedia,
    setOpenMedia,
    refetch,
    toggleFav,
    toggleBookmark,
    shuffle,
    createEntry,
    updateEntry,
    deleteEntry,
  };
}
