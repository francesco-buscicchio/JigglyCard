import { getQuery } from "h3";
import { cmsFetch } from "~/server/utils/cms";
import type { CmsProductList } from "~/types/shop";
import { SHOP_GAME } from "~/data/const";

/**
 * Catalogo. Nessuna cache: la disponibilità cambia a ogni vendita, sul sito
 * come su CardTrader, e mostrare come disponibile un pezzo già venduto porta
 * l'utente a un 409 in fase di pagamento.
 */
export default defineEventHandler(async (event) => {
  // Il gioco non è un filtro a scelta del client: vale anche per la ricerca.
  const query = { ...getQuery(event), game: SHOP_GAME };

  return cmsFetch<CmsProductList>(event, "/catalog/products", { query });
});
