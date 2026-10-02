import { createError, getRouterParam } from "h3";
import {
  CMS_PAGES_PER_SITEMAP,
  STATIC_PATHS,
  defineSitemapHandler,
  fetchAvailableProducts,
  listingPaths,
  productPath,
  urlset,
} from "~/server/utils/sitemap";

/**
 * Parti della sitemap elencate in /sitemap.xml:
 * - `pages.xml`: pagine statiche, catalogo completo, categorie e set;
 * - `products-N.xml`: le schede dei prodotti disponibili, a blocchi di
 *   CMS_PAGES_PER_SITEMAP pagine del CMS.
 */
export default defineSitemapHandler(
  async (event) => {
    const name = String(getRouterParam(event, "name") ?? "");

    if (name === "pages.xml") {
      return urlset([...STATIC_PATHS, ...(await listingPaths(event))]);
    }

    const chunk = Number(name.match(/^products-(\d+)\.xml$/)?.[1] ?? 0);
    if (!chunk) {
      throw createError({ statusCode: 404, statusMessage: "Sitemap non trovata" });
    }

    // La prima pagina del blocco dice quante ce ne sono: un blocco oltre la
    // fine (indirizzo inventato o indice vecchio) è un 404, senza altre
    // richieste al CMS.
    const firstPage = (chunk - 1) * CMS_PAGES_PER_SITEMAP + 1;
    const first = await fetchAvailableProducts(event, firstPage);
    if (firstPage > first.totalPages) {
      throw createError({ statusCode: 404, statusMessage: "Sitemap non trovata" });
    }

    // Le altre pagine del blocco partono insieme: in fila la sitemap
    // impiegherebbe la somma dei tempi del CMS.
    const lastPage = Math.min(first.totalPages, firstPage + CMS_PAGES_PER_SITEMAP - 1);
    const rest = await Promise.all(
      Array.from({ length: lastPage - firstPage }, (_, index) =>
        fetchAvailableProducts(event, firstPage + index + 1),
      ),
    );

    const products = [first, ...rest].flatMap((result) => result.items);
    return urlset([...new Set(products.map(productPath))]);
  },
  {
    name: "sitemap-part",
    getKey: (event) => String(getRouterParam(event, "name") ?? ""),
  },
);
