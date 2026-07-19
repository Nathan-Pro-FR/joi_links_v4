"use client";
import * as React from "react";
import { Icon } from "./Icon";

export function StarRating({ value = 0, size = 11, gap = 2 }: { value?: number; size?: number; gap?: number }) {
  return (
    <div style={{ display: "flex", gap }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon
          key={i}
          d="star"
          size={size}
          sw={1.2}
          fill={i <= value ? "var(--accent)" : "none"}
          style={{ color: i <= value ? "var(--accent)" : "rgba(255,255,255,0.28)" }}
        />
      ))}
    </div>
  );
}

export function DurBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "var(--mono)",
        fontSize: 10.5,
        letterSpacing: "0.02em",
        color: "rgba(255,255,255,0.92)",
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(6px)",
        padding: "3px 7px",
        borderRadius: 7,
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Icon d="clock" size={10} sw={1.5} style={{ opacity: 0.8 }} />
      {children}
    </span>
  );
}

type ChipProps = {
  label: string;
  active?: boolean;
  count?: number;
  icon?: string;
  onClick?: () => void;
  size?: "sm" | "md";
};
export function Chip({ label, active = false, count, icon, onClick, size = "md" }: ChipProps) {
  const pad = size === "sm" ? "6px 11px" : "8px 14px";
  const fs = size === "sm" ? 12 : 13;
  return (
    <button
      className="joi-chip"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: pad,
        fontFamily: "var(--font)",
        fontSize: fs,
        fontWeight: 500,
        letterSpacing: "0.01em",
        borderRadius: 999,
        whiteSpace: "nowrap",
        color: active ? "#04201c" : "var(--ink-2)",
        background: active ? "var(--accent)" : "rgba(255,255,255,0.05)",
        border: `1px solid ${active ? "transparent" : "var(--glass-brd)"}`,
      }}
    >
      {icon && <Icon d={icon} size={fs} sw={1.6} />}
      {label}
      {count != null && (
        <span style={{ fontFamily: "var(--mono)", fontSize: fs - 2, opacity: 0.6 }}>{count}</span>
      )}
    </button>
  );
}

type IconBtnProps = {
  icon: string;
  active?: boolean;
  size?: number;
  onClick?: () => void;
  title?: string;
};
export function IconBtn({ icon, active, size = 42, onClick, title }: IconBtnProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={active ? "joi-chip" : "joi-glass joi-chip"}
      style={{
        width: size,
        height: size,
        borderRadius: 13,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: active ? "#04201c" : "var(--ink-2)",
        background: active ? "var(--accent)" : undefined,
        border: active ? "none" : undefined,
      }}
    >
      <Icon d={icon} size={18} />
    </button>
  );
}

export function Wordmark({ size = 22 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <span
        style={{
          width: size + 6,
          height: size + 6,
          borderRadius: 9,
          background: "var(--accent)",
          color: "#04201c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: size * 0.62,
          letterSpacing: "-0.04em",
        }}
      >
        j
      </span>
      <span style={{ fontSize: size, fontWeight: 700, letterSpacing: "-0.03em" }}>
        joi<span style={{ color: "var(--ink-3)", fontWeight: 500 }}> </span>
      </span>
    </div>
  );
}
