import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongo";
import { Media } from "@/lib/models/Media";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectMongo();
  const rows = await Media.aggregate([
    { $group: { _id: "$creator", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  return NextResponse.json({
    creators: rows.map((r) => ({ name: r._id as string, count: r.count as number })),
  });
}
