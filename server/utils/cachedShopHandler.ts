import { setResponseHeader, type EventHandler, type H3Event } from "h3";

/**
 * Come `defineCachedEventHandler`, con due differenze volute.
 *
 * In sviluppo la cache è disattivata: nasconderebbe le modifiche appena fatte
 * e farebbe sembrare rotto ciò che funziona.
 *
 * In produzione la cache resta sul **server** e il browser riceve `no-store`.
 * Altrimenti la risposta finisce nella cache HTTP del client e resta lì per
 * tutta la durata del `maxAge`: un aggiornamento di catalogo o di listino non
 * arriverebbe a chi ha già visitato la pagina, e non c'è modo di invalidarla.
 */
export function defineCachedShopHandler<T>(
  handler: EventHandler<any, T>,
  options: { maxAge: number; name: string; getKey?: (event: any) => string },
) {
  const noStore = (event: H3Event) =>
    setResponseHeader(event, "cache-control", "no-store");

  if (import.meta.dev) {
    return defineEventHandler(async (event) => {
      noStore(event);
      return handler(event);
    });
  }

  const cached = defineCachedEventHandler(handler, {
    maxAge: options.maxAge,
    name: options.name,
    getKey: options.getKey ?? (() => options.name),
  });

  // La cache di Nitro vive nella memoria della singola funzione Netlify, che
  // nasce e muore spesso: chi capitava su una funzione nuova aspettava il CMS
  // (anche 3-4 s per la home). Il CDN di Netlify invece è condiviso da tutti;
  // "durable" lo rende comune a tutte le sedi, e con stale-while-revalidate
  // risponde subito con la copia precedente mentre ne prepara una nuova.
  // Questa intestazione la legge solo il CDN: al browser resta no-store.
  const cdnCache = `public, durable, s-maxage=${options.maxAge}, stale-while-revalidate=3600`;

  return defineEventHandler(async (event) => {
    const result = await cached(event);
    noStore(event);
    setResponseHeader(event, "netlify-cdn-cache-control", cdnCache);
    return result;
  });
}
