import harmonized from "../public/data/harmonized.json";
import sectors from "../public/data/sectors.json";

export interface QuarterRow {
  quarter: string;
  us_openings_thousands: number;
  us_employment_thousands: number;
  us_rate_exgov: number;
  us_rate_published_total: number;
  us_gov_openings_thousands: number;
  ca_vacancies: number;
  ca_payroll_employees: number;
  ca_rate: number;
  gap_pp_us_minus_ca: number;
  tighter: "US" | "Canada" | "tie";
}

export interface SectorPair {
  id: string;
  label_en: string;
  label_fr: string;
  note_en: string;
  note_fr: string;
}

export interface SectorRow {
  pair: string;
  label_en: string;
  label_fr: string;
  quarter: string;
  us_rate: number;
  ca_rate: number;
  gap_pp_us_minus_ca: number;
  note_en: string;
  note_fr: string;
}

export const META = harmonized.meta as {
  built: string;
  sources: { us: string; ca: string };
  reference: string;
  quarters: string[];
};

export const SERIES = harmonized.series as QuarterRow[];
export const PAIRS = sectors.pairs as SectorPair[];
export const SECTOR_ROWS = sectors.series as SectorRow[];

export const LATEST = SERIES[SERIES.length - 1];
export const QUARTERS = SERIES.map((r) => r.quarter);

export function sectorRowsForQuarter(quarter: string): SectorRow[] {
  return SECTOR_ROWS.filter((r) => r.quarter === quarter);
}

export function quartersForPair(pair: string): SectorRow[] {
  return SECTOR_ROWS.filter((r) => r.pair === pair);
}
