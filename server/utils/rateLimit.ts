import { createError, getRequestIP, type H3Event } from "h3";

const buckets = new Map<string, number[]>();

/**
 * Limite di richieste per IP, nella memoria della singola istanza.
 *
 * Su Netlify ogni istanza ha la sua memoria, quindi non è un limite globale:
 * basta però a frenare chi martella una rotta dallo stesso client (prove di
 * coupon a raffica, checkout aperti in loop che bloccano merce).
 */
export function assertRateLimit(
  event: H3Event,
  scope: string,
  { max, windowMs, message }: { max: number; windowMs: number; message: string },
) {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? "sconosciuto";
  const key = `${scope}:${ip}`;
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((at) => now - at < windowMs);

  if (recent.length >= max) {
    throw createError({ statusCode: 429, statusMessage: message });
  }

  recent.push(now);
  buckets.set(key, recent);

  // Pulizia occasionale, perché la mappa non cresca senza limiti.
  if (buckets.size > 5000) {
    for (const [entry, times] of buckets) {
      if (!times.some((at) => now - at < windowMs)) buckets.delete(entry);
    }
  }
}
