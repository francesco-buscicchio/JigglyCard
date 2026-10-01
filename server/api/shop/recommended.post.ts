import { readBody } from "h3";
import { cmsFetch } from "~/server/utils/cms";
import type { CmsProduct } from "~/types/shop";

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    seedSlugs?: string[];
    excludeSlugs?: string[];
    limit?: number;
  }>(event).catch(() => ({}) as Record<string, never>);

  return cmsFetch<{ items: CmsProduct[] }>(event, "/catalog/recommended", {
    method: "POST",
    body: {
      seedSlugs: body?.seedSlugs ?? [],
      excludeSlugs: body?.excludeSlugs ?? [],
      limit: body?.limit ?? 5,
    },
  });
});
