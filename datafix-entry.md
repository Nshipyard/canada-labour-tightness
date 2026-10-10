# Data-fixes log entry - Cross-Border Labour Tightness

## EN

**Project:** Cross-Border Labour Tightness
**Datasets:** BLS Job Openings and Labor Turnover Survey via FRED (monthly, seasonally adjusted); CES employment via FRED (PAYEMS, USGOVT); StatCan table 14-10-0400-01, Job Vacancy and Wage Survey (quarterly, seasonally adjusted)
**Vintage:** US through August 2026, Canada through 2026Q2. Built 2026-10-10.
**Methods:** normalization, temporal joins, crosswalks, quarantine (scope cut)

### What was wrong

Neither source was broken. The problem was comparability, four ways:

1. **Frequency mismatch.** JOLTS is monthly; JVWS is quarterly. A side-by-side chart of raw releases compares a month against a quarter.
2. **Scope mismatch.** The published US total includes government (about 731,000 openings in August 2026). The comparison targets the business labour market, and the two surveys draw the public-sector boundary differently.
3. **Formula drift.** Both agencies define the vacancy rate as openings / (employment + openings) x 100, but the published US rate bakes in government employment. Averaging published monthly rates after a scope change would compound the error.
4. **Industry cuts that do not line up.** JOLTS publishes "trade, transportation, and utilities" as one industry; JVWS splits it into wholesale trade, retail trade, transportation and warehousing, and utilities. JOLTS "private education and health services" is private-only; JVWS education and health include the public sector.

### The fix

1. **Quarterly aggregation.** Each JOLTS and CES quarter is the mean of its three months. JVWS needed no aggregation.
2. **Scope cut.** US openings minus JOLTS government openings (JTS9000JOL); US employment minus CES government employment (USGOVT). Quarantined from every harmonized aggregate.
3. **Rate recomputation.** The rate is recomputed from quarterly levels after the cut, never by averaging published rates.
4. **NAICS crosswalk.** Ten JOLTS industries mapped to JVWS sectors. Where one JOLTS industry spans several JVWS sectors, the Canadian side is composited by summing vacancies and payroll employees first, then recomputing the rate. Every imperfect match carries a bilingual note.

### Before / after

- Before: `"JOLTS August 2026: 7,079K openings, 4.3%"` next to `"JVWS 2026Q2: 510,220 vacancies, 2.8%"` (a month against a quarter, government in on one side)
- After: `"2026Q2: US 4.67% ex-government vs Canada 2.80%, gap 1.87pp"` (same quarter, same formula, government out)
- Before: US published total 2026Q2 4.47% (includes government)
- After: US harmonized 2026Q2 4.67% (excludes government); the scope cut moves the US rate up 0.2 points

### Result

44 quarters (2015Q1 to 2026Q2) on identical definitions, 436 sector-quarter rows across 10 NAICS pairs. The US is tighter in all 44 quarters; the gap peaked at 2.46pp in 2021Q2.

## FR

**Projet:** Tension transfrontaliere du marche du travail
**Donnees:** Enquete JOLTS du BLS via FRED (mensuelle, desaisonnalisee); emploi du CES via FRED (PAYEMS, USGOVT); tableau 14-10-0400-01 de Statistique Canada, Enquete sur les postes vacants et les salaires (trimestrielle, desaisonnalisee)
**Millesime:** Etats-Unis jusqu'en aout 2026, Canada jusqu'au T2 2026. Compile le 2026-10-10.
**Methodes:** normalisation, jointures temporelles, tables de correspondance, quarantaine (retrait du champ)

### Ce qui n'allait pas

Aucune des deux sources n'etait defectueuse. Le probleme etait la comparabilite, de quatre manieres:

1. **Frequences differentes.** Le JOLTS est mensuel; l'EVTP est trimestrielle. Un graphique brut compare un mois a un trimestre.
2. **Champs differents.** Le total americain publie inclut le secteur public (environ 731 000 ouvertures en aout 2026). La comparaison vise le marche du travail marchand, et les deux enquetes ne tracent pas la frontiere du secteur public au meme endroit.
3. **Derive de formule.** Les deux organismes definissent le taux de vacance comme ouvertures / (emploi + ouvertures) x 100, mais le taux americain publie integre l'emploi public. Moyenner des taux mensuels publies apres un changement de champ amplifierait l'erreur.
4. **Decoupages sectoriels incompatibles.** Le JOLTS publie "commerce, transport et services publics" comme une seule industrie; l'EVTP la divise en quatre secteurs. L'education et la sante du JOLTS couvrent le prive seulement; l'EVTP inclut le public.

### La correction

1. **Agregation trimestrielle.** Chaque trimestre JOLTS et CES est la moyenne de ses trois mois. L'EVTP n'a necessite aucune agregation.
2. **Retrait du champ.** Ouvertures americaines moins ouvertures du secteur public du JOLTS (JTS9000JOL); emploi americain moins emploi public du CES (USGOVT). Mis en quarantaine de tous les agregats harmonises.
3. **Recalcul du taux.** Le taux est recalcule a partir des niveaux trimestriels apres le retrait, jamais en moyennant des taux publies.
4. **Correspondance SCIAN.** Dix industries du JOLTS appariees aux secteurs de l'EVTP. Quand une industrie du JOLTS couvre plusieurs secteurs canadiens, le cote canadien est recompose en sommant d'abord les postes vacants et les employes, puis en recalculant le taux. Chaque appariement imparfait porte une note bilingue.

### Avant / apres

- Avant: "JOLTS aout 2026: 7 079 k ouvertures, 4,3 %" a cote de "EVTP T2 2026: 510 220 postes vacants, 2,8 %" (un mois contre un trimestre, secteur public inclus d'un seul cote)
- Apres: "T2 2026: E.-U. 4,67 % hors secteur public contre Canada 2,80 %, ecart de 1,87 point" (meme trimestre, meme formule, secteur public exclu)
- Avant: total americain publie T2 2026 de 4,47 % (secteur public inclus)
- Apres: serie americaine harmonisee T2 2026 de 4,67 % (secteur public exclu); le retrait du champ releve le taux americain de 0,2 point

### Resultat

44 trimestres (T1 2015 au T2 2026) sur definitions identiques, 436 lignes secteur-trimestre dans 10 paires SCIAN. Les Etats-Unis sont plus tendus pendant les 44 trimestres; l'ecart a culmine a 2,46 points au T2 2021.
