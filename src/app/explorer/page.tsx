"use client";

import { useMemo, useState } from "react";
import { useLang, fmtNum } from "@/i18n";
import { SERIES, PAIRS, SECTOR_ROWS, QUARTERS } from "@/data";
import { TightnessChart, SectorBars } from "@/components/charts";

export default function ExplorerPage() {
  const { t, lang } = useLang();
  const [sector, setSector] = useState<string>("headline");
  const [quarter, setQuarter] = useState<string>("all");

  const rows = useMemo(() => {
    if (sector === "headline") {
      return SERIES.filter((r) => quarter === "all" || r.quarter === quarter).map((r) => ({
        key: r.quarter,
        quarter: r.quarter,
        us: r.us_rate_exgov,
        ca: r.ca_rate,
        gap: r.gap_pp_us_minus_ca,
        tighter: r.tighter,
      }));
    }
    return SECTOR_ROWS.filter(
      (r) => r.pair === sector && (quarter === "all" || r.quarter === quarter)
    ).map((r) => ({
      key: `${r.pair}-${r.quarter}`,
      quarter: r.quarter,
      us: r.us_rate,
      ca: r.ca_rate,
      gap: r.gap_pp_us_minus_ca,
      tighter: r.gap_pp_us_minus_ca > 0 ? "US" : r.gap_pp_us_minus_ca < 0 ? "Canada" : ("tie" as const),
    }));
  }, [sector, quarter]);

  const note = PAIRS.find((p) => p.id === sector);
  const latestQ = QUARTERS[QUARTERS.length - 1];

  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-20 pt-14 md:pt-20">
      <h1 className="display text-[clamp(34px,4.6vw,54px)]">{t.explorer.title}</h1>
      <p className="mt-4 max-w-[640px] text-[16px] text-ink/65">{t.explorer.lede}</p>

      <div className="mt-8 flex flex-wrap gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ink/50">{t.explorer.sector}</span>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="min-w-[260px] rounded-2xl border border-line bg-paper px-4 py-2.5 text-[14.5px]"
          >
            <option value="headline">{t.explorer.allSectors}</option>
            {PAIRS.map((p) => (
              <option key={p.id} value={p.id}>
                {lang === "fr" ? p.label_fr : p.label_en}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ink/50">{t.explorer.quarter}</span>
          <select
            value={quarter}
            onChange={(e) => setQuarter(e.target.value)}
            className="rounded-2xl border border-line bg-paper px-4 py-2.5 text-[14.5px]"
          >
            <option value="all">{t.explorer.allQuarters}</option>
            {QUARTERS.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </label>
      </div>

      {note && (note.note_en || note.note_fr) && (
        <p className="mt-4 max-w-[720px] rounded-2xl bg-muted p-4 text-[13.5px] text-ink/65">
          {lang === "fr" ? note.note_fr : note.note_en}
        </p>
      )}

      {sector === "headline" && quarter === "all" && (
        <div className="mt-8 rounded-[32px] border border-line bg-paper p-6 md:p-10">
          <TightnessChart series={SERIES} />
        </div>
      )}

      {sector !== "headline" && quarter === "all" && (
        <div className="mt-8 rounded-[32px] border border-line bg-paper p-6 md:p-10">
          <SectorBars rows={SECTOR_ROWS.filter((r) => r.quarter === latestQ)} />
        </div>
      )}

      <div className="mt-8 overflow-x-auto rounded-[24px] border border-line">
        <table className="w-full min-w-[640px] text-left text-[14px]">
          <thead>
            <tr className="border-b border-line bg-paper-warm text-[12.5px] uppercase tracking-[0.08em] text-ink/55">
              <th className="px-5 py-3.5 font-semibold">{t.explorer.colQuarter}</th>
              <th className="px-5 py-3.5 font-semibold">{t.explorer.colUs}</th>
              <th className="px-5 py-3.5 font-semibold">{t.explorer.colCa}</th>
              <th className="px-5 py-3.5 font-semibold">{t.explorer.colGap}</th>
              <th className="px-5 py-3.5 font-semibold">{t.explorer.colTighter}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="border-b border-line/60 last:border-0 hover:bg-paper-warm">
                <td className="px-5 py-3 font-mono">{r.quarter}</td>
                <td className="px-5 py-3 font-semibold text-[#1a56db]">{fmtNum(r.us, lang)}%</td>
                <td className="px-5 py-3 font-semibold text-canada">{fmtNum(r.ca, lang)}%</td>
                <td className="px-5 py-3">
                  {r.gap >= 0 ? "+" : ""}
                  {fmtNum(r.gap, lang)}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-[12.5px] font-semibold ${
                      r.tighter === "US"
                        ? "bg-[#1a56db]/10 text-[#1a56db]"
                        : r.tighter === "Canada"
                          ? "bg-canada/10 text-canada"
                          : "bg-muted text-ink/60"
                    }`}
                  >
                    {r.tighter === "US" ? t.explorer.us : r.tighter === "Canada" ? t.explorer.canada : t.explorer.tie}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[13px] text-ink/50">{t.explorer.unitNote}</p>
    </div>
  );
}
