"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "en" | "fr";

const en = {
  siteName: "Cross-Border Labour Tightness",
  nav: {
    explorer: "Explorer",
    showcase: "Showcase",
    methodology: "Methodology",
    data: "Data",
    back: "Open Nshipyard",
    allProjects: "← All projects",
    menu: "Menu",
    langLabel: "FR",
  },
  home: {
    kicker: "An Open Nshipyard project",
    title: "Which side of the border has the tighter labour market?",
    lede:
      "The United States and Canada both publish job vacancy rates, but the raw numbers are not comparable. We put 44 quarters onto identical definitions. The answer is the United States, in every quarter since 2015.",
    explore: "Explore the data",
    method: "Read the methodology",
    chartTitle: "The vacancy rate on identical definitions, 2015 to 2026",
    chartSub:
      "US series excludes government (see methodology). Canada is the published JVWS total. Seasonally adjusted, quarterly.",
    stats: [
      { value: "1.87", label: "percentage points: the US lead in 2026Q2, 4.67% against 2.80%" },
      { value: "44/44", label: "quarters the US has been tighter, from 2015Q1 to 2026Q2" },
      { value: "2.46", label: "percentage points: the widest gap, in 2021Q2" },
      { value: "10", label: "sector pairs compared on identical NAICS definitions" },
    ],
    whatTitle: "What this project does",
    whatBody:
      "BLS JOLTS and the StatCan Job Vacancy and Wage Survey measure the same thing with different scopes, different timing, and different industry cuts. This project aggregates JOLTS to quarterly, removes the US public sector, recomputes the rate with the shared formula, and crosswalks JOLTS industries to NAICS sectors. The result is one downloadable series anyone can cite.",
    showcaseTeaser: "Three findings, each quotable",
    dataTeaser: "Download the harmonized series",
  },
  explorer: {
    title: "Explorer",
    lede: "Filter the harmonized series by sector, quarter, and country.",
    sector: "Sector",
    quarter: "Quarter",
    allQuarters: "All quarters",
    allSectors: "Headline (all sectors)",
    colQuarter: "Quarter",
    colUs: "US rate",
    colCa: "Canada rate",
    colGap: "Gap (US minus Canada)",
    colTighter: "Tighter",
    us: "US",
    canada: "Canada",
    tie: "Tie",
    unitNote: "Rates in percent. Gap in percentage points.",
    sectorNote: "Sector notes document every imperfect match.",
  },
  showcase: {
    title: "Showcase",
    lede: "Three findings from the harmonized series. Each one carries its numbers, its chart, and a citation you can copy.",
    cite: "Cite this",
    copied: "Copied",
    findings: [
      {
        q: "Which side of the border has the tighter labour market?",
        a: "The United States, in every quarter since 2015. In 2026Q2 the harmonized US vacancy rate is 4.67% against Canada's 2.80%, a gap of 1.87 percentage points. The gap peaked at 2.46 points in 2021Q2, during the US hiring surge.",
        cite:
          "Richardson Dackam, Cross-Border Labour Tightness (Open Nshipyard), harmonized US-Canada vacancy rates 2015Q1-2026Q2. US: BLS JOLTS via FRED, government excluded, quarterly. Canada: StatCan table 14-10-0400-01.",
      },
      {
        q: "Which industries are the tightest on each side?",
        a: "In 2026Q2 the US leads in all 10 comparable sectors. The widest gaps are education and health services (US 5.37% vs Canada 2.73%), arts, entertainment and recreation (5.07% vs 2.53%), and mining and oil and gas (4.67% vs 2.28%).",
        cite:
          "Richardson Dackam, Cross-Border Labour Tightness (Open Nshipyard), sector pairs on identical NAICS definitions, 2026Q2. US: BLS JOLTS via FRED. Canada: StatCan table 14-10-0400-01.",
      },
      {
        q: "Where is the race closest?",
        a: "Construction: US 3.33% vs Canada 3.00% in 2026Q2, a gap of 0.33 points. Construction is also the one sector where Canada has repeatedly led: Canadian construction was tighter than US construction in every year from 2020 to 2026, peaking at 7.09% against 5.1% in 2022. Accommodation and food services is tight on both sides of the border (US 4.80%, Canada 4.39%), the highest Canadian sector rate in the comparison.",
        cite:
          "Richardson Dackam, Cross-Border Labour Tightness (Open Nshipyard), sector pairs on identical NAICS definitions, 2026Q2. US: BLS JOLTS via FRED. Canada: StatCan table 14-10-0400-01.",
      },
    ],
  },
  methodology: {
    title: "Methodology",
    lede: "Every rule that turns two national surveys into one comparable series.",
    rulesTitle: "The five harmonization rules",
    rules: [
      {
        t: "Quarterly aggregation",
        d: "JOLTS and the CES employment series are monthly. Each quarter is the mean of its three months. JVWS is already quarterly, so no aggregation is needed on the Canadian side.",
      },
      {
        t: "Scope cut",
        d: "The US series drops government openings (JOLTS series JTS9000JOL) and government employment (CES series USGOVT). The published US total includes them; the harmonized series does not, because the comparison targets the business labour market on both sides.",
      },
      {
        t: "Identical rate formula",
        d: "Vacancy rate equals openings divided by employment plus openings, times 100. Both agencies publish this formula. We recompute it from the quarterly levels after the scope cut instead of averaging published rates.",
      },
      {
        t: "NAICS crosswalk",
        d: "JOLTS industries map to JVWS NAICS sectors. Where one JOLTS industry spans several JVWS sectors, the Canadian side is composited by summing vacancies and payroll employees first, then recomputing the rate. Ten pairs survive the crosswalk.",
      },
      {
        t: "Seasonal adjustment kept",
        d: "Both series are used seasonally adjusted as published. No additional seasonal model is applied.",
      },
    ],
    refTitle: "The reference recipe",
    refBody:
      "The scope recipe follows Bauer, K. (2015), Comparison of U.S. and international labor turnover statistics, Monthly Labor Review, doi:10.21916/mlr.2015.26, which documents the definitional deltas between JOLTS and peer surveys including Canada's JVWS.",
    limitsTitle: "Honest limits",
    limits: [
      "The BLS comparison article could not be fetched from this build environment, so the recipe was implemented from the published survey definitions on both sides. Check it against Bauer (2015) before citing the recipe itself.",
      "Canada's published total includes public administration; the US harmonized series excludes government. Public administration ran at a 2.0% vacancy rate in Canada in 2026Q2, so the residual scope gap is small but nonzero.",
      "JVWS includes agriculture, forestry, fishing and hunting. JOLTS covers nonfarm establishments only. Agriculture is roughly 2% of Canadian vacancies.",
      "JOLTS counts openings on the last business day of the month. JVWS counts vacancies on the first day of the month. Both are point-in-time stocks, one month apart in reference timing.",
      "The sector chart covers the JOLTS industries available as FRED series. Wholesale trade, transportation and warehousing, information, finance and insurance, professional services, and other services have no FRED JOLTS series, so those Canadian sectors have no US counterpart here.",
      "The US education and health series cover the private sector only. Canada's include public schools and hospitals, which narrows the measured gap in that pair.",
      "2026Q3 is excluded because the quarter is incomplete in both sources.",
      "2020Q2 and 2020Q3 are absent from the series: StatCan suspended JVWS collection during the first COVID wave, so no Canadian observation exists for those quarters.",
    ],
    fixTitle: "What was wrong with the raw data",
    fixBody:
      "Nothing was broken in either source. The problem was comparability: monthly versus quarterly, all-nonfarm-including-government versus all-industries, industry cuts that do not line up. The data-fixes entry for this project records the before and after of each harmonization step.",
  },
  dataPage: {
    title: "Data",
    lede: "Every number on this site, downloadable. Vintage: US data through August 2026, Canada through 2026Q2. Built 2026-10-10.",
    downloads: "Downloads",
    dlHarmonized: "Harmonized quarterly series (CSV)",
    dlSectors: "Sector pairs, quarterly (CSV)",
    apiTitle: "API",
    apiBody: "REST endpoints with JSON responses, plus an OpenAPI 3.1 document and an MCP server for agents.",
    endpoints: [
      { m: "GET", p: "/api/v1/tightness", d: "Harmonized quarterly series. Optional query: quarter=2026Q2." },
      { m: "GET", p: "/api/v1/sectors", d: "Sector pairs. Optional query: quarter=2026Q2, pair=JTS2300." },
      { m: "GET", p: "/api/v1/quarters", d: "Quarter coverage and latest values." },
      { m: "GET", p: "/api/openapi.json", d: "OpenAPI 3.1 document." },
      { m: "POST", p: "/mcp", d: "MCP server (Streamable HTTP): tightness_lookup, sector_ranking, trend." },
    ],
  },
  footer: {
    honestyKicker: "An independent project",
    honesty:
      "Not affiliated with the U.S. Bureau of Labor Statistics, Statistics Canada, FRED, or any government.",
    author: "Built by Richardson Dackam",
    sources: "Sources: BLS JOLTS via FRED, StatCan table 14-10-0400-01.",
  },
  mcp: {
    title: "Connect your agent",
    body: "Point any MCP-capable agent at this project's MCP server. Three tools: tightness_lookup, sector_ranking, trend.",
    tabs: ["ChatGPT", "Claude", "CLI", "Other"],
  },
  charts: {
    usLabel: "United States",
    caLabel: "Canada",
    gapLabel: "US minus Canada, pp",
    yAxis: "Vacancy rate (%)",
  },
};

