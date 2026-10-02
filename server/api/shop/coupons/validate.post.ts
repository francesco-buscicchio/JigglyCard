import { readBody } from "h3";
import { cmsFetch } from "~/server/utils/cms";
import { assertRateLimit } from "~/server/utils/rateLimit";
import type { CmsCouponValidation } from "~/types/shop";

export default defineEventHandler(async (event) => {
  // Senza limite i codici si potrebbero indovinare a forza di tentativi.
  assertRateLimit(event, "coupon", {
    max: 20,
    windowMs: 10 * 60 * 1000,
    message: "Troppi tentativi, riprova fra qualche minuto",
  });

  const body = await readBody<{ code?: string; cartTotalCents?: number }>(event);

  return cmsFetch<CmsCouponValidation>(event, "/coupons/validate", {
    method: "POST",
    body: {
      code: body?.code ?? "",
      cartTotalCents: Number(body?.cartTotalCents ?? 0),
    },
  });
});
