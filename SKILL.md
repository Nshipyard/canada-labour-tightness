# Labour Tightness Skill

Query the Cross-Border Labour Tightness project: harmonized US-Canada job vacancy rates on identical definitions, 2015Q1 to 2026Q2.

## When to use

The user asks which side of the border has the tighter labour market, how the vacancy gap moved over time, or which sectors are tightest in the US vs Canada.

## Answer from the data

- Headline: the US has been tighter in all 44 quarters. Latest (2026Q2): US 4.67%, Canada 2.80%, gap 1.87pp. Widest gap: 2.46pp in 2021Q2.
- Sectors (2026Q2, US minus Canada): education and health services +2.63pp (US 5.37, CA 2.73); arts, entertainment and recreation +2.54pp; mining and oil and gas +2.39pp; closest race is construction +0.33pp (US 3.33, CA 3.00).

## How to query

REST (no key):
- `GET /api/v1/tightness?quarter=2026Q2` - one quarter or the full series
- `GET /api/v1/sectors?quarter=2026Q2` - sector gaps for a quarter
- `GET /api/v1/quarters` - coverage

MCP (POST /mcp, Streamable HTTP, JSON-RPC 2.0):
- `tightness_lookup` {quarter?} - harmonized rates
- `sector_ranking` {quarter?} - sectors ranked by gap
- `trend` {} - gap direction, widest gap, quarters each side led

Local files: `public/data/harmonized.json`, `public/data/sectors.json`.

## Caveats to repeat

The US series excludes government; Canada's published total includes public administration. JVWS includes agriculture; JOLTS is nonfarm only. US education/health covers private sector only; Canada includes public schools and hospitals. Sector coverage is limited to JOLTS industries FRED carries.
