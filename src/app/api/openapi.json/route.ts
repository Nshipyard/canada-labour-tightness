import { NextResponse } from "next/server";

const spec = {
  openapi: "3.1.0",
  info: {
    title: "Cross-Border Labour Tightness API",
    version: "1.0.0",
    description:
      "Harmonized US-Canada job vacancy rates on identical definitions, 2015Q1 to 2026Q2. US: BLS JOLTS via FRED, government excluded, quarterly. Canada: StatCan table 14-10-0400-01.",
  },
  paths: {
    "/api/v1/tightness": {
      get: {
        summary: "Harmonized quarterly vacancy-rate series",
        parameters: [
          {
            name: "quarter",
            in: "query",
            required: false,
            schema: { type: "string", example: "2026Q2" },
          },
        ],
        responses: { "200": { description: "Quarterly series or single quarter" } },
      },
    },
    "/api/v1/sectors": {
      get: {
        summary: "Sector pairs on identical NAICS definitions",
        parameters: [
          { name: "quarter", in: "query", required: false, schema: { type: "string", example: "2026Q2" } },
          { name: "pair", in: "query", required: false, schema: { type: "string", example: "JTS2300" } },
        ],
        responses: { "200": { description: "Sector rows with pair metadata" } },
      },
    },
    "/api/v1/quarters": {
      get: {
        summary: "Coverage and latest values",
        responses: { "200": { description: "First/last quarter, count, latest row" } },
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(spec);
}
