"use client";
import * as React from "react";
import {useState, useEffect, useCallback} from "react";
import { Icon } from "./Icon";
import { Thumb } from "./Thumb";
import { StarRating } from "./atoms";
import { useDashboard } from "./DashboardContext";

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "link";
  }
}

export function DetailLightbox() {
  const {
    openMedia: m,
    setOpenMedia,
    toggleFav: onToggleFav,
    toggleBookmark: onToggleBookmark,
    setEditingMedia,
    deleteEntry,
  } = useDashboard();
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const onClose = useCallback(() => {
    setConfirmDelete(false);
    setDeleteError(null);
    setOpenMedia(null);
  }, [setOpenMedia]);

  useEffect(() => {
    setConfirmDelete(false);
    setDeleteError(null);
    setDeleting(false);
  }, [m?._id]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!m) return null;

  return (
    <div
      onClick={onClose}
      className="animate-fade-in joi-modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 28,
      }}
    >
      <div
        className="joi-glass joi-hl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 860,
          borderRadius: 24,
          padding: 18,
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            position: "relative",
            flex: "1 1 380px",
            borderRadius: 16,
            overflow: "hidden",
            aspectRatio: "16 / 10",
            minWidth: 280,
          }}
        >
          <Thumb seed={m.seed} thumbUrl={m.thumb} radius={16} />
          <a
            href={m.url}
            target="_blank"
            rel="noreferrer"
            title={`Open ${m.url}`}
            className="group"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              className="transition-transform duration-300 group-hover:scale-110"
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon d="play" size={26} fill="#fff" sw={0} />
            </span>
          </a>
          <div
            style={{
              position: "absolute",
              left: 16,
              right: 16,
              bottom: 14,
              display: "flex",
              flexDirection: "column",
              gap: 9,
            }}
          >
            <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.25)" }}>
              <div
                style={{ width: "32%", height: "100%", borderRadius: 2, background: "var(--accent)" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#fff",
              }}
            >
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <Icon d="play" size={16} fill="#fff" sw={0} />
                <Icon d="volume" size={16} />
                <span style={{ fontFamily: "var(--mono)", fontSize: 11 }}>03:58 / {m.dur}</span>
              </div>
              <Icon
                d="M2 2h4M2 2v4M14 2h-4M14 2v4M2 14h4M2 14v-4M14 14h-4M14 14v-4"
                size={16}
              />
            </div>
          </div>
        </div>
        <div
          style={{
            flex: "1 1 280px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            padding: "6px 6px 6px 0",
            minWidth: 240,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10.5,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--accent)",
              }}
            >
              {m.cat}
            </span>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--ink-3)",
              }}
              aria-label="Close"
            >
              <Icon d="close" size={16} />
            </button>
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: 25,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            {m.title}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--ink-2)", fontSize: 13 }}>
            <span style={{ fontFamily: "var(--mono)" }}>{m.creator}</span>
            <StarRating value={m.rating} size={13} />
          </div>
          <div
            style={{
              display: "flex",
              gap: 16,
              padding: "12px 0",
              borderTop: "1px solid var(--glass-brd)",
              borderBottom: "1px solid var(--glass-brd)",
              fontSize: 12,
              color: "var(--ink-2)",
            }}
          >
            <div>
              <div style={{ fontFamily: "var(--mono)", color: "var(--ink)", fontSize: 15 }}>
                {m.dur}
              </div>
              Duration
            </div>
            <div>
              <div style={{ fontFamily: "var(--mono)", color: "var(--ink)", fontSize: 15 }}>
                {m.rating}/5
              </div>
              Rating
            </div>
            <div style={{ minWidth: 0 }}>
              <a
                href={m.url}
                target="_blank"
                rel="noreferrer"
                title={m.url}
                style={{
                  display: "block",
                  fontFamily: "var(--mono)",
                  color: "var(--accent)",
                  fontSize: 15,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 160,
                }}
              >
                {hostOf(m.url)}
              </a>
              Source
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {m.tags.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 11.5,
                  color: "var(--ink-2)",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--glass-brd)",
                  padding: "4px 11px",
                  borderRadius: 999,
                }}
              >
                {t}
              </span>
            ))}
          </div>
          {confirmDelete && (
            <div
              className="animate-fade-in"
              role="alertdialog"
              aria-label="Confirm delete"
              style={{
                marginTop: "auto",
                padding: 14,
                borderRadius: 14,
                border: "1px solid rgba(255,107,107,0.35)",
                background: "rgba(255,107,107,0.08)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <Icon d="trash" size={18} sw={1.5} style={{ color: "#ff6b6b", flexShrink: 0, marginTop: 1 }} />
                <div style={{ fontSize: 13, lineHeight: 1.4, color: "var(--ink)" }}>
                  Delete <strong style={{ fontWeight: 600 }}>{m.title}</strong>? This can&apos;t be undone.
                </div>
              </div>
              {deleteError && (
                <div style={{ fontSize: 12, color: "#ff6b6b", fontFamily: "var(--mono)" }}>
                  {deleteError}
                </div>
              )}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleting}
                  className="transition-transform duration-200 hover:scale-[1.02] active:scale-95"
                  style={{
                    height: 34,
                    padding: "0 14px",
                    borderRadius: 10,
                    background: "transparent",
                    color: "var(--ink-2)",
                    border: "1px solid var(--glass-brd)",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: deleting ? "not-allowed" : "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (deleting) return;
                    setDeleting(true);
                    setDeleteError(null);
                    const res = await deleteEntry(m._id);
                    if (!res.ok) {
                      setDeleting(false);
                      setDeleteError(res.error ?? "Failed to delete");
                    }
                  }}
                  disabled={deleting}
                  className="transition-transform duration-200 hover:scale-[1.02] active:scale-95"
                  style={{
                    height: 34,
                    padding: "0 14px",
                    borderRadius: 10,
                    background: "#ff6b6b",
                    color: "#1a0606",
                    border: "none",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: deleting ? "wait" : "pointer",
                    opacity: deleting ? 0.7 : 1,
                  }}
                >
                  {deleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          )}
          <div style={{ marginTop: confirmDelete ? 0 : "auto", display: "flex", gap: 10 }}>
            <a
              href={m.url}
              target="_blank"
              rel="noreferrer"
              className="transition-transform duration-200 hover:scale-[1.02] active:scale-95"
              style={{
                flex: 1,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                height: 44,
                borderRadius: 13,
                background: "var(--accent)",
                color: "#04201c",
                fontWeight: 600,
                fontSize: 14,
                border: "none",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              <Icon d="play" size={15} fill="#04201c" sw={0} />
              Open link
            </a>
            <button
              onClick={() => setEditingMedia(m)}
              className="joi-glass transition-transform duration-200 hover:scale-105 active:scale-95"
              style={{
                width: 44,
                height: 44,
                borderRadius: 13,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--ink-2)",
                border: "1px solid var(--glass-brd)",
                background: "transparent",
                cursor: "pointer",
              }}
              aria-label="Edit entry"
            >
              <Icon d="sliders" size={18} sw={1.5} />
            </button>
            <button
              onClick={() => onToggleFav(m)}
              className="joi-glass transition-transform duration-200 hover:scale-105 active:scale-95"
              style={{
                width: 44,
                height: 44,
                borderRadius: 13,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: m.fav ? "var(--accent)" : "var(--ink-2)",
                border: "1px solid var(--glass-brd)",
                cursor: "pointer",
                background: "transparent",
              }}
              aria-label="Toggle favorite"
            >
              <Icon
                key={`fav-${m.fav}`}
                className="animate-pop"
                d="heart"
                size={18}
                fill={m.fav ? "var(--accent)" : "none"}
                sw={1.5}
              />
            </button>
            <button
              onClick={() => {
                setDeleteError(null);
                setConfirmDelete((v) => !v);
              }}
              disabled={deleting}
              className="joi-glass transition-transform duration-200 hover:scale-105 active:scale-95"
              style={{
                width: 44,
                height: 44,
                borderRadius: 13,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ff6b6b",
                border: "1px solid var(--glass-brd)",
                background: "transparent",
                cursor: deleting ? "wait" : "pointer",
                opacity: deleting ? 0.6 : 1,
              }}
              aria-label="Delete entry"
            >
              <Icon d="trash" size={18} sw={1.5} />
            </button>
            <button
              onClick={() => onToggleBookmark(m)}
              className="joi-glass transition-transform duration-200 hover:scale-105 active:scale-95"
              style={{
                width: 44,
                height: 44,
                borderRadius: 13,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: m.bookmark ? "var(--accent)" : "var(--ink-2)",
                border: "1px solid var(--glass-brd)",
                background: "transparent",
                cursor: "pointer",
              }}
              aria-label={m.bookmark ? "Remove from watch later" : "Save to watch later"}
            >
              <Icon
                key={`bm-${m.bookmark}`}
                className="animate-pop"
                d="bookmark"
                size={18}
                fill={m.bookmark ? "var(--accent)" : "none"}
                sw={1.5}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
