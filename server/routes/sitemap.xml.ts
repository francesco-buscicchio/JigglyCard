import { countProductSitemaps, defineSitemapHandler, sitemapIndex } from "~/server/utils/sitemap";

/**
 * Indice delle sitemap (è l'indirizzo dichiarato in robots.txt): pagine
 * statiche e cataloghi in una, le schede prodotto divise in più parti, che
 * si generano ognuna per conto suo (vedi server/utils/sitemap.ts).
 */
export default defineSitemapHandler(
  async (event) => {
    const productSitemaps = await countProductSitemaps(event);
    return sitemapIndex([
      "/sitemaps/pages.xml",
      ...Array.from(
        { length: productSitemaps },
        (_, index) => `/sitemaps/products-${index + 1}.xml`,
      ),
    ]);
  },
  { name: "sitemap-index" },
);
