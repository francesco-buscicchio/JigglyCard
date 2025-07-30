<template>
  <div class="max-w-[420px]">
    <h5 class="mb-2">{{ t("paymentMethods") }}</h5>
    <div>
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
      >
      </AtomsButtonCTA>
    </div>
  </div>
</template>

<script setup lang="ts">
// Documentation: https://github.com/ectoflow/vue-stripe-js
import type {
  StripeElementsOptionsMode,
  StripeExpressCheckoutElementOptions,
  StripePaymentElementOptions,
} from "@stripe/stripe-js";
import {
  elementsOptions,
  stripeOptions,
  expressCheckoutOptions,
  paymentElementOptions,
} from "~/service/Strapi/StripeConfig";

type PaymentIntentResponse = {
  success: boolean;
  clientSecret?: string;
  message?: string;
};

const props = defineProps({
  isCheckoutValid: {
    type: Boolean,
    default: false,
    required: true,
  },
  totalAmount: {
    type: Number,
    default: 0,
    required: true,
  },
});

const { t } = useI18n();
const { handleError } = useErrorHandler();
const emits = defineEmits(["submitConfirmAndPay"]);
const config = useRuntimeConfig();
const clientSecret = ref("");
const stripePublicKey = config.public.STRIPE_PUBLIC_KEY;
const purchaseCompletedUrl = config.public.PURCHASE_COMPLETED_URL;
const elementsComponent = ref();
const paymentComponent = ref();

onBeforeMount(async () => {
  const totalCart = Math.round(props.totalAmount * 100); // Convert to cents
  try {
    const res = await $fetch<PaymentIntentResponse>(
      "/api/create-payment-intent",
      {
        method: "POST",
        body: { amount: totalCart },
      }
    );

    clientSecret.value = res.clientSecret ?? "";
  } catch (error) {
    handleError("Error creating payment intent", error);
  }
});

const confirmAndPay = async () => {
  const stripeInstance = elementsComponent.value?.instance;
  const elements = elementsComponent.value?.elements;

  if (!stripeInstance || !elements) {
    console.error("Stripe instance or Elements not available");
    return;
  }
  // prima salvare l'ordine in  strapi e salvare l'id_documents

  const { error: submitError } = await elements.submit();
  if (submitError) {
    handleError("Error submitting elements:", submitError);
    return;
  }
  const { error } = await stripeInstance.confirmPayment({
    elements: elements,
    clientSecret: clientSecret.value,
    confirmParams: {
      return_url: purchaseCompletedUrl, //aggiungere un id_documents
    },
  });

  if (error) {
    // This point is only reached if there's an immediate error when
    // confirming the payment. Show the error to your customer (for example, payment details incomplete)
    console.log(error);
  }

  emits("submitConfirmAndPay");
};
</script>
