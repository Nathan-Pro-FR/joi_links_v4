"use client";
import * as React from "react";
import { Icon } from "./Icon";
import { Wordmark } from "./atoms";

const STORAGE_KEY = "joi:age-confirmed";

function readConfirmed(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

// Run before the browser paints on the client; no-op (and no warning) during SSR.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export function AgeGate() {
  // Start closed so SSR/first paint render nothing. A layout effect (which runs
  // *before* the browser paints) opens it only when not yet confirmed — so an
  // already-confirmed visitor never sees a flash on refresh.
  const [open, setOpen] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (!readConfirmed()) setOpen(true);
  }, []);

  // Lock background scroll while the gate is up.
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const enter = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* storage may be unavailable (private mode) — gate just re-shows next load */
    }
    setOpen(false);
  };

  const leave = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <div
      className="animate-fade-in joi-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(4,4,7,0.78)",
        backdropFilter: "blur(16px) saturate(1.1)",
        WebkitBackdropFilter: "blur(16px) saturate(1.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        className="joi-glass joi-hl animate-scale-in"
        style={{
          width: "100%",
          maxWidth: 440,
          borderRadius: 22,
          padding: 28,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 16,
        }}
      >
        <Wordmark />

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--accent)",
            background: "var(--accent-dim)",
            border: "1px solid var(--accent-brd)",
            padding: "6px 12px",
            borderRadius: 999,
          }}
        >
          <Icon d="eye" size={13} />
          18+ Adults only
        </span>

        <h2
          id="age-gate-title"
          style={{ margin: 0, fontSize: 23, fontWeight: 700, letterSpacing: "-0.02em" }}
        >
          Age verification
        </h2>

        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: "var(--ink-2)" }}>
          This library contains explicit adult content intended for mature audiences only.
          By entering you confirm that you are at least <strong>18 years old</strong> (or the
          age of majority in your jurisdiction) and consent to viewing such material.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", marginTop: 4 }}>
          <button
            onClick={enter}
            className="transition-transform duration-200 hover:scale-[1.02] active:scale-95"
            style={{
              height: 48,
              borderRadius: 14,
              background: "var(--accent)",
              color: "#04201c",
              fontWeight: 700,
              fontSize: 14.5,
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Icon d="check" size={16} sw={2.2} />
            I am 18 or older — Enter
          </button>
          <button
            onClick={leave}
            className="joi-glass transition-transform duration-200 hover:scale-[1.02] active:scale-95"
            style={{
              height: 44,
              borderRadius: 14,
              background: "transparent",
              color: "var(--ink-2)",
              fontWeight: 500,
              fontSize: 13.5,
              border: "1px solid var(--glass-brd)",
              cursor: "pointer",
            }}
          >
            Leave
          </button>
        </div>

        <p style={{ margin: 0, fontSize: 11, color: "var(--ink-3)", lineHeight: 1.5 }}>
          Your confirmation is kept only for this session and resets when you clear your cache.
        </p>
      </div>
    </div>
  );
}
