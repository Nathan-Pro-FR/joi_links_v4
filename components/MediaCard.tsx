"use client";
import * as React from "react";
import { Icon } from "./Icon";
import { Thumb } from "./Thumb";
import { StarRating, DurBadge } from "./atoms";
import { useDashboard } from "./DashboardContext";

export type Media = {
  _id: string;
  title: string;
  cat: string;
  tags: string[];
  creator: string;
  dur: string;
  durSec: number;
  rating: number;
  fav: boolean;
  bookmark: boolean;
  url: string;
  thumb?: string;
  seed: number;
  hot?: boolean;
};

type Props = {
  m: Media;
  /** Grid position, used to stagger the entrance animation. */
  index?: number;
};

export function MediaCard({ m, index = 0 }: Props) {
  const { privacyBlur, setOpenMedia, toggleFav, toggleBookmark } = useDashboard();
  const [hover, setHover] = React.useState(false);
  const preview = hover;
  const blur = privacyBlur && !hover;

  return (
    <div
      className="joi-glass joi-hl joi-card-hover animate-fade-in-up"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => setOpenMedia(m)}
      style={{
        width: "100%",
        // Allow the card to shrink inside its grid track instead of forcing
        // the track wider than the viewport (mobile horizontal overflow).
        minWidth: 0,
        maxWidth: "100%",
        borderRadius: "var(--radius)",
        padding: 9,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        position: "relative",
        cursor: "pointer",
        animationDelay: `${(index % 12) * 45}ms`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 11",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <Thumb seed={m.seed} thumbUrl={m.thumb} blur={blur} radius={12} />
        <span
          style={{
            position: "absolute",
            top: 9,
            left: 9,
            fontFamily: "var(--mono)",
            fontSize: 9.5,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.92)",
            background: "rgba(0,0,0,0.42)",
            backdropFilter: "blur(6px)",
            padding: "3px 7px",
            borderRadius: 6,
          }}
        >
          {m.cat}
        </span>
        <div style={{ position: "absolute", top: 9, right: 9, display: "flex", gap: 6 }}>
          {m.hot && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 22,
                height: 22,
                borderRadius: 7,
                background: "rgba(0,0,0,0.42)",
                backdropFilter: "blur(6px)",
                color: "var(--accent)",
              }}
            >
              <Icon d="flame" size={12} fill="var(--accent)" sw={0} />
            </span>
          )}
        </div>
        {blur && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 8,
              color: "rgba(255,255,255,0.86)",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                background: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon d="eye" size={18} />
            </span>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 9.5,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Hover to reveal
            </span>
          </div>
        )}
        {preview && !blur && (
          <a
            href={m.url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            title={`Open ${m.url}`}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.18)",
            }}
          >
            <span
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                background: "rgba(255,255,255,0.16)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <Icon d="play" size={20} fill="#fff" sw={0} />
            </span>
          </a>
        )}
        <button
          type="button"
          aria-label={m.fav ? "Unfavorite" : "Favorite"}
          className="transition-transform duration-200 hover:scale-110 active:scale-90"
          onClick={(e) => {
            e.stopPropagation();
            toggleFav(m);
          }}
          style={{
            position: "absolute",
            bottom: 9,
            left: 9,
            width: 26,
            height: 26,
            borderRadius: 8,
            cursor: "pointer",
            background: "rgba(0,0,0,0.42)",
            backdropFilter: "blur(6px)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: m.fav ? "var(--accent)" : "rgba(255,255,255,0.8)",
          }}
        >
          <Icon d="heart" size={14} fill={m.fav ? "var(--accent)" : "none"} sw={1.5} />
        </button>
        <button
          type="button"
          aria-label={m.bookmark ? "Remove from watch later" : "Save to watch later"}
          className="transition-transform duration-200 hover:scale-110 active:scale-90"
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark(m);
          }}
          style={{
            position: "absolute",
            bottom: 9,
            left: 41,
            width: 26,
            height: 26,
            borderRadius: 8,
            cursor: "pointer",
            background: "rgba(0,0,0,0.42)",
            backdropFilter: "blur(6px)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: m.bookmark ? "var(--accent)" : "rgba(255,255,255,0.8)",
          }}
        >
          <Icon d="bookmark" size={14} fill={m.bookmark ? "var(--accent)" : "none"} sw={1.5} />
        </button>
        <div style={{ position: "absolute", bottom: 9, right: 9 }}>
          <DurBadge>{m.dur}</DurBadge>
        </div>
      </div>
      <div style={{ padding: "0 4px 4px", display: "flex", flexDirection: "column", gap: 7 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {m.title}
            </div>
            <div
              style={{
                fontSize: 11.5,
                color: "var(--ink-3)",
                marginTop: 3,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Icon d="link" size={11} style={{ opacity: 0.7 }} />
              <span style={{ fontFamily: "var(--mono)" }}>{m.creator}</span>
            </div>
          </div>
          <StarRating value={m.rating} />
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {m.tags.map((t) => (
            <span
              key={t}
              style={{
                fontSize: 10.5,
                color: "var(--ink-2)",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--glass-brd)",
                padding: "2px 8px",
                borderRadius: 999,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
