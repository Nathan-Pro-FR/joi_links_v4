"use client";
import * as React from "react";
import { Icon } from "./Icon";
import { Wordmark } from "./atoms";
import { useDashboard, type View } from "./DashboardContext";

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        background: on ? "var(--accent)" : "rgba(255,255,255,0.12)",
        position: "relative",
        border: "none",
        cursor: "pointer",
        flex: "0 0 auto",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: on ? 18 : 2,
          width: 16,
          height: 16,
          borderRadius: 8,
          background: on ? "#04201c" : "#fff",
          transition: "left .15s",
        }}
      />
    </button>
  );
}

export function Sidebar() {
  const {
    view,
    setView,
    activeCat,
    setActiveCat,
    catCounts,
    totalAll,
    totalFav,
    totalLater,
    privacyBlur,
    setPrivacyBlur,
    navOpen,
    setNavOpen,
  } = useDashboard();
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const closeNav = () => setNavOpen(false);

  const nav: { label: string; icon: string; key: View; count: number }[] = [
    { label: "All media", icon: "grid", key: "all", count: totalAll },
    { label: "Favorites", icon: "heart", key: "fav", count: totalFav },
    { label: "Recently added", icon: "sparkle", key: "recent", count: totalAll },
    { label: "Watch later", icon: "bookmark", key: "later", count: totalLater },
  ];

  // A nav view is "active" only when no category chip is narrowing the grid.
  const navActive = activeCat === "All";

  return (
    <aside
      className={`joi-glass joi-hl joi-sidebar${navOpen ? " is-open" : ""}`}
      style={{
        width: 244,
        flex: "0 0 auto",
        borderRadius: 22,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 22,
        height: "calc(100vh - 36px)",
        position: "sticky",
        top: 18,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Wordmark />
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeNav}
          className="joi-mobile-only"
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid var(--glass-brd)",
            color: "var(--ink-2)",
            cursor: "pointer",
          }}
        >
          <Icon d="close" size={16} />
        </button>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {nav.map((n) => {
          const active = navActive && view === n.key;
          return (
            <button
              key={n.key}
              onClick={() => {
                setView(n.key);
                setActiveCat("All");
                closeNav();
              }}
              className="transition-transform duration-200 hover:translate-x-1"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                padding: "10px 12px",
                borderRadius: 12,
                background: active ? "var(--accent-dim)" : "transparent",
                color: active ? "var(--accent)" : "var(--ink-2)",
                border: active ? "1px solid var(--accent-brd)" : "1px solid transparent",
                fontSize: 13.5,
                fontWeight: 500,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <Icon
                d={n.icon}
                size={16}
                fill={active && (n.icon === "heart" || n.icon === "bookmark") ? "var(--accent)" : "none"}
              />
              <span style={{ flex: 1 }}>{n.label}</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, opacity: 0.6 }}>{n.count}</span>
            </button>
          );
        })}
      </nav>

      <div
        className="joi-scroll"
        style={{ overflowX: "hidden", overflowY: "auto", minHeight: 0, paddingRight: 6 }}
      >
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
            padding: "0 12px 8px",
          }}
        >
          Categories
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {Object.keys(catCounts).sort().map((name) => {
            const active = activeCat === name;
            return (
              <button
                key={name}
                onClick={() => {
                  // Toggle category; clear it returns to the current nav view.
                  setActiveCat(active ? "All" : name);
                  if (!active && view !== "fav" && view !== "later") setView("all");
                  closeNav();
                }}
                className="transition-transform duration-200 hover:translate-x-1"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  padding: "8px 12px",
                  borderRadius: 10,
                  color: active ? "var(--accent)" : "var(--ink-2)",
                  background: active ? "var(--accent-dim)" : "transparent",
                  border: active ? "1px solid var(--accent-brd)" : "1px solid transparent",
                  fontSize: 13,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span style={{ flex: 1 }}>{name}</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, opacity: 0.5 }}>
                  {catCounts[name] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
       

        <div style={{ position: "relative" }}>
          {settingsOpen && (
            <div
              className="joi-glass joi-hl animate-slide-up"
              style={{
                position: "absolute",
                bottom: "calc(100% + 8px)",
                left: 0,
                right: 0,
                borderRadius: 14,
                padding: 14,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                zIndex: 40,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--ink-3)",
                }}
              >
                Settings
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "var(--ink)" }}>Privacy blur</div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>
                    Blur thumbnails until hover
                  </div>
                </div>
                <Toggle on={privacyBlur} onClick={() => setPrivacyBlur(!privacyBlur)} />
              </div>
            </div>
          )}
          <button
            onClick={() => setSettingsOpen((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              padding: "8px 12px",
              width: "100%",
              borderRadius: 10,
              color: settingsOpen ? "var(--accent)" : "var(--ink-2)",
              background: settingsOpen ? "var(--accent-dim)" : "transparent",
              border: settingsOpen ? "1px solid var(--accent-brd)" : "1px solid transparent",
              fontSize: 13,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <Icon d="settings" size={16} />
            <span style={{ flex: 1 }}>Settings</span>
            {privacyBlur && (
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 9.5,
                  color: "var(--accent)",
                  letterSpacing: "0.08em",
                }}
              >
                BLUR
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
