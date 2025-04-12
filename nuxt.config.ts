export default defineNuxtConfig({
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
    port: 3000,
  },

  runtimeConfig: {
    paypalClientSecret: process.env.NUXT_PAYPAL_CLIENT_SECRET,
    public: {
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
      NEWSLETTER_TO_MAIL: process.env.NEWSLETTER_TO_MAIL,
      NEWSLETTER_TO_NAME: process.env.NEWSLETTER_TO_NAME,
      ALGOLIA_API_KEY: process.env.ALGOLIA_API_KEY,
      ALGOLIA_APPLICATION_ID: process.env.ALGOLIA_APPLICATION_ID,
      SENDGRID_API_TOKEN: process.env.SENDGRID_API_TOKEN,
      ADMIN_MAIL: process.env.ADMIN_MAIL,
      paypalClientId: process.env.NUXT_PUBLIC_PAYPAL_CLIENT_ID,
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
      "Roboto+Flex": [400, 900],
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
