import { createError, getRouterParam } from "h3";
import { cmsFetch } from "~/server/utils/cms";
import type { CmsProduct } from "~/types/shop";
import { SHOP_GAME } from "~/data/const";

export default defineEventHandler(async (event) => {
  const slug = String(getRouterParam(event, "slug") ?? "").trim();
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Slug mancante" });
  }

  const product = await cmsFetch<CmsProduct>(
    event,
    `/catalog/products/${encodeURIComponent(slug)}`,
  );

  // Vecchi link a giochi non più in vendita: come se il prodotto non esistesse,
  // così non si può nemmeno metterlo nel carrello.
  if (product.gameSlug !== SHOP_GAME) {
    throw createError({ statusCode: 404, statusMessage: "Prodotto non trovato" });
  }

  return product;
});
