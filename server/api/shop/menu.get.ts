import { cmsFetch } from "~/server/utils/cms";
import type { CmsMenu } from "~/types/shop";
import { defineCachedShopHandler } from "~/server/utils/cachedShopHandler";

/**
 * L'albero di navigazione cambia solo dopo un sync del catalogo: si può
 * tenere in cache per qualche minuto senza rischiare di mostrare stock stantio,
 * perché qui non ci sono quantità.
 */
export default defineCachedShopHandler(
  async (event) => cmsFetch<CmsMenu>(event, "/catalog/menu"),
  { maxAge: 600, name: "shop-menu", getKey: () => "menu" },
);
