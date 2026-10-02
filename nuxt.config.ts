export default defineNuxtConfig({
  // Permettono di isolare build e dev l'una dall'altra, e di lavorare anche
  // quando `.nuxt` o `node_modules` non sono scrivibili dall'utente corrente.
  buildDir: process.env.NUXT_BUILD_DIR || ".nuxt",
  vite: {
    cacheDir: process.env.NUXT_VITE_CACHE_DIR || undefined,
  },
  devtools: { enabled: true },
  // Solo ciò che vale anche per la pagina d'errore, che Nuxt disegna al posto
  // di app.vue: titoli, descrizioni, Open Graph e canonical stanno in app.vue.
  app: {
    head: {
      htmlAttrs: { lang: "it" },
    },
  },
  // Il sito ha un solo tema, notturno: la classe `dark` su <html> accende
  // anche le varianti `dark:` di FormKit e Nuxt UI.
  // Chiave nuova: chi ha visitato il sito prima ha "light" salvato sotto la
  // chiave predefinita, e la preferenza salvata vince su quella di default.
  colorMode: {
    preference: "dark",
    fallback: "dark",
    storageKey: "jigglycard-color-mode",
  },

  // Tailwind lo registra il modulo @nuxtjs/tailwindcss (incluso da @nuxt/ui),
  // che però iniettava anche un suo CSS con le direttive @tailwind: insieme a
  // quelle di main.scss ogni pagina riceveva due build intere (~370 KB inline).
  // Resta solo main.scss, che ha già direttive e @layer.
  tailwindcss: {
    cssPath: false,
  },
  // Analytics solo dopo il consenso: in modalità manuale lo script Google non
  // si carica finché CookieBanner non chiama initialize() su consenso alle
  // statistiche espresso nel banner iubenda (linee guida Garante 10/6/2021).
  gtag: {
    id: "GTM-MP3GKJSW",
    initMode: "manual",
    initCommands: [
      [
        "consent",
        "default",
        {
          analytics_storage: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        },
      ],
    ],
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
    // Segreto di firma del webhook Stripe (whsec_...), per /api/shop/stripe/webhook.
    STRIPE_WEBHOOK_SECRET: "",
    CMS_STOREFRONT_URL: "",
    CMS_STOREFRONT_KEY: "",
    // Casella Aruba da cui partono conferme d'ordine e messaggi di assistenza.
    SMTP_HOST: "",
    SMTP_PORT: "",
    SMTP_SECURE: "",
    SMTP_USER: "",
    SMTP_PASS: "",
    MAIL_FROM: "",
    public: {
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

  // /welcome era la pagina d'iscrizione alla newsletter pre-lancio: la
  // newsletter non c'è più, i link vecchi portano in home invece che a un 404.
  routeRules: {
    "/welcome": { redirect: { to: "/", statusCode: 301 } },
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
