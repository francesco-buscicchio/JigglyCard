import { readBody } from "h3";
import { cmsFetch } from "~/server/utils/cms";
import type { CmsCouponValidation } from "~/types/shop";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ code?: string; cartTotalCents?: number }>(event);

  return cmsFetch<CmsCouponValidation>(event, "/coupons/validate", {
    method: "POST",
    body: {
      code: body?.code ?? "",
      cartTotalCents: Number(body?.cartTotalCents ?? 0),
    },
  });
});
