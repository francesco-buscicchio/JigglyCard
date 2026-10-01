import { createError, readBody } from "h3";
import { cmsFetch } from "~/server/utils/cms";
import { getStripe } from "~/server/utils/stripe";

/**
 * Crea l'ordine nel CMS **dopo** che il pagamento è andato a buon fine.
 *
 * Prima della migrazione l'ordine veniva creato su Strapi prima di pagare e
 * marcato come pagato da un parametro in query letto dal browser: bastava
 * visitare l'URL per avere un ordine pagato. Qui il PaymentIntent viene
 * recuperato lato server da Stripe e si pretende `succeeded` e un importo
 * coerente con le righe.
 *
 * La creazione è idempotente sul PaymentIntent, quindi ricaricare la pagina di
 * conferma non genera un secondo ordine.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<any>(event);

  const paymentIntentId = String(body?.paymentIntentId ?? "").trim();
  if (!paymentIntentId) {
    throw createError({
      statusCode: 400,
      statusMessage: "PaymentIntent mancante",
    });
  }

  const stripe = getStripe(event);
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== "succeeded") {
    throw createError({
      statusCode: 402,
      statusMessage: `Pagamento non completato (${paymentIntent.status})`,
    });
  }

  const lines = Array.isArray(body?.lines) ? body.lines : [];
  const expectedAmount =
    lines.reduce(
      (sum: number, line: any) =>
        sum + Number(line.unitPriceCents ?? 0) * Number(line.quantity ?? 0),
      0,
    ) -
    Number(body?.discountCents ?? 0) +
    Number(body?.shippingMethod?.priceCents ?? 0);

  if (paymentIntent.amount_received !== expectedAmount) {
    throw createError({
      statusCode: 409,
      statusMessage:
        "L'importo pagato non corrisponde all'ordine: contattare l'assistenza",
    });
  }

  return cmsFetch(event, "/orders", {
    method: "POST",
    body: { ...body, paymentIntentId },
  });
});
