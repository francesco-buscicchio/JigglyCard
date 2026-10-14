/**
 * Applica la lingua salvata dal selettore prima del primo rendering, sul
 * server come nel browser: senza, la pagina arriverebbe in italiano e
 * cambierebbe lingua solo dopo l'idratazione.
 */
export default defineNuxtPlugin({
  name: "jigglycard-locale",
  dependsOn: ["i18n:plugin"],
  async setup(nuxtApp) {
    const saved = useLocaleCookie().value;
    const i18n = nuxtApp.$i18n;
    if (saved && saved !== i18n.locale.value && i18n.localeCodes.value.includes(saved)) {
      await i18n.setLocale(saved);
    }
  },
});
