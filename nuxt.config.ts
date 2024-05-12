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

  runtimeConfig: {
    public: {
      "graphql-client": {
        clients: {
          default: {
            host: process.env.SHOPIFY_DOMAIN,
            token: {
              name: "X-Shopify-Storefront-Access-Token",
              value: process.env.SHOPIFY_STOREFRONT_TOKEN,
              type: null,
            },
            retainToken: true,
          },
        },
      },
    },
  },
  css: ["~/assets/css/main.scss", "nuxt-graphql-client"],
  modules: [
    "@nuxt/image",
    "nuxt-icon",
    "nuxt-swiper",
    "@nuxt/ui",
    "@nuxtjs/i18n",
  ],
});
