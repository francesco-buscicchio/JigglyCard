import { defineNuxtPlugin } from "#app";
import { loadStripe } from "@stripe/stripe-js";

export default defineNuxtPlugin(async (nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  const stripe = await loadStripe(runtimeConfig.public.STRIPE_PUBLIC_KEY);
  nuxtApp.provide("stripe", stripe);
});
