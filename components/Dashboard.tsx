"use client";

import { useEffect, useState} from "react"; 
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Chip } from "./atoms";
import { Icon } from "./Icon";
import { MediaCard } from "./MediaCard";
import { DetailLightbox } from "./DetailLightbox";
import { AddEntryModal } from "./AddEntryModal";
import { DashboardProvider, useDashboard } from "./DashboardContext";

export function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardView />
    </DashboardProvider>
  );
}

function DashboardView() {
  const {
    items,
    totalFav,
    loading,
    error,
    view,
    setView,
    activeCat,
    setActiveCat,
    minRating,
    setMinRating,
    openMedia,
    showAdd,
    navOpen,
    setNavOpen,
    catCounts,
    editingMedia,
  } = useDashboard();

  const [showFilters, setShowFilters] = useState(false);

  // Lock scroll while the mobile drawer is open; close it on Esc or when the
  // viewport grows back to desktop width.
  useEffect(() => {
    if (!navOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setNavOpen(false);
    const onResize = () => window.innerWidth > 980 && setNavOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [navOpen, setNavOpen]);

  const headerTitle =
    activeCat !== "All"
      ? activeCat
      : view === "fav"
        ? "Favorites"
        : view === "later"
          ? "Watch later"
          : view === "recent"
            ? "Recently added"
            : "All media";

  const headerCount = items.length;

  return (
    <div className="joi-shell" style={{ display: "flex", padding: 18, gap: 18, minHeight: "100vh" }}>
      <Sidebar />
      {navOpen && (
        <div
          className="joi-nav-backdrop animate-fade-in"
          onClick={() => setNavOpen(false)}
          aria-hidden="true"
        />
      )}

      <main style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
        <TopBar />

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              key={headerTitle}
              className="animate-fade-in"
              style={{ margin: 0, fontSize: 27, fontWeight: 700, letterSpacing: "-0.025em" }}
            >
              {headerTitle}
            </h1>
            <p
              style={{
                margin: "5px 0 0",
                fontSize: 13,
                color: "var(--ink-3)",
                fontFamily: "var(--mono)",
              }}
            >
              {headerCount} {headerCount === 1 ? "clip" : "clips"} · {totalFav} favorites
            </p>
          </div>
          <Chip
            label="Filters"
            icon="sliders"
            active={showFilters}
            onClick={() => setShowFilters((v) => !v)}
          />
        </div>

        <div
          className="joi-scroll"
          style={{ display: "flex", gap: 9, overflowX: "auto", paddingBottom: 4 }}
        >
          {["All", ...Object.keys(catCounts).sort()].map((name) => (
            <Chip
              key={name}
              label={name}
              active={activeCat === name}
              onClick={() => setActiveCat(name)}
            />
          ))}
        </div>

        {showFilters && (
          <div
            className="joi-glass joi-hl animate-slide-down"
            style={{
              borderRadius: 16,
              padding: 16,
              display: "flex",
              flexWrap: "wrap",
              gap: 22,
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--ink-3)",
                }}
              >
                Min rating
              </span>
              <div style={{ display: "flex", gap: 4 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    onClick={() => setMinRating(minRating === i ? 0 : i)}
                    style={{ background: "transparent", border: "none", padding: 2, cursor: "pointer" }}
                    aria-label={`At least ${i} stars`}
                  >
                    <Icon
                      d="star"
                      size={18}
                      fill={i <= minRating ? "var(--accent)" : "none"}
                      style={{ color: i <= minRating ? "var(--accent)" : "rgba(255,255,255,0.25)" }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 14px",
                borderRadius: 12,
                background: view === "fav" ? "var(--accent-dim)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${view === "fav" ? "var(--accent-brd)" : "var(--glass-brd)"}`,
              }}
            >
              <span style={{ fontSize: 13, color: "var(--ink)" }}>Favorites only</span>
              <button
                onClick={() => setView(view === "fav" ? "all" : "fav")}
                aria-label="Toggle favorites only"
                style={{
                  width: 36,
                  height: 20,
                  borderRadius: 10,
                  background: view === "fav" ? "var(--accent)" : "rgba(255,255,255,0.12)",
                  position: "relative",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 2,
                    left: view === "fav" ? 18 : 2,
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    background: view === "fav" ? "#04201c" : "#fff",
                    transition: "left .15s",
                  }}
                />
              </button>
            </div>

            <ResetFiltersButton />
          </div>
        )}

        {error && (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              background: "rgba(220, 60, 60, 0.12)",
              border: "1px solid rgba(220, 60, 60, 0.35)",
              color: "#ffb4b4",
              fontSize: 13,
            }}
          >
            {error} — is MongoDB running? Set MONGODB_URI in .env.local.
          </div>
        )}

        {!loading && !error && items.length === 0 ? (
          <div
            className="joi-glass animate-scale-in"
            style={{ borderRadius: 16, padding: 40, textAlign: "center", color: "var(--ink-2)" }}
          >
            <div style={{ fontSize: 16, marginBottom: 6 }}>
              {view === "later"
                ? "Nothing saved for later yet."
                : view === "fav"
                  ? "No favorites yet."
                  : "No clips match those filters."}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
              {view === "later"
                ? "Tap the bookmark on any clip to add it here."
                : view === "fav"
                  ? "Tap the heart on any clip to favorite it."
                  : "Try clearing the search or relaxing a filter."}
            </div>
          </div>
        ) : (
          <div
            className="joi-grid-main"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 16,
              alignContent: "start",
              opacity: loading ? 0.55 : 1,
              transition: "opacity .2s",
            }}
          >
            {items.map((m, i) => (
              <MediaCard key={m._id} m={m} index={i} />
            ))}
          </div>
        )}
      </main>

      {openMedia && <DetailLightbox />}
      {(showAdd || editingMedia) && <AddEntryModal />}
    </div>
  );
}

function ResetFiltersButton() {
  const { resetFilters } = useDashboard();
  return (
    <button
      onClick={resetFilters}
      style={{
        marginLeft: "auto",
        background: "transparent",
        border: "none",
        color: "var(--accent)",
        fontFamily: "var(--mono)",
        fontSize: 12,
        cursor: "pointer",
      }}
    >
      Reset all
    </button>
  );
}
