"use client";

import Link from "next/link";
import { useLang, fmtNum } from "@/i18n";
import { SERIES, SECTOR_ROWS, LATEST } from "@/data";
import { TightnessChart } from "@/components/charts";

export default function Home() {
  const { t, lang } = useLang();
  const latestSectors = SECTOR_ROWS.filter((r) => r.quarter === LATEST.quarter);
  const widest = [...latestSectors].sort((a, b) => b.gap_pp_us_minus_ca - a.gap_pp_us_minus_ca)[0];
  return (
    <div>
      <section className="mx-auto max-w-[1200px] px-6 pb-10 pt-16 md:pt-24">
        <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-canada">{t.home.kicker}</p>
        <h1 className="display mt-4 max-w-[880px] text-[clamp(38px,5.4vw,68px)]">{t.home.title}</h1>
        <p className="mt-6 max-w-[680px] text-[17px] leading-relaxed text-ink/70">{t.home.lede}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/explorer"
            className="rounded-full bg-canada px-7 py-3.5 text-[15px] font-semibold text-white transition hover:bg-canada-dark"
          >
            {t.home.explore}
          </Link>
          <Link
            href="/methodology"
            className="rounded-full border border-line px-7 py-3.5 text-[15px] font-semibold text-ink/75 transition hover:border-ink/40"
          >
            {t.home.method}
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {t.home.stats.map((s) => (
            <div key={s.value} className="rounded-[24px] border border-line bg-paper-warm p-5">
              <p className="display text-[32px] text-canada md:text-[38px]">{s.value}</p>
              <p className="mt-2 text-[13px] leading-snug text-ink/60">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-10">
        <div className="rounded-[32px] border border-line bg-paper p-6 md:p-10">
          <h2 className="display text-[28px] md:text-[34px]">{t.home.chartTitle}</h2>
          <p className="mt-2 max-w-[700px] text-[14.5px] text-ink/60">{t.home.chartSub}</p>
          <div className="mt-6">
            <TightnessChart series={SERIES} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[32px] border border-line bg-paper-warm p-8">
            <h2 className="display text-[28px]">{t.home.whatTitle}</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink/70">{t.home.whatBody}</p>
            <Link href="/showcase" className="mt-6 inline-block text-[15px] font-semibold text-canada hover:text-canada-dark">
              {t.home.showcaseTeaser} →
            </Link>
          </div>
          <div className="rounded-[32px] border border-line bg-paper-warm p-8">
            <p className="text-[13px] font-semibold uppercase tracking-[0.15em] text-ink/45">
              {lang === "fr" ? "Le plus grand ecart sectoriel" : "Widest sector gap"} · {LATEST.quarter}
            </p>
            <p className="display mt-3 text-[30px]">
              {lang === "fr" ? widest.label_fr : widest.label_en}
            </p>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink/70">
              {lang === "fr" ? "Etats-Unis" : "US"} {fmtNum(widest.us_rate, lang)}% ·{" "}
              {lang === "fr" ? "Canada" : "Canada"} {fmtNum(widest.ca_rate, lang)}% ·{" "}
              <span className="font-semibold text-canada">
                +{fmtNum(widest.gap_pp_us_minus_ca, lang)} {lang === "fr" ? "points" : "points"}
              </span>
            </p>
            <Link href="/data" className="mt-6 inline-block text-[15px] font-semibold text-canada hover:text-canada-dark">
              {t.home.dataTeaser} →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
