export default defineNuxtConfig({
  // Permettono di isolare build e dev l'una dall'altra, e di lavorare anche
  // quando `.nuxt` o `node_modules` non sono scrivibili dall'utente corrente.
  buildDir: process.env.NUXT_BUILD_DIR || ".nuxt",
  vite: {
    cacheDir: process.env.NUXT_VITE_CACHE_DIR || undefined,
  },
  devtools: { enabled: true },
  // Il sito ha un solo tema, notturno: la classe `dark` su <html> accende
  // anche le varianti `dark:` di FormKit e Nuxt UI.
  // Chiave nuova: chi ha visitato il sito prima ha "light" salvato sotto la
  // chiave predefinita, e la preferenza salvata vince su quella di default.
  colorMode: {
    preference: "dark",
    fallback: "dark",
    storageKey: "jigglycard-color-mode",
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  gtag: {
    id: "GTM-MP3GKJSW",
  },
  formkit: {
    autoImport: true,
    configFile: "./formkit.config.ts",
  },
  devServer: {
    host: "0.0.0.0",
    port: 3010,
  },

  // I valori arrivano a runtime dalle variabili NUXT_<NOME> (server) e
  // NUXT_PUBLIC_<NOME> (anche browser), es. NUXT_STRIPE_SECRET_KEY: leggerli
  // qui da process.env li scriverebbe nel bundle al momento della build, e
  // Netlify blocca il deploy se trova i segreti nel codice pubblicato.
  runtimeConfig: {
    // Segreti: restano lato server. Il browser non deve poter parlare né con
    // il CMS né con Stripe in scrittura.
    STRIPE_SECRET_KEY: "",
    CMS_STOREFRONT_URL: "",
    CMS_STOREFRONT_KEY: "",
    SENDGRID_API_TOKEN: "",
    public: {
      NEWSLETTER_TO_MAIL: "",
      NEWSLETTER_TO_NAME: "",
      ADMIN_MAIL: "",
      STRIPE_PUBLIC_KEY: "",
      PURCHASE_COMPLETED_URL: "",
    },
  },

  css: [
    "~/assets/css/main.scss",
    "~/assets/css/immersive.scss",
    "~/assets/css/forms.scss",
  ],
  modules: [
    "@nuxt/image",
    "nuxt-icon",
    "@nuxtjs/google-fonts",
    "nuxt-swiper",
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "@formkit/nuxt",
    "@nuxt/icon",
    "@pinia/nuxt",
    "nuxt-gtag",
  ],
  // Il sito non usa prefissi di lingua negli indirizzi. Con la strategia
  // predefinita ogni pagina inesistente veniva rimandata su /it/..., che poi
  // finiva nella rotta del catalogo come se "it" fosse un gioco.
  i18n: {
    strategy: "no_prefix",
  },

  googleFonts: {
    families: {
      "Roboto+Serif": [500],
      "Roboto+Flex": [400, 600, 900],
      // Titoli della home immersiva: un display largo e pieno, che regge le
      // dimensioni da poster senza diventare illeggibile.
      Unbounded: [500, 700, 800],
      download: true,
      inject: true,
    },
  },

  icon: {
    customCollections: [
      {
        prefix: "jig",
        dir: "./assets/icons",
      },
    ],
  },

  compatibilityDate: "2024-08-06",
});
