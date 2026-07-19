"use client";
import * as React from "react";
import { useFilters } from "./hooks/useFilters";
import { useMediaLibrary } from "./hooks/useMediaLibrary";
import { usePersistentState } from "./hooks/usePersistentState";
import type { Media } from "./MediaCard";

export type { View } from "./hooks/useFilters";

type DashboardContextValue = ReturnType<typeof useFilters> &
  ReturnType<typeof useMediaLibrary> & {
    privacyBlur: boolean;
    setPrivacyBlur: React.Dispatch<React.SetStateAction<boolean>>;
    showAdd: boolean;
    setShowAdd: React.Dispatch<React.SetStateAction<boolean>>;
    editingMedia: Media | null;
    setEditingMedia: React.Dispatch<React.SetStateAction<Media | null>>;
    navOpen: boolean;
    setNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };

const DashboardContext = React.createContext<DashboardContextValue | null>(null);

export function useDashboard(): DashboardContextValue {
  const ctx = React.useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within a <DashboardProvider>");
  return ctx;
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const filters = useFilters();
  const library = useMediaLibrary(filters);
  const [privacyBlur, setPrivacyBlur] = usePersistentState<boolean>("joi:privacyBlur", false);
  const [showAdd, setShowAdd] = React.useState(false);
  const [editingMedia, setEditingMedia] = React.useState<Media | null>(null);
  const [navOpen, setNavOpen] = React.useState(false);

  const value: DashboardContextValue = {
    ...filters,
    ...library,
    privacyBlur,
    setPrivacyBlur,
    showAdd,
    setShowAdd,
    editingMedia,
    setEditingMedia,
    navOpen,
    setNavOpen,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}