export type Dict = typeof en;

const fr: Dict = {
  siteName: "Tension transfrontaliere du marche du travail",
  nav: {
    explorer: "Explorateur",
    showcase: "Vitrine",
    methodology: "Methodologie",
    data: "Donnees",
    back: "Open Nshipyard",
    allProjects: "← Tous les projets",
    menu: "Menu",
    langLabel: "EN",
  },
  home: {
    kicker: "Un projet Open Nshipyard",
    title: "De quel cote de la frontiere le marche du travail est-il le plus tendu?",
    lede:
      "Les Etats-Unis et le Canada publient tous deux des taux de postes vacants, mais les chiffres bruts ne sont pas comparables. Nous avons harmonise 44 trimestres sur des definitions identiques. La reponse: les Etats-Unis, a chaque trimestre depuis 2015.",
    explore: "Explorer les donnees",
    method: "Lire la methodologie",
    chartTitle: "Le taux de vacance sur definitions identiques, 2015 a 2026",
    chartSub:
      "La serie americaine exclut le secteur public (voir methodologie). Le Canada est le total publie de l'EVTP. Donnees desaisonnalisees, trimestrielles.",
    stats: [
      { value: "1,87", label: "point de pourcentage: l'avance americaine au T2 2026, 4,67 % contre 2,80 %" },
      { value: "44/44", label: "trimestres ou les Etats-Unis sont plus tendus, du T1 2015 au T2 2026" },
      { value: "2,46", label: "points de pourcentage: l'ecart maximal, au T2 2021" },
      { value: "10", label: "paires de secteurs comparees sur definitions SCIAN identiques" },
    ],
    whatTitle: "Ce que fait ce projet",
    whatBody:
      "Le JOLTS du BLS et l'Enquete sur les postes vacants et les salaires de Statistique Canada mesurent la meme chose avec des champs differents, des calendriers differents et des decoupages sectoriels differents. Ce projet agrege le JOLTS au trimestre, retire le secteur public americain, recalcule le taux avec la formule commune et apparie les industries du JOLTS aux secteurs du SCIAN. Le resultat est une serie telechargeable que chacun peut citer.",
    showcaseTeaser: "Trois constats, chacun citable",
    dataTeaser: "Telecharger la serie harmonisee",
  },
  explorer: {
    title: "Explorateur",
    lede: "Filtrez la serie harmonisee par secteur, trimestre et pays.",
    sector: "Secteur",
    quarter: "Trimestre",
    allQuarters: "Tous les trimestres",
    allSectors: "Serie principale (tous secteurs)",
    colQuarter: "Trimestre",
    colUs: "Taux americain",
    colCa: "Taux canadien",
    colGap: "Ecart (E.-U. moins Canada)",
    colTighter: "Plus tendu",
    us: "E.-U.",
    canada: "Canada",
    tie: "Egalite",
    unitNote: "Taux en pourcentage. Ecart en points de pourcentage.",
    sectorNote: "Les notes de secteur documentent chaque appariement imparfait.",
  },
  showcase: {
    title: "Vitrine",
    lede: "Trois constats tires de la serie harmonisee. Chacun porte ses chiffres, son graphique et une citation a copier.",
    cite: "Citer",
    copied: "Copie",
    findings: [
      {
        q: "De quel cote de la frontiere le marche du travail est-il le plus tendu?",
        a: "Les Etats-Unis, a chaque trimestre depuis 2015. Au T2 2026, le taux de vacance americain harmonise est de 4,67 % contre 2,80 % au Canada, soit un ecart de 1,87 point de pourcentage. L'ecart a culmine a 2,46 points au T2 2021, pendant la vague d'embauches americaine.",
        cite:
          "Richardson Dackam, Tension transfrontaliere du marche du travail (Open Nshipyard), taux de vacance harmonises E.-U.-Canada 2015T1-2026T2. E.-U.: JOLTS du BLS via FRED, secteur public exclu, trimestriel. Canada: Statistique Canada, tableau 14-10-0400-01.",
      },
      {
        q: "Quelles industries sont les plus tendues de chaque cote?",
        a: "Au T2 2026, les Etats-Unis menent dans les 10 secteurs comparables. Les ecarts les plus larges: education et sante (5,37 % aux E.-U. contre 2,73 % au Canada), arts, spectacles et loisirs (5,07 % contre 2,53 %), et mines, petrole et gaz (4,67 % contre 2,28 %).",
        cite:
          "Richardson Dackam, Tension transfrontaliere du marche du travail (Open Nshipyard), paires de secteurs sur definitions SCIAN identiques, T2 2026. E.-U.: JOLTS du BLS via FRED. Canada: Statistique Canada, tableau 14-10-0400-01.",
      },
      {
        q: "Ou la course est-elle la plus serree?",
        a: "La construction: 3,33 % aux E.-U. contre 3,00 % au Canada au T2 2026, un ecart de 0,33 point. La construction est aussi le seul secteur ou le Canada a mene a plusieurs reprises: la construction canadienne etait plus tendue que l'americaine chaque annee de 2020 a 2026, avec un sommet de 7,09 % contre 5,1 % en 2022. L'hebergement et la restauration sont tendus des deux cotes de la frontiere (4,80 % aux E.-U., 4,39 % au Canada), le taux canadien le plus eleve de la comparaison.",
        cite:
          "Richardson Dackam, Tension transfrontaliere du marche du travail (Open Nshipyard), paires de secteurs sur definitions SCIAN identiques, T2 2026. E.-U.: JOLTS du BLS via FRED. Canada: Statistique Canada, tableau 14-10-0400-01.",
      },
    ],
  },
  methodology: {
    title: "Methodologie",
    lede: "Chaque regle qui transforme deux enquetes nationales en une serie comparable.",
    rulesTitle: "Les cinq regles d'harmonisation",
    rules: [
      {
        t: "Agregation trimestrielle",
        d: "Le JOLTS et l'emploi du CES sont mensuels. Chaque trimestre est la moyenne de ses trois mois. L'EVTP est deja trimestrielle, donc aucune agregation cote canadien.",
      },
      {
        t: "Retrait du secteur public",
        d: "La serie americaine retire les ouvertures de postes du secteur public (serie JOLTS JTS9000JOL) et l'emploi public (serie CES USGOVT). Le total americain publie les inclut; la serie harmonisee ne les inclut pas, car la comparaison vise le marche du travail marchand des deux cotes.",
      },
      {
        t: "Formule de taux identique",
        d: "Le taux de vacance egale les ouvertures divisees par l'emploi plus les ouvertures, fois 100. Les deux organismes publient cette formule. Nous la recalculons a partir des niveaux trimestriels apres le retrait du secteur public, au lieu de moyenner des taux publies.",
      },
      {
        t: "Correspondance SCIAN",
        d: "Les industries du JOLTS sont appariees aux secteurs SCIAN de l'EVTP. Quand une industrie du JOLTS couvre plusieurs secteurs canadiens, le cote canadien est recompose en sommant d'abord les postes vacants et les employes, puis en recalculant le taux. Dix paires survivent a l'appariement.",
      },
      {
        t: "Desaisonnalisation conservee",
        d: "Les deux series sont utilisees desaisonnalisees telles que publiees. Aucun modele saisonnier supplementaire n'est applique.",
      },
    ],
    refTitle: "La recette de reference",
    refBody:
      "La recette de champ suit Bauer, K. (2015), Comparison of U.S. and international labor turnover statistics, Monthly Labor Review, doi:10.21916/mlr.2015.26, qui documente les ecarts de definition entre le JOLTS et les enquetes homologues, dont l'EVTP canadienne.",
    limitsTitle: "Limites honnetes",
    limits: [
      "L'article de comparaison du BLS n'a pas pu etre recupere depuis cet environnement de compilation, donc la recette a ete appliquee a partir des definitions d'enquete publiees des deux cotes. Verifiez-la dans Bauer (2015) avant de citer la recette elle-meme.",
      "Le total canadien publie inclut l'administration publique; la serie americaine harmonisee exclut le secteur public. L'administration publique affichait un taux de vacance de 2,0 % au Canada au T2 2026, donc l'ecart de champ residuel est faible mais non nul.",
      "L'EVTP inclut l'agriculture, la foresterie, la peche et la chasse. Le JOLTS couvre seulement les etablissements non agricoles. L'agriculture represente environ 2 % des postes vacants canadiens.",
      "Le JOLTS compte les ouvertures le dernier jour ouvrable du mois. L'EVTP compte les postes vacants le premier jour du mois. Les deux sont des stocks a date fixe, decales d'un mois dans le calendrier de reference.",
      "Le graphique sectoriel couvre les industries du JOLTS disponibles comme series FRED. Le commerce de gros, le transport et l'entreposage, l'information, la finance et l'assurance, les services professionnels et les autres services n'ont pas de serie JOLTS sur FRED, donc ces secteurs canadiens n'ont pas de contrepartie americaine ici.",
      "Les series americaines d'education et de sante couvrent le secteur prive seulement. Celles du Canada incluent les ecoles et hopitaux publics, ce qui reduit l'ecart mesure pour cette paire.",
      "Le T3 2026 est exclu car le trimestre est incomplet dans les deux sources.",
      "Les T2 et T3 2020 sont absents de la serie: Statistique Canada a suspendu la collecte de l'EVTP pendant la premiere vague de COVID, donc aucune observation canadienne n'existe pour ces trimestres.",
    ],
    fixTitle: "Ce qui n'allait pas dans les donnees brutes",
    fixBody:
      "Aucune des deux sources n'etait defectueuse. Le probleme etait la comparabilite: mensuel contre trimestriel, tout le non-agricole secteur public inclus contre toutes les industries, des decoupages sectoriels qui ne s'alignent pas. La fiche du journal des corrections documente l'avant et l'apres de chaque etape d'harmonisation.",
  },
  dataPage: {
    title: "Donnees",
    lede: "Chaque chiffre de ce site, telechargeable. Millesime: donnees americaines jusqu'en aout 2026, Canada jusqu'au T2 2026. Compile le 2026-10-10.",
    downloads: "Telechargements",
    dlHarmonized: "Serie trimestrielle harmonisee (CSV)",
    dlSectors: "Paires de secteurs, trimestriel (CSV)",
    apiTitle: "API",
    apiBody: "Des points d'acces REST avec reponses JSON, un document OpenAPI 3.1 et un serveur MCP pour les agents.",
    endpoints: [
      { m: "GET", p: "/api/v1/tightness", d: "Serie trimestrielle harmonisee. Parametre optionnel: quarter=2026Q2." },
      { m: "GET", p: "/api/v1/sectors", d: "Paires de secteurs. Parametres optionnels: quarter=2026Q2, pair=JTS2300." },
      { m: "GET", p: "/api/v1/quarters", d: "Couverture des trimestres et dernieres valeurs." },
      { m: "GET", p: "/api/openapi.json", d: "Document OpenAPI 3.1." },
      { m: "POST", p: "/mcp", d: "Serveur MCP (HTTP diffusable): tightness_lookup, sector_ranking, trend." },
    ],
  },
  footer: {
    honestyKicker: "Un projet independant",
    honesty:
      "Sans affiliation avec le Bureau of Labor Statistics des Etats-Unis, Statistique Canada, FRED ni aucun gouvernement.",
    author: "Concu par Richardson Dackam",
    sources: "Sources: JOLTS du BLS via FRED, tableau 14-10-0400-01 de Statistique Canada.",
  },
  mcp: {
    title: "Connectez votre agent",
    body: "Pointez tout agent compatible MCP vers le serveur MCP de ce projet. Trois outils: tightness_lookup, sector_ranking, trend.",
    tabs: ["ChatGPT", "Claude", "CLI", "Autre"],
  },
  charts: {
    usLabel: "Etats-Unis",
    caLabel: "Canada",
    gapLabel: "E.-U. moins Canada, pp",
    yAxis: "Taux de vacance (%)",
  },
};

const dicts: Record<Lang, Dict> = { en, fr };

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({
  lang: "en",
  setLang: () => {},
  t: en,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem("clt-lang");
    return saved === "fr" || saved === "en" ? saved : "en";
  });
  const apply = (l: Lang) => {
    setLang(l);
    window.localStorage.setItem("clt-lang", l);
    document.documentElement.lang = l === "fr" ? "fr" : "en";
  };
  return <LangCtx.Provider value={{ lang, setLang: apply, t: dicts[lang] }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  return useContext(LangCtx);
}

export function fmtNum(n: number, lang: Lang, digits = 2) {
  return n.toLocaleString(lang === "fr" ? "fr-CA" : "en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
