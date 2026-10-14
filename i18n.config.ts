// I testi stanno in locales/<codice>.json e si caricano su richiesta
// (`i18n.lazy` in nuxt.config): qui restano solo le opzioni di vue-i18n.
export default defineI18nConfig(() => ({
  legacy: false,
  locale: "it",
}));
