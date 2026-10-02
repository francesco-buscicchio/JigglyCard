import { createError, readBody, setResponseStatus } from "h3";
import { getStripe } from "~/server/utils/stripe";
import { finalizePaidOrder } from "~/server/utils/orderFinalization";

/** Mostra l'email quel tanto che basta a riconoscerla: m***@gmail.com. */
const maskEmail = (email: string) => {
  const [user, domain] = email.split("@");
  if (!user || !domain) return "";
  return `${user.slice(0, 1)}***@${domain}`;
};

/**
 * Pagina di ritorno da Stripe: verifica il pagamento e chiude l'ordine.
 *
 * Il browser passa solo l'id del PaymentIntent (lo stesso che Stripe mette
 * nell'URL di ritorno). Stato e importo si leggono da Stripe, righe e dati del
 * cliente dalla prenotazione sul CMS: visitare l'URL non basta a creare un
 * ordine pagato, e un carrello manomesso non cambia cosa viene ordinato.
 *
 * Lo stesso lavoro lo fa il webhook di Stripe, anche se il cliente chiude la
 * scheda prima di tornare qui: la creazione è idempotente sul PaymentIntent.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<{ paymentIntentId?: string }>(event);

  const paymentIntentId = String(body?.paymentIntentId ?? "").trim();
  if (!/^pi_[A-Za-z0-9]+$/.test(paymentIntentId)) {
    throw createError({ statusCode: 400, statusMessage: "PaymentIntent mancante" });
  }

  const paymentIntent = await getStripe(event).paymentIntents.retrieve(paymentIntentId);

  // Bonifici e addebiti SEPA restano "in elaborazione" anche per giorni:
  // l'ordine lo creerà il webhook quando l'incasso arriva.
  if (paymentIntent.status === "processing") {
    setResponseStatus(event, 202);
    return { status: "processing" as const };
  }

  if (paymentIntent.status !== "succeeded") {
    return { status: "failed" as const, paymentStatus: paymentIntent.status };
  }

  const { result } = await finalizePaidOrder(event, paymentIntent);

  return {
    status: "confirmed" as const,
    orderNumber: result.orderNumber,
    email: maskEmail(result.order.customer.email),
    totalCents: paymentIntent.amount_received,
  };
});
