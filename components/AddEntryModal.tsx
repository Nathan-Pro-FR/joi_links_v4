"use client";
import * as React from "react";
import { Icon } from "./Icon";
import { useDashboard } from "./DashboardContext";

export type NewEntry = {
  title: string;
  url: string;
  thumb: string;
  cat: string;
  creator: string;
  dur: string;
  tags: string;
  rating: number;
  hot: boolean;
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 10,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--ink-3)",
  marginBottom: 6,
  display: "block",
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  height: 42,
  padding: "0 13px",
  borderRadius: 11,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid var(--glass-brd)",
  color: "var(--ink)",
  fontSize: 14,
  outline: "none",
};

export function AddEntryModal() {
  const {
    createEntry,
    updateEntry,
    setShowAdd,
    editingMedia,
    setEditingMedia,
    catCounts,
    tags: knownTags,
  } = useDashboard();
  const isEdit = editingMedia !== null;
  const categories = React.useMemo(() => Object.keys(catCounts).sort(), [catCounts]);
  const onClose = React.useCallback(() => {
    setShowAdd(false);
    setEditingMedia(null);
  }, [setShowAdd, setEditingMedia]);
  const [form, setForm] = React.useState<NewEntry>(() =>
    editingMedia
      ? {
          title: editingMedia.title,
          url: editingMedia.url,
          thumb: editingMedia.thumb ?? "",
          cat: editingMedia.cat,
          creator: editingMedia.creator,
          dur: editingMedia.dur,
          tags: editingMedia.tags.join(", "),
          rating: editingMedia.rating,
          hot: Boolean(editingMedia.hot),
        }
      : {
          title: "",
          url: "",
          thumb: "",
          cat: "",
          creator: "",
          dur: "",
          tags: "",
          rating: 0,
          hot: false,
        }
  );
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = <K extends keyof NewEntry>(k: K, v: NewEntry[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.url.trim()) return setError("A link is required.");
    if (!form.cat.trim()) return setError("Category is required.");
    setSubmitting(true);
    const res = isEdit && editingMedia
      ? await updateEntry(editingMedia._id, form)
      : await createEntry(form);
    setSubmitting(false);
    if (res.ok) onClose();
    else setError(res.error ?? "Could not save entry.");
  }

  return (
    <div
      onClick={onClose}
      className="animate-fade-in joi-modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 28,
      }}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="joi-glass joi-hl animate-scale-in"
        style={{
          width: "100%",
          maxWidth: 520,
          borderRadius: 22,
          padding: 22,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          maxHeight: "calc(100vh - 56px)",
          overflow: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>
            {isEdit ? "Edit entry" : "Add entry"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--ink-3)" }}
          >
            <Icon d="close" size={18} />
          </button>
        </div>

        <div>
          <label style={labelStyle} htmlFor="ae-title">Title</label>
          <input
            id="ae-title"
            autoFocus
            style={fieldStyle}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Velvet Countdown"
          />
        </div>

        <div>
          <label style={labelStyle} htmlFor="ae-url">Link (website URL)</label>
          <input
            id="ae-url"
            style={fieldStyle}
            value={form.url}
            onChange={(e) => set("url", e.target.value)}
            placeholder="https://…"
            inputMode="url"
          />
        </div>

        <div>
          <label style={labelStyle} htmlFor="ae-thumb">Thumbnail URL (optional)</label>
          <input
            id="ae-thumb"
            style={fieldStyle}
            value={form.thumb}
            onChange={(e) => set("thumb", e.target.value)}
            placeholder="https://… (image)"
            inputMode="url"
          />
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 160px" }}>
            <label style={labelStyle} htmlFor="ae-cat">Category</label>
            <input
              id="ae-cat"
              list="ae-cat-options"
              style={fieldStyle}
              value={form.cat}
              onChange={(e) => set("cat", e.target.value)}
              placeholder="Pick or type a new one"
            />
            <datalist id="ae-cat-options">
              {categories.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>
          <div style={{ flex: "1 1 120px" }}>
            <label style={labelStyle} htmlFor="ae-dur">Duration (mm:ss)</label>
            <input
              id="ae-dur"
              style={fieldStyle}
              value={form.dur}
              onChange={(e) => set("dur", e.target.value)}
              placeholder="12:30"
            />
          </div>
        </div>

        <div>
          <label style={labelStyle} htmlFor="ae-creator">Creator</label>
          <input
            id="ae-creator"
            style={fieldStyle}
            value={form.creator}
            onChange={(e) => set("creator", e.target.value)}
            placeholder="@handle"
          />
        </div>

        <div>
          <label style={labelStyle} htmlFor="ae-tags">Tags (comma separated)</label>
          <input
            id="ae-tags"
            list="ae-tag-options"
            style={fieldStyle}
            value={form.tags}
            onChange={(e) => set("tags", e.target.value)}
            placeholder="POV, Slow"
          />
          <datalist id="ae-tag-options">
            {knownTags.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div>
            <span style={labelStyle}>Rating</span>
            <div style={{ display: "flex", gap: 4 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => set("rating", form.rating === i ? 0 : i)}
                  style={{ background: "transparent", border: "none", padding: 2, cursor: "pointer" }}
                  aria-label={`${i} stars`}
                >
                  <Icon
                    d="star"
                    size={20}
                    fill={i <= form.rating ? "var(--accent)" : "none"}
                    style={{ color: i <= form.rating ? "var(--accent)" : "rgba(255,255,255,0.25)" }}
                  />
                </button>
              ))}
            </div>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", marginTop: 18 }}>
            <input
              type="checkbox"
              checked={form.hot}
              onChange={(e) => set("hot", e.target.checked)}
              style={{
                appearance: "none",
                WebkitAppearance: "none",
                width: 18,
                height: 18,
                borderRadius: 5,
                background: form.hot
                  ? `var(--accent) url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2304201c' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='20 6 9 17 4 12'/></svg>") center / 12px no-repeat`
                  : "rgba(255,255,255,0.05)",
                border: "1px solid var(--glass-brd)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            />
            <span style={{ fontSize: 13, color: "var(--ink-2)", display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Icon d="flame" size={13} fill="var(--accent)" sw={0} /> Mark as hot
            </span>
          </label>
        </div>

        {error && (
          <div
            style={{
              padding: "9px 12px",
              borderRadius: 10,
              background: "rgba(220, 60, 60, 0.12)",
              border: "1px solid rgba(220, 60, 60, 0.35)",
              color: "#ffb4b4",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button
            type="button"
            onClick={onClose}
            className="joi-glass"
            style={{
              flex: "0 0 auto",
              padding: "0 18px",
              height: 44,
              borderRadius: 13,
              background: "transparent",
              border: "1px solid var(--glass-brd)",
              color: "var(--ink-2)",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="transition-transform duration-200 hover:scale-[1.02] active:scale-95 disabled:hover:scale-100"
            style={{
              flex: 1,
              height: 44,
              borderRadius: 13,
              background: "var(--accent)",
              color: "#04201c",
              fontWeight: 600,
              fontSize: 14,
              border: "none",
              cursor: submitting ? "default" : "pointer",
              opacity: submitting ? 0.7 : 1,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Icon d={isEdit ? "check" : "plus"} size={16} sw={2} />
            {submitting ? "Saving…" : isEdit ? "Save changes" : "Add entry"}
          </button>
        </div>
      </form>
    </div>
  );
}
