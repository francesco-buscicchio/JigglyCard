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
const emits = defineEmits(["submitConfirmAndPay"]);
const config = useRuntimeConfig();
const clientSecret = ref("");
const stripePublicKey = config.public.STRIPE_PUBLIC_KEY;
const purchaseCompletedUrl = config.public.PURCHASE_COMPLETED_URL;
const elementsComponent = ref();
const paymentComponent = ref();
const stripeOptions = ref({
  // https://stripe.com/docs/js/initializing#init_stripe_js-options
});

const elementsOptions = ref<StripeElementsOptionsMode>({
  // https://stripe.com/docs/js/elements_object/create#stripe_elements-options
  mode: "payment",
  amount: 100, //valore fittizio necessario per il render
  currency: "eur",
  appearance: {
    theme: "stripe",
    variables: {
      fontWeightNormal: "500",
      borderRadius: "2px",
      colorPrimary: "#006482",
      tabIconSelectedColor: "#fff",
      gridRowSpacing: "16px",
      iconColor: "#006482",
    },
    rules: {
      ".Tab, .Input, .Block, .CheckboxInput, .CodeInput": {
        boxShadow: "0px 3px 10px rgba(18, 42, 66, 0.08)",
      },
      ".Block": {
        borderColor: "transparent",
      },
      ".BlockDivider": {
        backgroundColor: "#ebebeb",
      },
      ".Tab, .Tab:hover, .Tab:focus": {
        border: "0",
        color: "#006482",
      },
      ".Tab--selected, .Tab--selected:hover": {
        backgroundColor: "#EBF6FE",
        color: "#006482",
      },
    },
  },
});

const expressCheckoutOptions = ref<StripeExpressCheckoutElementOptions>({
  // eventually fo apple and google pay
  // https://docs.stripe.com/js/elements_object/create_express_checkout_element#express_checkout_element_create-options
});

const paymentElementOptions = ref<StripePaymentElementOptions>({
  // https://docs.stripe.com/js/elements_object/create_payment_element#payment_element_create-options
  layout: {
    type: "accordion",
    defaultCollapsed: false,
    radios: true,
    spacedAccordionItems: false,
  },
  wallets: {
    applePay: "auto",
    googlePay: "auto",
  },
});

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
    console.error("Error creating payment intent:", error);
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
    console.error("Error submitting elements:", submitError);
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
