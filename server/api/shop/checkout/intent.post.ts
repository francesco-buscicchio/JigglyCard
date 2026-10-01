import { readBody, setResponseStatus } from "h3";
import { cmsFetchAllowingConflict } from "~/server/utils/cms";
import { getStripe } from "~/server/utils/stripe";
import type {
  CheckoutReservation,
  CheckoutReservationFailure,
} from "~/types/shop";

/**
 * Prenota la merce sul CMS e apre il pagamento.
 *
 * L'importo addebitato è quello calcolato dal CMS sui prezzi di catalogo, mai
 * quello inviato dal browser: manomettere il carrello in localStorage non
 * cambia quanto viene addebitato.
 *
 * Se il CMS risponde 409 la merce è appena stata venduta: si risponde 409 anche
 * al client, prima che l'utente paghi, così non c'è nessun rimborso da gestire.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<{
    lines?: { variantId: string; quantity: number }[];
    shippingMethodId?: string;
    couponCode?: string | null;
  }>(event);

  const reservation = await cmsFetchAllowingConflict<
    CheckoutReservation | CheckoutReservationFailure
  >(event, "/checkout/reserve", {
    method: "POST",
    body: {
      lines: body?.lines ?? [],
      shippingMethodId: body?.shippingMethodId,
      couponCode: body?.couponCode ?? null,
    },
  });

  if (reservation.status === 409 || !reservation.data.ok) {
    setResponseStatus(event, 409);
    return reservation.data;
  }

  const reserved = reservation.data as CheckoutReservation;
  const stripe = getStripe(event);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: reserved.totals.totalCents,
    currency: "eur",
    automatic_payment_methods: { enabled: true },
    metadata: { reservationId: reserved.reservationId },
  });

  return {
    ...reserved,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
});
