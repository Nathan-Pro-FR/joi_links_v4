import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongo";
import { Media } from "@/lib/models/Media";
import { durToSec } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  await connectMongo();
  const sp = req.nextUrl.searchParams;

  const q = sp.get("q")?.trim();
  const cat = sp.get("cat");
  const creator = sp.get("creator");
  const fav = sp.get("fav");
  const bookmark = sp.get("bookmark");
  const minRating = Number(sp.get("minRating") || 0);
  const durMin = Number(sp.get("durMin") || 0);
  const durMax = Number(sp.get("durMax") || 0);
  const sort = sp.get("sort") || "recent";

  const filter: Record<string, unknown> = {};
  if (cat && cat !== "All") filter.cat = cat;
  if (creator) filter.creator = creator;
  if (fav === "1") filter.fav = true;
  if (bookmark === "1") filter.bookmark = true;
  if (minRating > 0) filter.rating = { $gte: minRating };
  if (durMin > 0 || durMax > 0) {
    const range: Record<string, number> = {};
    if (durMin > 0) range.$gte = durMin;
    if (durMax > 0) range.$lte = durMax;
    filter.durSec = range;
  }
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ title: rx }, { tags: rx }, { creator: rx }, { cat: rx }];
  }

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    recent: { addedAt: -1 },
    rating: { rating: -1, addedAt: -1 },
    duration_asc: { durSec: 1 },
    duration_desc: { durSec: -1 },
    title: { title: 1 },
  };

  const [items, totalAll, totalFav, totalLater, byCat, tagList] = await Promise.all([
    Media.find(filter).sort(sortMap[sort] || sortMap.recent).limit(200).lean(),
    Media.countDocuments({}),
    Media.countDocuments({ fav: true }),
    Media.countDocuments({ bookmark: true }),
    Media.aggregate([{ $group: { _id: "$cat", count: { $sum: 1 } } }]),
    Media.distinct("tags"),
  ]);

  const catCounts: Record<string, number> = {};
  for (const row of byCat) catCounts[row._id as string] = row.count as number;
  const tags = (tagList as string[]).filter(Boolean).sort();

  return NextResponse.json({ items, totalAll, totalFav, totalLater, catCounts, tags });
}

const DUR_RE = /^\d{1,2}:\d{2}(:\d{2})?$/;

export async function POST(req: NextRequest) {
  await connectMongo();
  const body = await req.json().catch(() => ({}));

  const title = String(body.title ?? "").trim();
  let url = String(body.url ?? "").trim();
  if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });
  if (url && !/^https?:\/\//i.test(url)) url = `https://${url}`;
  try {
    // eslint-disable-next-line no-new
    new URL(url);
  } catch {
    return NextResponse.json({ error: "A valid link (https://…) is required." }, { status: 400 });
  }

  const cat = String(body.cat ?? "").trim() || "Uncategorized";

  let creator = String(body.creator ?? "").trim();
  if (!creator) creator = "@unknown";
  else if (!creator.startsWith("@")) creator = `@${creator.replace(/\s+/g, "_")}`;

  const dur = DUR_RE.test(String(body.dur ?? "").trim()) ? String(body.dur).trim() : "00:00";

  const tags = Array.isArray(body.tags)
    ? body.tags.map((t: unknown) => String(t).trim()).filter(Boolean).slice(0, 8)
    : String(body.tags ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 8);

  const rating = Math.max(0, Math.min(5, Math.round(Number(body.rating) || 0)));
  const thumb = String(body.thumb ?? "").trim();

  const doc = await Media.create({
    title,
    url,
    cat,
    creator,
    dur,
    durSec: durToSec(dur),
    tags,
    rating,
    thumb,
    fav: Boolean(body.fav),
    bookmark: Boolean(body.bookmark),
    hot: Boolean(body.hot),
    seed: Math.floor(Math.random() * 1000),
    addedAt: new Date(),
  });

  return NextResponse.json({ ok: true, item: doc }, { status: 201 });
}
