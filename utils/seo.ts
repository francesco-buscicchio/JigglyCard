import { SELLER } from "~/data/const";

/**
 * Indirizzo pubblico del sito, senza barra finale. Canonical, og:url, JSON-LD
 * e sitemap lo usano sempre, anche sulle anteprime di deploy Netlify: così le
 * copie di prova rimandano al sito vero invece di fargli concorrenza.
 */
export const SITE_URL = SELLER.website.replace(/\/+$/, "");

export const SITE_NAME = "Jigglycard";

/** Titolo della home e delle pagine che non ne impostano uno. */
export const SITE_TITLE = "Jigglycard – Carte Pokémon singole e collezionabili";

export const SITE_DESCRIPTION =
  "Negozio online di carte Pokémon: carte singole, buste, box e prodotti sigillati, ordini spediti in 3 giorni lavorativi. Valutiamo anche la tua collezione.";

/**
 * Immagine di condivisione predefinita (1200×630). Sta in `public/` perché i
 * social la scaricano da un indirizzo fisso: quelle in `assets/` cambiano nome
 * a ogni build.
 */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

/** Le immagini del catalogo sono già assolute (CDN CardTrader); i percorsi locali no. */
export const absoluteUrl = (pathOrUrl: string) => {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
};

/**
 * Percorso canonico: senza barra finale, così `/chi-siamo/` e `/chi-siamo`
 * non risultano due pagine diverse.
 */
export const canonicalPath = (path: string) =>
  path.length > 1 ? path.replace(/\/+$/, "") : path;

/**
 * Le descrizioni oltre i ~160 caratteri vengono tagliate a metà parola nei
 * risultati di ricerca: meglio tagliarle prima, su uno spazio.
 */
export const truncateDescription = (text: string, max = 160) => {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:–-]+$/, "")}…`;
};
