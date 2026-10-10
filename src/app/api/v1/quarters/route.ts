import { NextResponse } from "next/server";
import { SERIES, LATEST, META } from "@/data";

export async function GET() {
  return NextResponse.json({
    meta: META,
    first_quarter: SERIES[0].quarter,
    last_quarter: LATEST.quarter,
    quarters: SERIES.length,
    latest: LATEST,
  });
}
