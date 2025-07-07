import { defineNuxtPlugin } from "#app";
import { StripeElements, StripeElement } from "vue-stripe-js";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("StripeElements", StripeElements);
  nuxtApp.vueApp.component("StripeElement", StripeElement);
});
