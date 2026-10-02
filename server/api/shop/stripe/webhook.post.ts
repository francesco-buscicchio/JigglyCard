import { createError, getHeader, readRawBody, setResponseStatus } from "h3";
import type Stripe from "stripe";
import { cmsFetch } from "~/server/utils/cms";
import { getStripe } from "~/server/utils/stripe";
import { finalizePaidOrder } from "~/server/utils/orderFinalization";

/**
 * Webhook di Stripe (Stripe > Sviluppatori > Webhook, URL
 * https://www.jigglycard.com/api/shop/stripe/webhook).
 *
 * Garantisce l'ordine anche quando il cliente paga e chiude la scheda prima
 * di tornare sul sito, o quando l'incasso arriva giorni dopo (pagamenti
 * "in elaborazione"). Eventi gestiti:
 * - payment_intent.succeeded: crea l'ordine e manda l'email di conferma;
 * - payment_intent.canceled: rimette subito in vendita la merce prenotata.
 *
 * La firma si verifica sul corpo grezzo con NUXT_STRIPE_WEBHOOK_SECRET; senza
 * il segreto la rotta risponde 503 e Stripe ritenta più tardi.
 */
export default defineEventHandler(async (event) => {
  const secret = String(useRuntimeConfig(event).STRIPE_WEBHOOK_SECRET ?? "");
  if (!secret) {
    throw createError({ statusCode: 503, statusMessage: "Webhook Stripe non configurato" });
  }

  const signature = getHeader(event, "stripe-signature") ?? "";
  const payload = (await readRawBody(event, false)) ?? Buffer.alloc(0);
  const stripe = getStripe(event);

  let stripeEvent: Stripe.Event;
  try {
    stripeEvent = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    throw createError({ statusCode: 400, statusMessage: "Firma del webhook non valida" });
  }

  if (stripeEvent.type === "payment_intent.succeeded") {
    // Si rilegge il PaymentIntent: i metadati (email già inviata) possono
    // essere cambiati dopo l'evento.
    const paymentIntent = await stripe.paymentIntents.retrieve(
      (stripeEvent.data.object as Stripe.PaymentIntent).id,
    );
    const { result, emailError } = await finalizePaidOrder(event, paymentIntent);

    if (emailError) {
      // Risposta d'errore: Stripe ripete l'evento e l'email riparte.
      setResponseStatus(event, 500);
      return { received: true, orderNumber: result.orderNumber, email: "failed" };
    }
    return { received: true, orderNumber: result.orderNumber };
  }

  if (stripeEvent.type === "payment_intent.canceled") {
    const reservationId = (stripeEvent.data.object as Stripe.PaymentIntent).metadata
      ?.reservationId;
    if (reservationId) {
      await cmsFetch(event, "/checkout/release", {
        method: "POST",
        body: { reservationId },
      });
    }
  }

  return { received: true };
});
