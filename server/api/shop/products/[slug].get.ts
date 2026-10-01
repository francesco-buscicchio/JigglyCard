import { createError, getRouterParam } from "h3";
import { cmsFetch } from "~/server/utils/cms";
import type { CmsProduct } from "~/types/shop";

export default defineEventHandler(async (event) => {
  const slug = String(getRouterParam(event, "slug") ?? "").trim();
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Slug mancante" });
  }

  return cmsFetch<CmsProduct>(
    event,
    `/catalog/products/${encodeURIComponent(slug)}`,
  );
});
