<template>
  <div class="max-w-[420px]">
    <h5 class="mb-2">{{ t("paymentMethods") }}</h5>

    <div v-if="clientSecret">
      <StripeElements
        :stripe-key="stripePublicKey"
        :instance-options="stripeOptions"
        :elements-options="elementsOptions"
        ref="elementsComponent"
      >
        <StripeElement
          type="payment"
          :options="paymentElementOptions"
          ref="paymentComponent"
        />
      </StripeElements>
    </div>

    <div class="mt-6">
      <AtomsButtonCTA
        @click="confirmAndPay"
        :type="isCheckoutValid ? 'primary' : 'disabled'"
        :class="['rounded']"
        :text="t('confirmAndPay')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from "vue";
import { type CheckoutFormData } from "~/pages/checkout.vue";
import type { StripePaymentElementOptions } from "@stripe/stripe-js";
import {
  elementsOptions,
  stripeOptions,
  paymentElementOptions,
} from "~/service/StripeConfig";
import { OrderStrapiService } from "~/service/Strapi/OrderService";
import { UserStrapiService, type User } from "~/service/Strapi/UserService";

type ShippingOption = { label: string; price: number };

type PaymentIntentResponse = {
  success: boolean;
  clientSecret?: string;
  message?: string;
};

const { t } = useI18n();
const config = useRuntimeConfig();

const stripePublicKey = config.public.STRIPE_PUBLIC_KEY;
const purchaseCompletedUrl = config.public.PURCHASE_COMPLETED_URL;
const strapiBaseUrl = config.public.STRAPI_BASE_URL;
const fullAccessToken = config.public.FULL_ACCESS_TOKEN;

const orderService = new OrderStrapiService(strapiBaseUrl, fullAccessToken);
const userService = new UserStrapiService(strapiBaseUrl, fullAccessToken);

const cartConfig: CartConfig = {
  strapiBaseUrl,
  fullAccessToken,
};
const { products, getCartData } = useCart(cartConfig);
const { handleError } = useErrorHandler();

const props = defineProps({
  shippingOption: { type: Object as PropType<ShippingOption>, required: true },
  isCheckoutValid: { type: Boolean, required: true, default: false },
  totalAmount: { type: Number, required: true, default: 0 },
  userData: { type: Object as PropType<CheckoutFormData>, required: true },
});

const emits = defineEmits<{
  (e: "submitConfirmAndPay"): void;
}>();

const clientSecret = ref<string>("");
const elementsComponent = ref<any>(null);
const paymentComponent = ref<any>(null);

const totalInCents = computed(() => Math.round(props.totalAmount * 100));

/** Helpers */
async function createPaymentIntent(amountCents: number) {
  const res = await $fetch<PaymentIntentResponse>(
    "/api/create-payment-intent",
    {
      method: "POST",
      body: { amount: amountCents },
    }
  );
  if (!res.success || !res.clientSecret)
    throw new Error(res.message || "No client secret");
  return res.clientSecret;
}

async function ensureUser(
  email: string,
  name: string,
  surname: string
): Promise<any> {
  const existing = await userService.getUserByEmail(email);
  if (Array.isArray(existing) && existing.length > 0) return existing[0];
  const result: any = await userService.createItem({
    username: email,
    email,
    name,
    surname,
  });
  return result.data;
}

/** Bootstrap: crea il PaymentIntent appena si apre la pagina */
onBeforeMount(async () => {
  try {
    clientSecret.value = await createPaymentIntent(totalInCents.value);
  } catch (error) {
    handleError("Error creating payment intent", error as Error);
  }
});

const confirmAndPay = async () => {
  try {
    const stripeInstance = elementsComponent.value?.instance;
    const elements = elementsComponent.value?.elements;

    if (!props.isCheckoutValid) return;
    if (!stripeInstance || !elements) throw new Error("Stripe not ready");
    if (!clientSecret.value) throw new Error("Missing clientSecret");

    // Prepara user + cart in parallelo
    const [user, cartData] = await Promise.all([
      ensureUser(
        props.userData.email,
        props.userData.name,
        props.userData.surname
      ),
      getCartData(),
    ]);

    // Costruisci l'ordine
    const orderPayload = {
      customer: user.documentId,
      date: new Date(),
      shipment_method: props.shippingOption.label,
      shipment_value: props.shippingOption.price,
      order_value: props.totalAmount - props.shippingOption.price,
      total_value: props.totalAmount,
      variants: products.value.map((p) => p.id),
      city: props.userData.city,
      cap: props.userData.cap,
      street: props.userData.streetAndHouseNumber,
      coupon: cartData?.data?.coupon,
      quantity: cartData?.data?.quantity,
    };

    // Crea ordine prima del pagamento (valuta idempotenza lato API)
    const orderResult: any = await orderService.createItem(orderPayload);

    // Stripe: validazione UI
    const { error: submitError } = await elements.submit();
    if (submitError) throw submitError;

    // Aggiunge l'ID dell'ordine alla URL di ritorno
    const url = new URL(purchaseCompletedUrl);
    url.searchParams.set("orderId", String(orderResult.data.documentId));
    const returnUrlWithOrder = url.toString();

    // Conferma pagamento
    const { error } = await stripeInstance.confirmPayment({
      elements,
      clientSecret: clientSecret.value,
      confirmParams: { return_url: returnUrlWithOrder },
    });
    if (error) throw error;

    emits("submitConfirmAndPay");
  } catch (err) {
    handleError("Checkout error", err as Error);
  }
};
</script>
