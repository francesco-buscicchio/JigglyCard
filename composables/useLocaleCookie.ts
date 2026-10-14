/**
 * Lingua scelta dal selettore. Cookie tecnico (elencato nella cookie policy):
 * serve al server per disegnare la pagina già nella lingua giusta.
 */
export function useLocaleCookie() {
  return useCookie<string | null>("jigglycard_locale", {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    path: "/",
  });
}
