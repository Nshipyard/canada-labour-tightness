import { NextResponse } from "next/server";
import { SECTOR_ROWS, PAIRS, META } from "@/data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const quarter = searchParams.get("quarter");
  const pair = searchParams.get("pair");
  let rows = SECTOR_ROWS;
  if (quarter) rows = rows.filter((r) => r.quarter === quarter);
  if (pair) rows = rows.filter((r) => r.pair === pair);
  return NextResponse.json({ meta: META, pairs: PAIRS, data: rows });
}
