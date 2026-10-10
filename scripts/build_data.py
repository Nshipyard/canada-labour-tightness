#!/usr/bin/env python3
"""Build the harmonized US-Canada labour tightness dataset.

Sources (all keyless, retrieved 2026-10-10):
- US: FRED fredgraph.csv mirrors of BLS JOLTS (monthly, seasonally adjusted) and
  CES employment (PAYEMS total nonfarm, USGOVT government).
- Canada: StatCan table 14-10-0400-01 (JVWS, quarterly, seasonally adjusted),
  direct CSV zip from www150.statcan.gc.ca.

Harmonization recipe:
1. Quarterly aggregation: mean of the 3 JOLTS/CES months in each quarter.
2. Scope cut: US openings minus government openings (JTS9000JOL); US employment
   minus government employment (USGOVT). JVWS total kept as published.
3. Rate recomputation: rate = openings / (employment + openings) * 100,
   the identical formula both agencies publish.
4. Sector crosswalk: JOLTS industries to NAICS 2-digit JVWS sectors; where one
   JOLTS industry spans several JVWS sectors, the Canadian side is composited
   by summing vacancies and payroll employees, then recomputing the rate.

Outputs: public/data/*.json (app), public/downloads/*.csv (users).
"""
import csv, io, json, os, urllib.request, zipfile
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "data", "raw")
PUBDATA = os.path.join(ROOT, "public", "data")
PUBDL = os.path.join(ROOT, "public", "downloads")
for d in (RAW, PUBDATA, PUBDL):
    os.makedirs(d, exist_ok=True)

UA = {"User-Agent": "NshipyardLabourTightness/1.0 (research build; contact via github.com/Nshipyard)"}

def fetch(url, dest):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r, open(dest, "wb") as f:
        f.write(r.read())
    print("fetched", url, os.path.getsize(dest), "bytes")

# --- 1. downloads -----------------------------------------------------------
FRED_IDS = ["JTSJOL", "JTSJOR", "JTS9000JOL", "JTS9200JOL", "PAYEMS", "USGOVT",
            "JTS1000JOL", "JTS1000JOR", "JTS2300JOL", "JTS2300JOR",
            "JTS3000JOL", "JTS3000JOR", "JTS4000JOL", "JTS4000JOR",
            "JTS4400JOL", "JTS4400JOR", "JTS6000JOL", "JTS6000JOR",
            "JTS6200JOL", "JTS6200JOR", "JTS7000JOL", "JTS7000JOR",
            "JTS7100JOL", "JTS7100JOR", "JTS7200JOL", "JTS7200JOR"]
