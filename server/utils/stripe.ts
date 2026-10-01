import Stripe from "stripe";
import { createError, type H3Event } from "h3";

let client: Stripe | null = null;

/**
 * Client Stripe creato alla prima richiesta.
 *
 * L'istanza non va costruita a livello di modulo: in build la chiave non è
 * ancora disponibile e l'import fallirebbe.
 */
export function getStripe(event: H3Event) {
  if (client) return client;

  const secret = String(useRuntimeConfig(event).STRIPE_SECRET_KEY ?? "");
  if (!secret) {
    throw createError({
      statusCode: 503,
      statusMessage: "Configurazione Stripe mancante",
    });
  }

  client = new Stripe(secret);
  return client;
}
