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
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
      NEWSLETTER_TO_MAIL: process.env.NEWSLETTER_TO_MAIL,
      NEWSLETTER_TO_NAME: process.env.NEWSLETTER_TO_NAME,
      ALGOLIA_API_KEY: process.env.ALGOLIA_API_KEY,
      ALGOLIA_APPLICATION_ID: process.env.ALGOLIA_APPLICATION_ID,
      SENDGRID_API_TOKEN: process.env.SENDGRID_API_TOKEN,
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
