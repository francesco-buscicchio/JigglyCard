import { getQuery } from "h3";
import { cmsFetch } from "~/server/utils/cms";
import type { CmsExpansion } from "~/types/shop";
import { defineCachedShopHandler } from "~/server/utils/cachedShopHandler";
import { SHOP_GAME } from "~/data/const";

/**
 * Le espansioni cambiano solo dopo un sync del catalogo e non contengono
 * quantità, quindi si possono tenere in cache.
 */
export default defineCachedShopHandler(
  async (event) => {
    const { limit, minProducts } = getQuery(event);
    // Il limite si applica dopo aver tenuto solo il gioco in vendita: chiesto
    // al CMS, conterebbe anche i set degli altri giochi.
    const { items } = await cmsFetch<{ items: CmsExpansion[] }>(
      event,
      "/catalog/expansions",
      { query: { minProducts, game: SHOP_GAME } },
    );
    const own = items.filter((expansion) => expansion.gameSlug === SHOP_GAME);
    const max = Number(limit);
    return { items: max > 0 ? own.slice(0, max) : own };
  },
  {
    maxAge: 600,
    name: "shop-expansions",
    getKey: (event) =>
      `${getQuery(event).limit ?? "all"}-${getQuery(event).minProducts ?? 0}`,
  },
);
