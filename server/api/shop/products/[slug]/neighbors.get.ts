import { createError, getRouterParam } from "h3";
import { cmsFetch } from "~/server/utils/cms";
import { defineCachedShopHandler } from "~/server/utils/cachedShopHandler";
import type { CmsProduct, CmsProductList } from "~/types/shop";
import { SHOP_GAME } from "~/data/const";

type Neighbor = {
  slug: string;
  name: string;
  nameIt?: string;
  collectorNumber: string;
  image: string;
  priceCents: number;
  url: string;
};

/** Il CMS restituisce al massimo questo numero di prodotti per pagina. */
const PAGE_SIZE = 60;

const toNeighbor = (product: CmsProduct): Neighbor => ({
  slug: product.slug,
  name: product.name,
  nameIt: product.nameIt,
  collectorNumber: product.collectorNumber,
  image: product.images?.[0] ?? "",
  priceCents: product.minPriceCents,
  url: `/${product.gameSlug}/${product.categorySlug}/${product.slug}`,
});

/** Ordine "naturale": 9 < 10 < 011, e i prefissi (TG, GG, SV) restano insieme. */
const byCollectorNumber = (a: CmsProduct, b: CmsProduct) =>
  (a.collectorNumber ?? "").localeCompare(b.collectorNumber ?? "", undefined, {
    numeric: true,
    sensitivity: "base",
  }) || a.name.localeCompare(b.name);

/**
 * Carta precedente e successiva per numero di collezione, nello stesso set e
 * nella stessa categoria, fra quelle disponibili: dalla scheda prodotto si
 * scorre il set senza tornare al catalogo.
 *
 * Il CMS non ordina per numero di collezione, quindi si scaricano le carte
 * del set (poche pagine) e si ordinano qui.
 */
export default defineCachedShopHandler(
  async (event) => {
    const slug = String(getRouterParam(event, "slug") ?? "").trim();
    if (!slug) {
      throw createError({ statusCode: 400, statusMessage: "Slug mancante" });
    }

    const product = await cmsFetch<CmsProduct>(
      event,
      `/catalog/products/${encodeURIComponent(slug)}`,
    );
    if (product.gameSlug !== SHOP_GAME || !product.expansionSlug) {
      return { previous: null, next: null };
    }

    const page = (number: number) =>
      cmsFetch<CmsProductList>(event, "/catalog/products", {
        query: {
          game: SHOP_GAME,
          expansion: product.expansionSlug,
          category: product.categorySlug,
          available: "true",
          sort: "name_asc",
          perPage: PAGE_SIZE,
          page: number,
        },
      });

    const first = await page(1);
    const rest = await Promise.all(
      Array.from({ length: Math.max(0, first.totalPages - 1) }, (_, index) =>
        page(index + 2).then((result) => result.items),
      ),
    );

    const cards = [...first.items, ...rest.flat()]
      .filter((item) => item.collectorNumber)
      .sort(byCollectorNumber);

    // Se la carta aperta è esaurita non è nella lista: si cerca il posto che
    // avrebbe, così precedente e successiva restano quelle giuste.
    let index = cards.findIndex((item) => item.slug === slug);
    const inList = index !== -1;
    if (!inList) {
      index = cards.findIndex((item) => byCollectorNumber(product, item) < 0);
      if (index === -1) index = cards.length;
    }

    const previous = cards[index - 1];
    const next = cards[inList ? index + 1 : index];

    return {
      previous: previous ? toNeighbor(previous) : null,
      next: next ? toNeighbor(next) : null,
    };
  },
  {
    maxAge: 300,
    name: "shop-product-neighbors",
    getKey: (event) => String(getRouterParam(event, "slug") ?? ""),
  },
);
