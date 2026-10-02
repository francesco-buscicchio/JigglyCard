import { setResponseHeader, type EventHandler, type H3Event } from "h3";
import { cmsFetch } from "~/server/utils/cms";
import type { CmsMenu, CmsProductList } from "~/types/shop";
import { SHOP_GAME } from "~/data/const";
import { SITE_URL } from "~/utils/seo";

/** Il CMS restituisce al massimo questo numero di prodotti per pagina. */
export const CMS_PAGE_SIZE = 60;

/**
 * Pagine del CMS raccolte in ogni sitemap dei prodotti (5 × 60 = 300 schede).
 *
 * Una sola sitemap con tutto il catalogo non regge: ogni pagina del CMS
 * costa da mezzo secondo a un secondo (calcola anche le faccette) e con
 * ~8.000 prodotti servirebbero più di 100 richieste, oltre il limite di
 * durata delle funzioni Netlify. Divise così, ognuna resta di pochi secondi.
 */
export const CMS_PAGES_PER_SITEMAP = 5;

/** Pagine statiche da indicizzare. Carrello, checkout e landing sono noindex. */
export const STATIC_PATHS = [
  "/",
  "/chi-siamo",
  "/spedizioni",
  "/assistenza",
  "/valuta-la-tua-collezione",
  "/regolamento-vendita-collezione",
  "/pokedex",
  "/condizioni-di-vendita",
  "/privacy-policy",
  "/cookies",
];

const XML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

export const escapeXml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => XML_ESCAPES[char]);

export const absoluteLoc = (path: string) => escapeXml(`${SITE_URL}${path}`);

/*
 * Niente <lastmod>: il CMS non espone una data di modifica per prodotto
 * (`updatedAt` cambia a ogni sync anche senza modifiche), e Google ignora le
 * date inaffidabili. Meglio ometterle.
 */
export const urlset = (paths: string[]) =>
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map((path) => `  <url><loc>${absoluteLoc(path)}</loc></url>`),
    "</urlset>",
    "",
  ].join("\n");

export const sitemapIndex = (paths: string[]) =>
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map((path) => `  <sitemap><loc>${absoluteLoc(path)}</loc></sitemap>`),
    "</sitemapindex>",
    "",
  ].join("\n");

/**
 * Prodotti disponibili, una pagina del CMS alla volta. Ordine "newest": è
 * l'unico con uno spareggio univoco (blueprint), quindi le pagine non si
 * sovrappongono; con "relevance" le carte omonime potrebbero comparire in
 * due pagine e mancare in un'altra.
 */
export const fetchAvailableProducts = (event: H3Event, page: number, perPage = CMS_PAGE_SIZE) =>
  cmsFetch<CmsProductList>(event, "/catalog/products", {
    query: {
      game: SHOP_GAME,
      available: "true",
      sort: "newest",
      page,
      perPage,
    },
  });

/** Quante sitemap dei prodotti servono oggi. */
export async function countProductSitemaps(event: H3Event) {
  const { total } = await fetchAvailableProducts(event, 1, 1);
  const cmsPages = Math.ceil(total / CMS_PAGE_SIZE);
  return Math.ceil(cmsPages / CMS_PAGES_PER_SITEMAP);
}

export const productPath = (product: {
  gameSlug: string;
  categorySlug: string;
  slug: string;
}) =>
  `/${encodeURIComponent(product.gameSlug)}/${encodeURIComponent(product.categorySlug)}/${encodeURIComponent(product.slug)}`;

/** Catalogo completo, categorie e set: gli stessi indirizzi del menu del sito. */
export async function listingPaths(event: H3Event) {
  const menu = await cmsFetch<CmsMenu>(event, "/catalog/menu");
  const game = (menu.tree ?? []).find((item) => item.slug === SHOP_GAME);
  if (!game) return [];

  const paths = [`/${game.slug}/all`];
  for (const category of game.categories) {
    if (category.products <= 0) continue;
    const base = `/${game.slug}/${encodeURIComponent(category.slug)}`;
    paths.push(base);
    for (const expansion of category.expansions ?? []) {
      if (expansion.products > 0) {
        paths.push(`${base}?expansion=${encodeURIComponent(expansion.slug)}`);
      }
    }
  }
  return paths;
}

/**
 * Come `defineCachedEventHandler` (un'ora, poi la versione vecchia si serve
 * mentre se ne prepara una nuova), ma senza cache in sviluppo, come
 * `defineCachedShopHandler`. Diversamente da quello, qui la cache HTTP va
 * bene: una sitemap vecchia di un'ora non fa danni, e la CDN di Netlify
 * evita di rigenerarla a ogni visita dei crawler.
 */
export function defineSitemapHandler(
  handler: EventHandler<any, Promise<string>>,
  options: { name: string; getKey?: (event: H3Event) => string },
) {
  const withHeaders: EventHandler<any, Promise<string>> = async (event) => {
    const body = await handler(event);
    setResponseHeader(event, "content-type", "application/xml; charset=utf-8");
    return body;
  };

  if (import.meta.dev) return defineEventHandler(withHeaders);

  return defineCachedEventHandler(withHeaders, {
    maxAge: 60 * 60,
    name: options.name,
    getKey: options.getKey ?? (() => options.name),
  });
}
