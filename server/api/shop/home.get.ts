import { cmsFetch } from "~/server/utils/cms";
import { defineCachedShopHandler } from "~/server/utils/cachedShopHandler";
import type { CmsExpansion, CmsProductList } from "~/types/shop";
import {
  DEALS_RARITY,
  HIGHLIGHTS_TAG,
  HIGHLIGHT_MAX_PRICE_CENTS,
  HIGHLIGHT_MIN_PRICE_CENTS,
  HIGHLIGHT_RECENT_SETS,
  SHOP_GAME,
} from "~/data/const";

/**
 * Le sezioni della home in una sola risposta.
 *
 * Il fan-out avviene lato server, così il client fa una chiamata sola e non
 * conosce né i criteri né la struttura del catalogo.
 */
const section = (event: any, query: Record<string, unknown>) =>
  cmsFetch<CmsProductList>(event, "/catalog/products", {
    query: { available: "true", perPage: 5, ...query, game: SHOP_GAME },
  }).catch(() => ({ items: [] }) as unknown as CmsProductList);

export default defineCachedShopHandler(
  async (event) => {
    // Le espansioni arrivano già ordinate dall'uscita più recente.
    const recent = await cmsFetch<{ items: CmsExpansion[] }>(
      event,
      "/catalog/expansions",
      { query: { minProducts: 10, game: SHOP_GAME } },
    ).catch(() => ({ items: [] as CmsExpansion[] }));

    const recentSlugs = recent.items
      .filter((expansion) => expansion.gameSlug === SHOP_GAME)
      .slice(0, HIGHLIGHT_RECENT_SETS)
      .map((expansion) => expansion.slug);

    const [tagged, fallbackHighlights, whatsNew, deals] = await Promise.all([
      // In evidenza: se ci sono prodotti marcati nel CMS, vincono loro.
      section(event, { tag: HIGHLIGHTS_TAG, hasImage: "true" }),
      // Altrimenti le carte di maggior valore fra i set usciti di recente. La
      // fascia di prezzo esclude i "prezzi di parcheggio" da migliaia di euro,
      // che su CardTrader segnalano un pezzo che il venditore non vuole vendere.
      section(event, {
        expansion: recentSlugs.join(","),
        hasImage: "true",
        hasHdImage: "true",
        singlesOnly: "true",
        sort: "price_desc",
        minPriceCents: HIGHLIGHT_MIN_PRICE_CENTS,
        maxPriceCents: HIGHLIGHT_MAX_PRICE_CENTS,
      }),
      // Novità: gli ultimi articoli entrati a magazzino. Solo con immagine ad
      // alta risoluzione verificata: in vetrina una scansione sgranata pesa più
      // di un prodotto in meno.
      section(event, { sort: "newest", hasImage: "true", hasHdImage: "true" }),
      // Offerte: le Illustration Rare al prezzo più basso.
      section(event, {
        rarity: DEALS_RARITY,
        sort: "price_asc",
        hasImage: "true",
      }),
    ]);

    return {
      // Una selezione curata batte sempre quella automatica.
      highlights: tagged.items.length ? tagged.items : fallbackHighlights.items,
      whatsNew: whatsNew.items,
      deals: deals.items,
    };
  },
  { maxAge: 120, name: "shop-home", getKey: () => "home" },
);
