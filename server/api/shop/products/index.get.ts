import { getQuery } from "h3";
import { cmsFetch } from "~/server/utils/cms";
import type { CmsProductList } from "~/types/shop";

/**
 * Catalogo. Nessuna cache: la disponibilità cambia a ogni vendita, sul sito
 * come su CardTrader, e mostrare come disponibile un pezzo già venduto porta
 * l'utente a un 409 in fase di pagamento.
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  return cmsFetch<CmsProductList>(event, "/catalog/products", { query });
});
