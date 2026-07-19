"use client";
import * as React from "react";
import { Icon } from "./Icon";
import { IconBtn } from "./atoms";
import { SORTS } from "@/lib/data";
import { useDashboard } from "./DashboardContext";

export function TopBar() {
  const { query, setQuery, sortKey, setSortKey, shuffle, setShowAdd, setNavOpen } = useDashboard();
  const [sortOpen, setSortOpen] = React.useState(false);
  const sortLabel = SORTS.find((s) => s.value === sortKey)?.label ?? "Recently added";
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setNavOpen(true)}
        className="joi-mobile-only joi-glass joi-chip"
        style={{
          width: 46,
          height: 46,
          borderRadius: 14,
          alignItems: "center",
          justifyContent: "center",
          color: "var(--ink)",
          flex: "0 0 auto",
        }}
      >
        <Icon d="menu" size={20} />
      </button>
      <div
        className="joi-glass"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 11,
          height: 46,
          padding: "0 16px",
          borderRadius: 999,
          flex: "1 1 200px",
          maxWidth: 380,
          minWidth: 0,
          color: "var(--ink-3)",
        }}
      >
        <Icon d="search" size={17} style={{ color: "var(--ink-2)", flex: "0 0 auto" }} />
        <input
          ref={inputRef}
          className="joi-input"
          placeholder="Search titles, tags, creators…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span
          className="joi-hide-sm"
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            padding: "2px 6px",
            borderRadius: 6,
            border: "1px solid var(--glass-brd)",
            color: "var(--ink-3)",
            flex: "0 0 auto",
          }}
        >
          /
        </span>
      </div>
      <div
        className="joi-topbar-extras"
        style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: "auto" }}
      >
        <button
          onClick={() => setShowAdd(true)}
          className="group transition-transform duration-200 hover:scale-105 active:scale-95"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            height: 42,
            padding: "0 16px",
            borderRadius: 13,
            background: "var(--accent)",
            color: "#04201c",
            fontWeight: 600,
            fontSize: 13.5,
            border: "none",
            cursor: "pointer",
          }}
          title="Add a new entry"
        >
          <Icon
            d="plus"
            size={16}
            sw={2.2}
            className="transition-transform duration-300 group-hover:rotate-90"
          />
          Add
        </button>
        <span className="joi-hide-sm" style={{ display: "inline-flex" }}>
          <IconBtn icon="shuffle" onClick={shuffle} title="Shuffle" />
        </span>
        <span className="joi-hide-sm" style={{ display: "inline-flex" }}>
          <IconBtn icon="grid" active title="Grid view" />
        </span>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setSortOpen((v) => !v)}
            className="joi-glass"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              height: 42,
              padding: "0 14px",
              borderRadius: 13,
              color: "var(--ink-2)",
              fontSize: 13,
              border: "1px solid var(--glass-brd)",
              cursor: "pointer",
            }}
          >
            {sortLabel}
            <Icon
              d="chevron"
              size={14}
              style={{ transform: "rotate(90deg)", opacity: 0.7 }}
            />
          </button>
          {sortOpen && (
            <div
              className="joi-glass animate-slide-down origin-top-right"
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                right: 0,
                minWidth: 180,
                borderRadius: 13,
                padding: 6,
                zIndex: 30,
              }}
            >
              {SORTS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => {
                    setSortKey(s.value);
                    setSortOpen(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 12px",
                    borderRadius: 9,
                    background: sortKey === s.value ? "var(--accent-dim)" : "transparent",
                    color: sortKey === s.value ? "var(--accent)" : "var(--ink)",
                    border: "none",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
