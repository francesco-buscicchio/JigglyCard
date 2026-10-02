import { createError, type H3Event } from "h3";
import type Stripe from "stripe";
import { cmsFetch } from "~/server/utils/cms";
import { getStripe } from "~/server/utils/stripe";
import { sendShopMail } from "~/server/utils/mailer";
import { renderOrderConfirmationEmail } from "~/server/utils/orderEmail";

/** Risposta del CMS alla creazione dell'ordine (POST /api/storefront/orders). */
export type CmsOrderResult = {
  ok: boolean;
  existing: boolean;
  orderId: string;
  orderNumber: string;
  stockConflict: boolean;
  /** Vero solo per il chiamante a cui il CMS ha assegnato l'invio dell'email. */
  sendConfirmationEmail: boolean;
  order: {
    createdAt: string;
    customer: { name: string; surname: string; email: string; phone: string };
    address: {
      street: string;
      city: string;
      zip: string;
      province: string;
      country: string;
    };
    invoice: Record<string, string> | null;
    shippingMethod: { id: string | null; name: string; priceCents: number };
    lines: Array<{
      name: string;
      quantity: number;
      unitPriceCents: number;
      imageUrl?: string;
      language?: string;
      condition?: string;
    }>;
    coupon: { code: string; discountCents: number } | null;
    totals: { totalCents: number; discountCents: number };
  };
};

/**
 * Chiude l'ordine di un pagamento riuscito: lo crea sul CMS e, una sola volta,
 * manda l'email di conferma al cliente (in copia nascosta al negozio).
 *
 * La chiamano sia la pagina di ritorno da Stripe sia il webhook
 * `payment_intent.succeeded`, spesso insieme. Il CMS è idempotente sul
 * PaymentIntent e assegna l'invio dell'email a uno solo dei due.
 *
 * L'ordine nasce dalla prenotazione indicata nei metadati del PaymentIntent,
 * scritta dal server al checkout: niente di quello che arriva dal browser
 * finisce nell'ordine.
 */
export async function finalizePaidOrder(
  event: H3Event,
  paymentIntent: Stripe.PaymentIntent,
) {
  if (paymentIntent.status !== "succeeded") {
    throw createError({
      statusCode: 402,
      statusMessage: `Pagamento non completato (${paymentIntent.status})`,
    });
  }

  const reservationId = String(paymentIntent.metadata?.reservationId ?? "").trim();
  if (!reservationId) {
    throw createError({
      statusCode: 409,
      statusMessage: "Pagamento senza prenotazione: contattare l'assistenza",
    });
  }

  const emailAlreadySent = paymentIntent.metadata?.confirmationEmailSent === "1";
  const result = await cmsFetch<CmsOrderResult>(event, "/orders", {
    method: "POST",
    body: {
      paymentIntentId: paymentIntent.id,
      reservationId,
      amountReceivedCents: paymentIntent.amount_received,
      claimConfirmationEmail: !emailAlreadySent,
    },
  });

  let emailError: unknown = null;
  if (result.sendConfirmationEmail) {
    try {
      const { order } = result;
      const message = renderOrderConfirmationEmail({
        orderNumber: result.orderNumber || paymentIntent.id,
        createdAt: new Date(paymentIntent.created * 1000),
        customer: order.customer,
        address: order.address,
        shippingMethod: order.shippingMethod,
        lines: order.lines,
        couponCode: order.coupon?.code ?? null,
        discountCents: order.totals.discountCents,
        totalCents: paymentIntent.amount_received,
      });
      const shopMail = String(useRuntimeConfig(event).public.ADMIN_MAIL ?? "");
      await sendShopMail(event, {
        to: order.customer.email,
        bcc: shopMail || undefined,
        replyTo: shopMail || undefined,
        ...message,
      });
      await getStripe(event).paymentIntents.update(paymentIntent.id, {
        metadata: {
          confirmationEmailSent: "1",
          orderNumber: result.orderNumber ?? "",
        },
      });
    } catch (error) {
      // L'ordine c'è e il cliente ha pagato: un invio fallito non lo annulla.
      // Il webhook risponde errore così Stripe lo ripete, e dopo qualche
      // minuto il CMS riassegna l'invio.
      emailError = error;
      console.error("Email di conferma ordine non inviata", paymentIntent.id, error);
    }
  }

  return { result, emailError };
}
