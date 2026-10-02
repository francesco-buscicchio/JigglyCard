import { createError, readBody, setResponseStatus, type H3Event } from "h3";
import { cmsFetch, cmsFetchAllowingConflict } from "~/server/utils/cms";
import { getStripe } from "~/server/utils/stripe";
import { assertRateLimit } from "~/server/utils/rateLimit";
import type {
  CheckoutReservation,
  CheckoutReservationFailure,
} from "~/types/shop";

/** Stati in cui un PaymentIntent non ha ancora incassato e si può annullare. */
const CANCELLABLE = new Set([
  "requires_payment_method",
  "requires_confirmation",
  "requires_action",
]);

/** Stripe non accetta addebiti in euro sotto i 50 centesimi. */
const STRIPE_MIN_AMOUNT_CENTS = 50;

const releaseReservation = (event: H3Event, reservationId: string) =>
  cmsFetch(event, "/checkout/release", {
    method: "POST",
    body: { reservationId },
  }).catch((error) => {
    // Non blocca il cliente: alla scadenza la prenotazione la chiude il cron.
    console.error("Rilascio prenotazione fallito", reservationId, error);
  });

/**
 * Prenota la merce sul CMS e apre il pagamento, al clic su "Paga".
 *
 * L'importo addebitato è quello calcolato dal CMS sui prezzi di catalogo, mai
 * quello inviato dal browser: manomettere il carrello in localStorage non
 * cambia quanto viene addebitato. Se però il totale del CMS è diverso da
 * quello che il cliente ha davanti (un prezzo cambiato nel frattempo), il
 * pagamento non parte: si restituiscono i nuovi importi da mostrargli.
 *
 * Se il CMS risponde 409 la merce è appena stata venduta: si risponde 409 anche
 * al client, prima che l'utente paghi, così non c'è nessun rimborso da gestire.
 */
export default defineEventHandler(async (event) => {
  // Ogni chiamata blocca merce per 15 minuti: un client in loop non deve
  // poter svuotare il negozio.
  assertRateLimit(event, "checkout-intent", {
    max: 10,
    windowMs: 10 * 60 * 1000,
    message: "Troppi tentativi di pagamento, riprova fra qualche minuto",
  });

  const body = await readBody<{
    lines?: { variantId: string; quantity: number }[];
    shippingMethodId?: string;
    couponCode?: string | null;
    customer?: Record<string, unknown>;
    address?: Record<string, unknown>;
    invoice?: Record<string, unknown> | null;
    expectedTotalCents?: number;
    previousPaymentIntentId?: string;
  }>(event);

  const stripe = getStripe(event);

  // Il cliente aveva già aperto un pagamento e ha cambiato qualcosa: quello
  // vecchio si annulla e la sua merce torna disponibile prima di riprenotare.
  const previousId = String(body?.previousPaymentIntentId ?? "").trim();
  if (previousId) {
    const previous = await stripe.paymentIntents.retrieve(previousId).catch(() => null);
    if (previous?.status === "succeeded" || previous?.status === "processing") {
      setResponseStatus(event, 409);
      return { ok: false, issues: [], alreadyPaid: true, paymentIntentId: previous.id };
    }
    if (previous && CANCELLABLE.has(previous.status)) {
      await stripe.paymentIntents.cancel(previous.id).catch(() => null);
      if (previous.metadata?.reservationId) {
        await releaseReservation(event, previous.metadata.reservationId);
      }
    }
  }

  const reservation = await cmsFetchAllowingConflict<
    CheckoutReservation | CheckoutReservationFailure
  >(event, "/checkout/reserve", {
    method: "POST",
    body: {
      lines: body?.lines ?? [],
      shippingMethodId: body?.shippingMethodId,
      couponCode: body?.couponCode ?? null,
      customer: body?.customer,
      address: body?.address,
      invoice: body?.invoice ?? null,
    },
  });

  if (reservation.status === 409 || !reservation.data.ok) {
    setResponseStatus(event, 409);
    return reservation.data;
  }

  const reserved = reservation.data as CheckoutReservation;
  const expected = Math.trunc(Number(body?.expectedTotalCents));

  if (Number.isFinite(expected) && expected !== reserved.totals.totalCents) {
    await releaseReservation(event, reserved.reservationId);
    setResponseStatus(event, 409);
    return {
      ok: false,
      issues: [],
      priceChanged: true,
      lines: reserved.lines,
      totals: reserved.totals,
    };
  }

  if (reserved.totals.totalCents < STRIPE_MIN_AMOUNT_CENTS) {
    await releaseReservation(event, reserved.reservationId);
    throw createError({
      statusCode: 400,
      statusMessage: "L'importo minimo per pagare con carta è 0,50 €",
    });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: reserved.totals.totalCents,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      description: "Ordine Jigglycard",
      // La prenotazione è l'unica fonte dell'ordine: la conferma e il webhook
      // la ritrovano da qui, non da quello che il browser rimanda.
      metadata: { reservationId: reserved.reservationId },
    });

    return {
      ...reserved,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    await releaseReservation(event, reserved.reservationId);
    throw error;
  }
});
