import { getQuery } from "h3";
import { cmsFetch } from "~/server/utils/cms";
import type { CmsExpansion } from "~/types/shop";
import { defineCachedShopHandler } from "~/server/utils/cachedShopHandler";

/**
 * Le espansioni cambiano solo dopo un sync del catalogo e non contengono
 * quantità, quindi si possono tenere in cache.
 */
export default defineCachedShopHandler(
  async (event) =>
    cmsFetch<{ items: CmsExpansion[] }>(event, "/catalog/expansions", {
      query: {
        limit: getQuery(event).limit,
        minProducts: getQuery(event).minProducts,
      },
    }),
  {
    maxAge: 600,
    name: "shop-expansions",
    getKey: (event) =>
      `${getQuery(event).limit ?? "all"}-${getQuery(event).minProducts ?? 0}`,
  },
);
