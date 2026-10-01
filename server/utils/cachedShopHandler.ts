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

  return defineEventHandler(async (event) => {
    const result = await cached(event);
    noStore(event);
    return result;
  });
}