for sid in FRED_IDS:
    p = os.path.join(RAW, f"fred_{sid}.csv")
    if not os.path.exists(p):
        fetch(f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={sid}", p)

zip_path = os.path.join(RAW, "statcan_14100400.zip")
if not os.path.exists(zip_path):
    fetch("https://www150.statcan.gc.ca/n1/tbl/csv/14100400-eng.zip", zip_path)
with zipfile.ZipFile(zip_path) as z:
    z.extract("14100400.csv", RAW)
print("statcan rows:", sum(1 for _ in open(os.path.join(RAW, "14100400.csv"), encoding="utf-8-sig")) - 1)

# --- 2. parse FRED monthly ---------------------------------------------------
def read_fred(path):
    out = {}
    with open(path, encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        col = reader.fieldnames[1]
        for row in reader:
            v = row[col]
            if v not in ("", "."):
                out[row["observation_date"]] = float(v)
    return out

fred = {sid: read_fred(os.path.join(RAW, f"fred_{sid}.csv")) for sid in FRED_IDS}

def quarter_of(d):
    y, m = int(d[:4]), int(d[5:7])
    return f"{y}Q{(m - 1) // 3 + 1}"

def quarterly_mean(series):
    buckets = {}
    for d, v in series.items():
        buckets.setdefault(quarter_of(d), []).append(v)
    return {q: sum(v) / len(v) for q, v in sorted(buckets.items()) if len(v) == 3}

qm = {sid: quarterly_mean(s) for sid, s in fred.items()}

# --- 3. harmonized headline: US ex-government vs Canada total ----------------
quarters = sorted(set(qm["JTSJOL"]) & set(qm["PAYEMS"]))
harmonized = []
for q in quarters:
    us_open = qm["JTSJOL"][q] - qm["JTS9000JOL"][q]
    us_emp = qm["PAYEMS"][q] - qm["USGOVT"][q]
    us_rate = us_open / (us_emp + us_open) * 100
    harmonized.append({
        "quarter": q,
        "us_openings_thousands": round(us_open, 1),
        "us_employment_thousands": round(us_emp, 1),
        "us_rate_exgov": round(us_rate, 2),
        "us_rate_published_total": round(qm["JTSJOR"][q], 2),
        "us_gov_openings_thousands": round(qm["JTS9000JOL"][q], 1),
    })

# --- 4. Canada JVWS ----------------------------------------------------------
ca = {}  # quarter -> sector -> {vac, emp, rate}
with open(os.path.join(RAW, "14100400.csv"), encoding="utf-8-sig") as f:
    for row in csv.DictReader(f):
        ref = row["REF_DATE"]  # "2015-01" .. "2026-04"
        y, m = int(ref[:4]), int(ref[5:7])
        q = f"{y}Q{(m - 1) // 3 + 1}"
        sector = row["North American Industry Classification System (NAICS)"]
        stat = row["Statistics"]
        val = row["VALUE"]
        if val == "":
            continue
        qd = ca.setdefault(q, {}).setdefault(sector, {})
        qd[{"Job vacancies": "vac", "Payroll employees": "emp",
            "Job vacancy rate": "rate"}[stat]] = float(val)

def ca_total(q):
    d = ca[q]["Total, all industries"]
    return d["vac"], d["emp"], d["rate"]

for h in harmonized:
    q = h["quarter"]
    if q in ca and "Total, all industries" in ca[q]:
        vac, emp, rate = ca_total(q)
        h["ca_vacancies"] = int(vac)
        h["ca_payroll_employees"] = int(emp)
        h["ca_rate"] = rate
        h["gap_pp_us_minus_ca"] = round(h["us_rate_exgov"] - rate, 2)
        h["tighter"] = "US" if h["gap_pp_us_minus_ca"] > 0 else ("Canada" if h["gap_pp_us_minus_ca"] < 0 else "tie")
    else:
        h["ca_vacancies"] = None

harmonized = [h for h in harmonized if h["ca_vacancies"] is not None]
print("harmonized quarters:", len(harmonized), harmonized[0]["quarter"], "->", harmonized[-1]["quarter"])

# --- 5. sector crosswalk ------------------------------------------------------
# (us_jor_id, ca_sector_name or list, label_en, label_fr, note_en, note_fr)
PAIRS = [
    ("JTS2300JOR", "Construction [23]", "Construction", "Construction", "", ""),
    ("JTS3000JOR", "Manufacturing [31-33]", "Manufacturing", "Fabrication", "", ""),
    ("JTS1000JOR", "Mining, quarrying, and oil and gas extraction [21]",
     "Mining and oil and gas", "Mines, petrole et gaz",
     "US series is mining and logging; logging is a small residual.",
     "La serie americaine inclut l'exploitation forestiere; ecart residuel faible."),
    ("JTS4400JOR", "Retail trade [44-45]", "Retail trade", "Commerce de detail", "", ""),
    ("JTS4000JOR", ["Wholesale trade [41]", "Retail trade [44-45]",
                    "Transportation and warehousing [48-49]", "Utilities [22]"],
     "Trade, transportation and utilities", "Commerce, transport et services publics",
     "Canadian side is a composite of four JVWS sectors, rate recomputed from summed vacancies and payroll.",
     "Le cote canadien combine quatre secteurs; taux recalcule."),
    ("JTS6000JOR", ["Educational services [61]", "Health care and social assistance [62]"],
     "Education and health services", "Education et sante",
     "US covers private sector only; Canada includes public schools and hospitals.",
     "Les Etats-Unis couvrent le prive seulement; le Canada inclut le public."),
    ("JTS6200JOR", "Health care and social assistance [62]",
     "Health care and social assistance", "Soins de sante et assistance sociale",
     "US covers private sector only; Canada includes public hospitals.",
     "Les Etats-Unis couvrent le prive seulement; le Canada inclut les hopitaux publics."),
    ("JTS7000JOR", ["Arts, entertainment and recreation [71]", "Accommodation and food services [72]"],
     "Leisure and hospitality", "Loisirs et hebergement",
     "Canadian side is a composite of NAICS 71 and 72; rate recomputed.",
     "Le cote canadien combine les codes 71 et 72; taux recalcule."),
    ("JTS7100JOR", "Arts, entertainment and recreation [71]",
     "Arts, entertainment and recreation", "Arts, spectacles et loisirs", "", ""),
    ("JTS7200JOR", "Accommodation and food services [72]",
     "Accommodation and food services", "Hebergement et restauration", "", ""),
]

def ca_rate_for(q, sectors):
    if isinstance(sectors, str):
        sectors = [sectors]
    vac = emp = 0.0
    ok = True
    for s in sectors:
        d = ca.get(q, {}).get(s)
        if not d or "vac" not in d or "emp" not in d:
            ok = False
            break
        vac += d["vac"]
        emp += d["emp"]
    if not ok or emp == 0:
        return None
    return vac / (emp + vac) * 100

sectors_out = []
for us_id, ca_sec, label_en, label_fr, note_en, note_fr in PAIRS:
    key = us_id.replace("JOR", "")
    for q in sorted(set(qm[us_id]) & set(ca)):
        ca_r = ca_rate_for(q, ca_sec)
        if ca_r is None:
            continue
        us_r = qm[us_id][q]
        sectors_out.append({
            "pair": key, "label_en": label_en, "label_fr": label_fr,
            "quarter": q,
            "us_rate": round(us_r, 2), "ca_rate": round(ca_r, 2),
            "gap_pp_us_minus_ca": round(us_r - ca_r, 2),
            "note_en": note_en, "note_fr": note_fr,
        })
print("sector rows:", len(sectors_out))

# --- 6. write outputs ----------------------------------------------------------
meta = {
    "built": date.today().isoformat(),
    "sources": {
        "us": "BLS JOLTS via FRED (monthly SA) + CES employment via FRED (PAYEMS, USGOVT)",
        "ca": "StatCan table 14-10-0400-01, Job Vacancy and Wage Survey, quarterly SA",
    },
    "reference": "Bauer, K. (2015). Comparison of U.S. and international labor turnover statistics. Monthly Labor Review. https://doi.org/10.21916/mlr.2015.26",
    "quarters": [h["quarter"] for h in harmonized],
}
with open(os.path.join(PUBDATA, "harmonized.json"), "w") as f:
    json.dump({"meta": meta, "series": harmonized}, f)
with open(os.path.join(PUBDATA, "sectors.json"), "w") as f:
    json.dump({"meta": meta, "pairs": [
        {"id": p[0].replace("JOR", ""), "label_en": p[2], "label_fr": p[3],
         "note_en": p[4], "note_fr": p[5]} for p in PAIRS],
        "series": sectors_out}, f)

with open(os.path.join(PUBDL, "harmonized_quarterly.csv"), "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["quarter", "us_openings_thousands_ex_gov", "us_employment_thousands_ex_gov",
                "us_vacancy_rate_pct_ex_gov", "us_vacancy_rate_pct_published_total",
                "ca_vacancies", "ca_payroll_employees", "ca_vacancy_rate_pct",
                "gap_pp_us_minus_ca", "tighter_side"])
    for h in harmonized:
        w.writerow([h["quarter"], h["us_openings_thousands"], h["us_employment_thousands"],
                    h["us_rate_exgov"], h["us_rate_published_total"],
                    h["ca_vacancies"], h["ca_payroll_employees"], h["ca_rate"],
                    h["gap_pp_us_minus_ca"], h["tighter"]])

with open(os.path.join(PUBDL, "harmonized_sectors.csv"), "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["pair", "label_en", "quarter", "us_rate_pct", "ca_rate_pct", "gap_pp_us_minus_ca"])
    for s in sectors_out:
        w.writerow([s["pair"], s["label_en"], s["quarter"], s["us_rate"], s["ca_rate"], s["gap_pp_us_minus_ca"]])

# --- 7. findings ---------------------------------------------------------------
us_tighter = sum(1 for h in harmonized if h["tighter"] == "US")
latest = harmonized[-1]
gaps = [(h["quarter"], h["gap_pp_us_minus_ca"]) for h in harmonized]
max_gap = max(gaps, key=lambda x: x[1]); min_gap = min(gaps, key=lambda x: x[1])
print(f"US tighter in {us_tighter}/{len(harmonized)} quarters")
print("latest:", latest["quarter"], "US", latest["us_rate_exgov"], "CA", latest["ca_rate"],
      "gap", latest["gap_pp_us_minus_ca"])
print("max US lead:", max_gap, "max CA lead:", min_gap)
# latest sector gaps
lat_q = latest["quarter"]
sg = [(s["label_en"], s["gap_pp_us_minus_ca"], s["us_rate"], s["ca_rate"])
      for s in sectors_out if s["quarter"] == lat_q]
for row in sorted(sg, key=lambda x: -x[1])[:3]:
    print("widest US lead:", row)
for row in sorted(sg, key=lambda x: x[1])[:3]:
    print("widest CA lead:", row)
