import { NextResponse } from "next/server";
import { SERIES, SECTOR_ROWS, PAIRS, LATEST } from "@/data";

const TOOLS = [
  {
    name: "tightness_lookup",
    description:
      "Harmonized US-Canada job vacancy rate for a quarter on identical definitions. US excludes government; Canada is the published JVWS total.",
    inputSchema: {
      type: "object",
      properties: {
        quarter: { type: "string", description: "e.g. 2026Q2. Omit for the full series." },
      },
    },
  },
  {
    name: "sector_ranking",
    description:
      "Rank the 10 US-Canada sector pairs by vacancy-rate gap for a quarter. Positive gap means the US is tighter.",
    inputSchema: {
      type: "object",
      properties: {
        quarter: { type: "string", description: "e.g. 2026Q2. Defaults to the latest quarter." },
      },
    },
  },
  {
    name: "trend",
    description:
      "Direction of the US-minus-Canada vacancy gap: latest gap, widest gap, and how many quarters each side was tighter.",
    inputSchema: { type: "object", properties: {} },
  },
];

function callTool(name: string, args: Record<string, unknown>) {
  if (name === "tightness_lookup") {
    const q = args.quarter as string | undefined;
    if (q) {
      const row = SERIES.find((r) => r.quarter === q);
      if (!row) throw new Error(`unknown quarter ${q}`);
      return row;
    }
    return SERIES;
  }
  if (name === "sector_ranking") {
    const q = (args.quarter as string | undefined) ?? LATEST.quarter;
    const rows = SECTOR_ROWS.filter((r) => r.quarter === q)
      .map((r) => ({
        pair: r.pair,
        label_en: r.label_en,
        us_rate: r.us_rate,
        ca_rate: r.ca_rate,
        gap_pp_us_minus_ca: r.gap_pp_us_minus_ca,
      }))
      .sort((a, b) => b.gap_pp_us_minus_ca - a.gap_pp_us_minus_ca);
    return { quarter: q, pairs: PAIRS, ranking: rows };
  }
  if (name === "trend") {
    const gaps = SERIES.map((r) => r.gap_pp_us_minus_ca);
    return {
      latest_quarter: LATEST.quarter,
      latest_gap_pp: LATEST.gap_pp_us_minus_ca,
      latest_us_rate: LATEST.us_rate_exgov,
      latest_ca_rate: LATEST.ca_rate,
      widest_us_lead_pp: Math.max(...gaps),
      widest_us_lead_quarter: SERIES[gaps.indexOf(Math.max(...gaps))].quarter,
      quarters_us_tighter: SERIES.filter((r) => r.tighter === "US").length,
      quarters_total: SERIES.length,
    };
  }
  throw new Error(`unknown tool ${name}`);
}

export async function POST(req: Request) {
  let body: { jsonrpc?: string; id?: unknown; method?: string; params?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { jsonrpc: "2.0", id: null, error: { code: -32700, message: "parse error" } },
      { status: 400 }
    );
  }
  const { id = null, method, params = {} } = body;
  const ok = (result: unknown) => NextResponse.json({ jsonrpc: "2.0", id, result });
  const err = (code: number, message: string) => NextResponse.json({ jsonrpc: "2.0", id, error: { code, message } });
  try {
    if (method === "initialize") {
      return ok({
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "labour-tightness", version: "1.0.0" },
      });
    }
    if (method === "notifications/initialized" || method === "ping") return ok({});
    if (method === "tools/list") return ok({ tools: TOOLS });
    if (method === "tools/call") {
      const p = (params ?? {}) as { name?: string; arguments?: Record<string, unknown> };
      const result = callTool(p.name ?? "", p.arguments ?? {});
      return ok({ content: [{ type: "text", text: JSON.stringify(result) }] });
    }
    return err(-32601, `method not found: ${method}`);
  } catch (e) {
    return err(-32603, e instanceof Error ? e.message : "internal error");
  }
}

export async function GET() {
  return NextResponse.json({ error: "use POST with JSON-RPC 2.0 (Streamable HTTP)" }, { status: 405 });
}
