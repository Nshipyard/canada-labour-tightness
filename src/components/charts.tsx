"use client";

import { useLang } from "@/i18n";
import type { QuarterRow, SectorRow } from "@/data";

const US = "#1a56db";
const CA = "#d80621";

/** Money chart: US vs Canada harmonized vacancy rate, 2015Q1 to 2026Q2. */
export function TightnessChart({ series }: { series: QuarterRow[] }) {
  const { t, lang } = useLang();
  const W = 920;
  const H = 420;
  const padL = 52;
  const padR = 16;
  const padT = 16;
  const padB = 44;
  const maxV = Math.max(...series.map((r) => Math.max(r.us_rate_exgov, r.ca_rate)));
  const top = Math.ceil(maxV + 0.5);
  const x = (i: number) => padL + (i / (series.length - 1)) * (W - padL - padR);
  const y = (v: number) => padT + (1 - v / top) * (H - padT - padB);
  const line = (get: (r: QuarterRow) => number) =>
    series.map((r, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(get(r)).toFixed(1)}`).join(" ");
  const years = [...new Set(series.map((r) => r.quarter.slice(0, 4)))];
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={t.home.chartTitle}>
        {[0, 1, 2, 3, 4, 5, 6].map((g) => {
          const v = (top / 6) * g;
          return (
            <g key={g}>
              <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke="rgba(10,15,30,0.08)" />
              <text x={padL - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="rgba(10,15,30,0.55)">
                {v.toFixed(1)}
              </text>
            </g>
          );
        })}
        {years.map((yr) => {
          const i = series.findIndex((r) => r.quarter === `${yr}Q1`);
          if (i < 0) return null;
          return (
            <text key={yr} x={x(i)} y={H - 14} textAnchor="middle" fontSize="11" fill="rgba(10,15,30,0.55)">
              {yr}
            </text>
          );
        })}
        <path d={line((r) => r.us_rate_exgov)} fill="none" stroke={US} strokeWidth="2.5" />
        <path d={line((r) => r.ca_rate)} fill="none" stroke={CA} strokeWidth="2.5" />
        {(() => {
          const last = series[series.length - 1];
          const i = series.length - 1;
          return (
            <g fontSize="12" fontWeight="600">
              <circle cx={x(i)} cy={y(last.us_rate_exgov)} r="4" fill={US} />
              <circle cx={x(i)} cy={y(last.ca_rate)} r="4" fill={CA} />
              <text x={x(i) - 8} y={y(last.us_rate_exgov) - 10} textAnchor="end" fill={US}>
                {t.charts.usLabel} {last.us_rate_exgov.toFixed(2)}%
              </text>
              <text x={x(i) - 8} y={y(last.ca_rate) + 18} textAnchor="end" fill={CA}>
                {t.charts.caLabel} {last.ca_rate.toFixed(2)}%
              </text>
            </g>
          );
        })()}
      </svg>
      <figcaption className="mt-2 flex flex-wrap items-center gap-5 text-[13px] text-ink/60">
        <span className="flex items-center gap-2">
          <span className="inline-block h-[3px] w-6 rounded" style={{ background: US }} />
          {t.charts.usLabel} ({lang === "fr" ? "hors secteur public" : "ex-government"})
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-[3px] w-6 rounded" style={{ background: CA }} />
          {t.charts.caLabel} ({lang === "fr" ? "total publie" : "published total"})
        </span>
        <span>{t.charts.yAxis}</span>
      </figcaption>
    </figure>
  );
}

/** Diverging bars: latest-quarter sector gaps, US minus Canada. */
export function SectorBars({ rows }: { rows: SectorRow[] }) {
  const { t, lang } = useLang();
  const sorted = [...rows].sort((a, b) => b.gap_pp_us_minus_ca - a.gap_pp_us_minus_ca);
  const W = 920;
  const rowH = 34;
  const padL = 300;
  const padR = 60;
  const H = sorted.length * rowH + 40;
  const maxGap = Math.max(...sorted.map((r) => Math.abs(r.gap_pp_us_minus_ca)), 0.5);
  const cx = padL + (W - padL - padR) / 2;
  const sx = (v: number) => cx + (v / (maxGap * 1.15)) * ((W - padL - padR) / 2);
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
        <line x1={cx} x2={cx} y1={8} y2={H - 28} stroke="rgba(10,15,30,0.25)" />
        {sorted.map((r, i) => {
          const yMid = 8 + i * rowH + rowH / 2;
          const label = lang === "fr" ? r.label_fr : r.label_en;
          const g = r.gap_pp_us_minus_ca;
          const x1 = Math.min(cx, sx(g));
          const x2 = Math.max(cx, sx(g));
          const col = g >= 0 ? US : CA;
          return (
            <g key={r.pair}>
              <text x={padL - 12} y={yMid + 4} textAnchor="end" fontSize="12.5" fill="rgba(10,15,30,0.8)">
                {label.length > 34 ? label.slice(0, 33) + "…" : label}
              </text>
              <rect x={x1} y={yMid - 8} width={Math.max(x2 - x1, 2)} height={16} rx={3} fill={col} opacity={0.85} />
              <text
                x={g >= 0 ? x2 + 6 : x1 - 6}
                y={yMid + 4}
                textAnchor={g >= 0 ? "start" : "end"}
                fontSize="12"
                fontWeight="600"
                fill={col}
              >
                {g >= 0 ? "+" : ""}
                {g.toFixed(2)}
              </text>
            </g>
          );
        })}
        <text x={padL} y={H - 8} fontSize="11" fill="rgba(10,15,30,0.55)">
          ← {t.charts.caLabel} {lang === "fr" ? "plus tendu" : "tighter"}
        </text>
        <text x={W - padR} y={H - 8} textAnchor="end" fontSize="11" fill="rgba(10,15,30,0.55)">
          {t.charts.usLabel} {lang === "fr" ? "plus tendu" : "tighter"} →
        </text>
      </svg>
      <figcaption className="mt-2 text-[13px] text-ink/60">{t.charts.gapLabel}</figcaption>
    </figure>
  );
}

/** Heatmap: mean US-minus-Canada gap by sector and year. */
export function GapHeatmap({ rows }: { rows: SectorRow[] }) {
  const { lang } = useLang();
  const years = [...new Set(rows.map((r) => r.quarter.slice(0, 4)))].sort();
  const pairs = [...new Map(rows.map((r) => [r.pair, r])).values()];
  const cell: Record<string, Record<string, number[]>> = {};
  for (const r of rows) {
    const yr = r.quarter.slice(0, 4);
    (cell[r.pair] ??= {})[yr] ??= [];
    cell[r.pair][yr].push(r.gap_pp_us_minus_ca);
  }
  const mean = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length;
  const W = 920;
  const labelW = 300;
  const gridW = W - labelW - 20;
  const cw = gridW / years.length;
  const rh = 34;
  const H = pairs.length * rh + 36;
  const color = (v: number) => {
    const c = Math.max(-2.5, Math.min(2.5, v)) / 2.5;
    if (c >= 0) return `rgba(26,86,219,${0.08 + c * 0.82})`;
    return `rgba(216,6,33,${0.08 - c * 0.82})`;
  };
  return (
    <figure>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[640px]" role="img">
          {years.map((yr, j) => (
            <text key={yr} x={labelW + j * cw + cw / 2} y={16} textAnchor="middle" fontSize="11" fill="rgba(10,15,30,0.55)">
              {yr}
            </text>
          ))}
          {pairs.map((p, i) => {
            const y0 = 24 + i * rh;
            const label = lang === "fr" ? p.label_fr : p.label_en;
            return (
              <g key={p.pair}>
                <text x={labelW - 12} y={y0 + rh / 2 + 4} textAnchor="end" fontSize="12.5" fill="rgba(10,15,30,0.8)">
                  {label.length > 34 ? label.slice(0, 33) + "…" : label}
                </text>
                {years.map((yr, j) => {
                  const vals = cell[p.pair]?.[yr];
                  const v = vals ? mean(vals) : null;
                  return (
                    <g key={yr}>
                      <rect
                        x={labelW + j * cw + 1}
                        y={y0 + 2}
                        width={cw - 2}
                        height={rh - 4}
                        rx={3}
                        fill={v === null ? "rgba(10,15,30,0.05)" : color(v)}
                      />
                      {v !== null && (
                        <text
                          x={labelW + j * cw + cw / 2}
                          y={y0 + rh / 2 + 4}
                          textAnchor="middle"
                          fontSize="10.5"
                          fontWeight="600"
                          fill={Math.abs(v) > 1.2 ? "#fff" : "rgba(10,15,30,0.75)"}
                        >
                          {v >= 0 ? "+" : ""}
                          {v.toFixed(1)}
                        </text>
                      )}
                    </g>
                  );
            })}
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="mt-2 text-[13px] text-ink/60">
        {lang === "fr"
          ? "Ecart moyen E.-U. moins Canada en points de pourcentage, par annee. Bleu: les E.-U. plus tendus. Rouge: le Canada plus tendu."
          : "Mean US-minus-Canada gap in percentage points, by year. Blue: US tighter. Red: Canada tighter."}
      </figcaption>
    </figure>
  );
}
