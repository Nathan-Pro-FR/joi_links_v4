import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongo";
import { Media } from "@/lib/models/Media";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectMongo();
  const body = await req.json().catch(() => ({}));
  const bookmark = typeof body.bookmark === "boolean" ? body.bookmark : undefined;

  const doc = await Media.findById(id);
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  doc.bookmark = bookmark ?? !doc.bookmark;
  await doc.save();
  return NextResponse.json({ ok: true, bookmark: doc.bookmark });
}
