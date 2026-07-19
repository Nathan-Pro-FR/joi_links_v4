import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongo";
import { Media } from "@/lib/models/Media";
import { durToSec } from "@/lib/data";

const DUR_RE = /^\d{1,2}:\d{2}(:\d{2})?$/;

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectMongo();
  const body = await req.json().catch(() => ({}));

  const doc = await Media.findById(id);
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (typeof body.title === "string") {
    const t = body.title.trim();
    if (!t) return NextResponse.json({ error: "Title is required." }, { status: 400 });
    doc.title = t;
  }
  if (typeof body.url === "string") {
    let url = body.url.trim();
    if (url && !/^https?:\/\//i.test(url)) url = `https://${url}`;
    try {
      // eslint-disable-next-line no-new
      new URL(url);
    } catch {
      return NextResponse.json({ error: "A valid link (https://…) is required." }, { status: 400 });
    }
    doc.url = url;
  }
  if (typeof body.cat === "string") doc.cat = body.cat.trim() || "Uncategorized";
  if (typeof body.creator === "string") {
    let creator = body.creator.trim();
    if (!creator) creator = "@unknown";
    else if (!creator.startsWith("@")) creator = `@${creator.replace(/\s+/g, "_")}`;
    doc.creator = creator;
  }
  if (typeof body.dur === "string") {
    const dur = DUR_RE.test(body.dur.trim()) ? body.dur.trim() : "00:00";
    doc.dur = dur;
    doc.durSec = durToSec(dur);
  }
  if (body.tags !== undefined) {
    const tags = Array.isArray(body.tags)
      ? body.tags.map((t: unknown) => String(t).trim()).filter(Boolean).slice(0, 8)
      : String(body.tags ?? "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .slice(0, 8);
    doc.tags = tags;
  }
  if (body.rating !== undefined) {
    doc.rating = Math.max(0, Math.min(5, Math.round(Number(body.rating) || 0)));
  }
  if (typeof body.thumb === "string") doc.thumb = body.thumb.trim();
  if (typeof body.hot === "boolean") doc.hot = body.hot;
  if (typeof body.fav === "boolean") doc.fav = body.fav;
  if (typeof body.bookmark === "boolean") doc.bookmark = body.bookmark;

  await doc.save();
  return NextResponse.json({ ok: true, item: doc });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectMongo();
  const res = await Media.findByIdAndDelete(id);
  if (!res) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
