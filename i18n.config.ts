import en from "./locales/en.json";
import it from "./locales/it.json";

export default defineI18nConfig(() => ({
  legacy: false,
  locale: "en",
  messages: {
    en: en,
    it: it,
  },
}));
