/**
 * Riapre il pannello delle preferenze cookie di iubenda, così la scelta si può
 * cambiare in qualsiasi momento (linee guida del Garante del 10/6/2021).
 * Usato dal link nel footer e dalla Cookie Policy.
 */
export function useCookiePreferences() {
  const openPreferences = () => {
    if (import.meta.server) return;
    const api = (window as any)._iub?.cs?.api;
    if (api?.openPreferences) {
      api.openPreferences();
      return;
    }
    // iubenda non ancora caricato (rete lenta o bloccato): la pagina della
    // policy spiega comunque come gestire i cookie dal browser.
    navigateTo("/cookies");
  };

  return { openPreferences };
}
