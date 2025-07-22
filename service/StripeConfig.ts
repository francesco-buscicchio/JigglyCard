// src/service/StripeConfig.ts
import type {
  StripeElementsOptionsMode,
  StripeExpressCheckoutElementOptions,
  StripePaymentElementOptions,
} from "@stripe/stripe-js";

export const stripeOptions = {
  // https://stripe.com/docs/js/initializing#init_stripe_js-options
};

export const expressCheckoutOptions = ref<StripeExpressCheckoutElementOptions>({
  // eventually fo apple and google pay
  // https://docs.stripe.com/js/elements_object/create_express_checkout_element#express_checkout_element_create-options
});

export const elementsOptions: StripeElementsOptionsMode = {
  mode: "payment",
  amount: 100, // questo valore verrà aggiornato nel componente
  currency: "eur",
  appearance: getAppearanceConfig(),
};

export const paymentElementOptions: StripePaymentElementOptions = {
  layout: {
    type: "accordion",
    defaultCollapsed: false,
    radios: true,
    spacedAccordionItems: false,
  },
  wallets: { applePay: "auto", googlePay: "auto" },
};

function getAppearanceConfig() {
  return {
    theme: "stripe" as "flat" | "stripe" | "night" | undefined,
    variables: {
      fontWeightNormal: "500",
      borderRadius: "2px",
      colorPrimary: "#006482",
      tabIconSelectedColor: "#fff",
      gridRowSpacing: "16px",
      iconColor: "#006482",
    },
    rules: getElementRules(),
  };
}

function getElementRules() {
  return {
    ".Tab, .Input, .Block, .CheckboxInput, .CodeInput": {
      boxShadow: "0px 3px 10px rgba(18, 42, 66, 0.08)",
    },
    ".Block": { borderColor: "transparent" },
    ".BlockDivider": { backgroundColor: "#ebebeb" },
    ".Tab, .Tab:hover, .Tab:focus": { border: "0", color: "#006482" },
    ".Tab--selected, .Tab--selected:hover": {
      backgroundColor: "#EBF6FE",
      color: "#006482",
    },
  };
}
