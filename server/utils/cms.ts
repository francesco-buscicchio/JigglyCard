import { createError, type H3Event } from "h3";

/**
 * Client verso l'API storefront del CMS.
 *
 * La chiave `x-storefront-key` non deve mai raggiungere il browser: ogni
 * chiamata al CMS passa da qui, cioè dal server Nitro del sito. Le rotte
 * pubbliche sotto `server/api/shop/` sono la sola superficie esposta al client.
 */
export async function cmsFetch<T>(
  event: H3Event,
  path: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    query?: Record<string, unknown>;
    body?: unknown;
  } = {},
): Promise<T> {
  const config = useRuntimeConfig(event);
  const baseUrl = String(config.CMS_STOREFRONT_URL ?? "").replace(/\/+$/, "");
  const key = String(config.CMS_STOREFRONT_KEY ?? "");

  if (!baseUrl || !key) {
    throw createError({
      statusCode: 503,
      statusMessage:
        "Configurazione CMS mancante: impostare CMS_STOREFRONT_URL e CMS_STOREFRONT_KEY",
    });
  }

  return $fetch<T>(`${baseUrl}/api/storefront${path}`, {
    method: options.method ?? "GET",
    headers: { "x-storefront-key": key },
    query: options.query,
    body: options.body as any,
  });
}

/**
 * Variante che non solleva sui 409: il CMS li usa per dire "questa riga non è
 * più disponibile", che per il sito è una risposta valida da mostrare
 * all'utente, non un errore.
 */
export async function cmsFetchAllowingConflict<T>(
  event: H3Event,
  path: string,
  options: Parameters<typeof cmsFetch>[2] = {},
): Promise<{ status: number; data: T }> {
  try {
    const data = await cmsFetch<T>(event, path, options);
    return { status: 200, data };
  } catch (error: any) {
    if (error?.statusCode === 409 || error?.response?.status === 409) {
      return { status: 409, data: (error.data ?? error.response?._data) as T };
    }
    throw error;
  }
}
