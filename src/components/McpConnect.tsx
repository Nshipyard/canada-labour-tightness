"use client";

import { useState } from "react";
import { useLang } from "@/i18n";

export default function McpConnect() {
  const { t } = useLang();
  const [tab, setTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [origin] = useState(() => window.location.origin);
  const endpoint = `${origin}/mcp`;
  const prompts = [
    `Add this MCP server to ChatGPT (Settings > Apps > Add custom app):\nURL: ${endpoint}\nTools: tightness_lookup (harmonized US-Canada vacancy rate by quarter), sector_ranking (sector gaps for a quarter), trend (gap direction over time).\nThen ask: "Which side of the border has the tighter labour market right now?"`,
    `Add this MCP server in Claude (Settings > Connectors > Add custom connector):\nURL: ${endpoint}\nTools: tightness_lookup, sector_ranking, trend.\nThen ask: "Compare US and Canadian labour tightness by sector for the latest quarter."`,
    `Claude Code / Codex CLI:\nclaude mcp add --transport http labour-tightness ${endpoint}\nThen: "Use the labour-tightness tools to chart the US-Canada vacancy gap since 2015."`,
    `Any MCP client (Streamable HTTP):\nEndpoint: ${endpoint}\n1. POST {"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"client","version":"1.0"}}}\n2. POST {"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}\n3. POST {"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"tightness_lookup","arguments":{"quarter":"2026Q2"}}}`,
  ];
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompts[tab]);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div className="rounded-[24px] border border-line bg-paper p-6 md:p-8">
      <h3 className="display text-[24px]">{t.mcp.title}</h3>
      <p className="mt-2 max-w-[640px] text-[14.5px] text-ink/65">{t.mcp.body}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {t.mcp.tabs.map((label, i) => (
          <button
            key={label}
            onClick={() => setTab(i)}
            className={`rounded-full px-4 py-2 text-[13.5px] font-semibold transition ${
              tab === i ? "bg-ink text-white" : "border border-line text-ink/70 hover:border-ink/40"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <pre className="mt-4 overflow-x-auto rounded-2xl bg-muted p-5 font-mono text-[12.5px] leading-relaxed text-ink/80">
        {prompts[tab]}
      </pre>
      <button
        onClick={copy}
        className={`mt-4 rounded-full px-5 py-2.5 text-[13.5px] font-semibold transition ${
          copied ? "bg-green-700 text-white" : "bg-canada text-white hover:bg-canada-dark"
        }`}
      >
        {copied ? t.showcase.copied : t.showcase.cite}
      </button>
    </div>
  );
}
