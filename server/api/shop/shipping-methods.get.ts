import { cmsFetch } from "~/server/utils/cms";
import type { CmsShippingMethod } from "~/types/shop";
import { defineCachedShopHandler } from "~/server/utils/cachedShopHandler";

export default defineCachedShopHandler(
  async (event) =>
    cmsFetch<{ items: CmsShippingMethod[] }>(event, "/shipping-methods"),
  { maxAge: 600, name: "shop-shipping-methods", getKey: () => "shipping" },
);
