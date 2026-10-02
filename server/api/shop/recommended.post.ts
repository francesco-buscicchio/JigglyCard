import { readBody } from "h3";
import { cmsFetch } from "~/server/utils/cms";
import type { CmsProduct } from "~/types/shop";
import { SHOP_GAME } from "~/data/const";

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    seedSlugs?: string[];
    excludeSlugs?: string[];
    limit?: number;
  }>(event).catch(() => ({}) as Record<string, never>);

  const recommended = await cmsFetch<{ items: CmsProduct[] }>(
    event,
    "/catalog/recommended",
    {
      method: "POST",
      body: {
        seedSlugs: body?.seedSlugs ?? [],
        excludeSlugs: body?.excludeSlugs ?? [],
        limit: body?.limit ?? 5,
      },
    },
  );

  return {
    items: recommended.items.filter((product) => product.gameSlug === SHOP_GAME),
  };
});
