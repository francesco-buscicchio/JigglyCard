import en from "./locales/en.json";
import it from "./locales/it.json";

export default defineI18nConfig(() => ({
  legacy: false,
  locale: "it",
  messages: {
    en: en,
    it: it,
  },
}));
