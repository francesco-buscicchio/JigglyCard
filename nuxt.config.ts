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

  formkit: {
    autoImport: true,
    configFile: "./formkit.config.ts",
  },

  runtimeConfig: {
    public: {
      FB_API_KEY: process.env.FB_API_KEY,
      FB_AUTH_DOMAIN: process.env.FB_AUTH_DOMAIN,
      FB_PROJECT_ID: process.env.FB_PROJECT_ID,
      FB_STORAGE_BUCKET: process.env.FB_STORAGE_BUCKET,
      FB_MESSAGING_SENDER_ID: process.env.FB_MESSAGING_SENDER_ID,
      FB_APP_ID: process.env.FB_APP_ID,
      FB_MEASUREMENT_ID: process.env.FB_MEASUREMENT_ID,
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
      NEWSLETTER_TO_MAIL: process.env.NEWSLETTER_TO_MAIL,
      NEWSLETTER_TO_NAME: process.env.NEWSLETTER_TO_NAME,
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
    "nuxt-medusa",
    "@formkit/nuxt",
    "@nuxt/icon",
  ],

  googleFonts: {
    families: {
      "Roboto+Serif": [500],
      "Roboto+Flex": [400],
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
