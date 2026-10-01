export default defineNuxtConfig({
  // Permettono di isolare build e dev l'una dall'altra, e di lavorare anche
  // quando `.nuxt` o `node_modules` non sono scrivibili dall'utente corrente.
  buildDir: process.env.NUXT_BUILD_DIR || ".nuxt",
  vite: {
    cacheDir: process.env.NUXT_VITE_CACHE_DIR || undefined,
  },
  devtools: { enabled: true },
  colorMode: {
    preference: "light",
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

  runtimeConfig: {
    // Segreti: restano lato server. Il browser non deve poter parlare né con
    // il CMS né con Stripe in scrittura.
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    CMS_STOREFRONT_URL: process.env.CMS_STOREFRONT_URL,
    CMS_STOREFRONT_KEY: process.env.CMS_STOREFRONT_KEY,
    SENDGRID_API_TOKEN: process.env.SENDGRID_API_TOKEN,
    public: {
      NEWSLETTER_TO_MAIL: process.env.NEWSLETTER_TO_MAIL,
      NEWSLETTER_TO_NAME: process.env.NEWSLETTER_TO_NAME,
      ADMIN_MAIL: process.env.ADMIN_MAIL,
      STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
      PURCHASE_COMPLETED_URL: process.env.PURCHASE_COMPLETED_URL,
    },
  },

  css: ["~/assets/css/main.scss"],
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
  googleFonts: {
    families: {
      "Roboto+Serif": [500],
      "Roboto+Flex": [400, 600, 900],
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
