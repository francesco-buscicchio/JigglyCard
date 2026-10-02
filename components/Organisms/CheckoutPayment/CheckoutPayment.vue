<template>
  <MoleculesToastMessage
    :text="toastData.message"
    :type="toastData.type"
    :trigger-key="toastKey"
  />
  <div class="pay">
    <h2 class="pay__title">
      <Icon name="heroicons:credit-card-20-solid" size="20" class="pay__title-icon" />
      {{ t("payments.methodsTitle") }}
    </h2>

    <div v-if="clientSecret" class="pay__element">
      <StripeElements
        :stripe-key="stripePublicKey"
        :instance-options="stripeOptions"
        :elements-options="nightElementsOptions"
        ref="elementsComponent"
      >
        <StripeElement
          type="payment"
          :options="paymentElementOptions"
          ref="paymentComponent"
        />
      </StripeElements>
    </div>

    <div class="pay__cta">
      <AtomsButtonCTA
        @click="confirmAndPay"
        :type="isCheckoutValid ? 'primary' : 'disabled'"
        :text="t('checkout.actions.confirmAndPay')"
      >
        <Icon name="heroicons:lock-closed-20-solid" size="18" />
      </AtomsButtonCTA>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, type PropType } from "vue";
import { type CheckoutFormData } from "~/pages/checkout.vue";
import type { CheckoutLineIssue } from "~/types/shop";
import type { StripePaymentElementOptions } from "@stripe/stripe-js";
import {
  elementsOptions,
  stripeOptions,
  paymentElementOptions,
} from "~/service/StripeConfig";
import { useCartStore } from "~/stores/cart";
import { PENDING_ORDER_STORAGE_KEY } from "~/data/const";

type ShippingOption = { id?: string | null; label: string; price: number };

const { t } = useI18n();
const config = useRuntimeConfig();
const cart = useCartStore();
const { createCheckoutIntent } = useShop();
const { handleError } = useErrorHandler();

const stripePublicKey = config.public.STRIPE_PUBLIC_KEY;
const purchaseCompletedUrl = config.public.PURCHASE_COMPLETED_URL;

/**
 * Stesse opzioni di StripeConfig, cambia solo l'aspetto: il tema "stripe"
 * (bianco, accenti blu) sul pannello notturno sembrava un modulo incollato
 * da un altro sito. Qui i colori del brand, con valori pieni perché Stripe
 * non accetta trasparenze nelle variabili.
 */
const nightElementsOptions = {
  ...elementsOptions,
  appearance: {
    theme: "night" as const,
    variables: {
      colorPrimary: "#ec91a0",
      colorBackground: "#12163b",
      colorText: "#f6f3ff",
      colorTextSecondary: "#b8b4dc",
      colorTextPlaceholder: "#8a87b6",
      colorDanger: "#ff9aab",
      iconColor: "#f7d2d8",
      fontFamily: '"Roboto Flex", system-ui, -apple-system, "Segoe UI", sans-serif',
      fontSizeBase: "16px",
      borderRadius: "14px",
      spacingUnit: "4px",
      gridRowSpacing: "16px",
      focusOutline: "none",
      focusBoxShadow: "0 0 0 4px rgba(236, 145, 160, 0.2)",
    },
    rules: {
      ".AccordionItem": {
        backgroundColor: "#0f1336",
        border: "1px solid #262b58",
        boxShadow: "none",
      },
      ".Input": {
        backgroundColor: "#161b45",
        border: "1px solid #2a2f5e",
        boxShadow: "none",
      },
      ".Input:focus": {
        borderColor: "#ec91a0",
      },
      ".Tab": {
        backgroundColor: "#161b45",
        border: "1px solid #2a2f5e",
        boxShadow: "none",
      },
      ".Tab--selected, .Tab--selected:hover": {
        borderColor: "#ec91a0",
        color: "#f6f3ff",
      },
      ".Label": {
        color: "#b8b4dc",
      },
    },
  },
};

const toastKey = ref(0);
const toastData = reactive({ message: "", type: "" });

const props = defineProps({
  shippingOption: { type: Object as PropType<ShippingOption>, required: true },
  isCheckoutValid: { type: Boolean, required: true, default: false },
  totalAmount: { type: Number, required: true, default: 0 },
  userData: { type: Object as PropType<CheckoutFormData>, required: true },
});

const emits = defineEmits<{
  (e: "submitConfirmAndPay"): void;
  (e: "stockIssues", issues: CheckoutLineIssue[]): void;
}>();

const clientSecret = ref<string>("");
const elementsComponent = ref<any>(null);
const paymentComponent = ref<any>(null);
const reservation = ref<any>(null);

/**
 * Prenota la merce e apre il pagamento.
 *
 * La prenotazione avviene qui, non all'aggiunta al carrello: impegnare lo stock
 * prima significherebbe bloccare merce vendibile per ogni carrello abbandonato.
 * Se il CMS risponde che qualcosa non è più disponibile, l'utente lo scopre
 * adesso — prima di pagare.
 */
onBeforeMount(async () => {
  try {
    cart.hydrate();
    const result = await createCheckoutIntent({
      lines: cart.lines.map((line) => ({
        variantId: line.variantId,
        quantity: line.quantity,
      })),
      shippingMethodId: props.shippingOption.id ?? undefined,
      couponCode: cart.couponCode || null,
    });

    if (!result.ok) {
      emits("stockIssues", result.issues);
      return;
    }

    reservation.value = result;
    clientSecret.value = result.clientSecret;
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
    if (!clientSecret.value || !reservation.value) {
      throw new Error("Missing clientSecret");
    }

    const { error: submitError } = await elements.submit();
    if (submitError) throw submitError;

    // L'ordine si crea solo dopo il pagamento: qui si mette da parte tutto
    // quello che servirà alla pagina di conferma per richiederlo al CMS.
    sessionStorage.setItem(
      PENDING_ORDER_STORAGE_KEY,
      JSON.stringify({
        paymentIntentId: reservation.value.paymentIntentId,
        reservationId: reservation.value.reservationId,
        customer: {
          name: props.userData.name,
          surname: props.userData.surname,
          email: props.userData.email,
        },
        address: {
          street: props.userData.streetAndHouseNumber,
          city: props.userData.city,
          zip: props.userData.cap,
          country: "IT",
        },
        shippingMethod: {
          id: reservation.value.shippingMethod?.id ?? null,
          name: reservation.value.shippingMethod?.name ?? props.shippingOption.label,
          priceCents: reservation.value.totals.shippingCents,
        },
        lines: reservation.value.lines,
        couponCode: reservation.value.coupon?.code ?? null,
        discountCents: reservation.value.totals.discountCents,
      }),
    );

    const { error } = await stripeInstance.confirmPayment({
      elements,
      clientSecret: clientSecret.value,
      confirmParams: { return_url: purchaseCompletedUrl },
    });

    if (error) {
      toastData.message = t("toast.checkout.error", { error: error.message });
      toastData.type = "error";
      toastKey.value++;
      console.error(error);
    }

    emits("submitConfirmAndPay");
  } catch (err) {
    handleError("Checkout error", err as Error);
  }
};
</script>

<style scoped>
.pay {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.pay__title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-size: 19px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--im-ink);
}

@media (min-width: 1024px) {
  .pay__title {
    font-size: 22px;
  }
}

.pay__title-icon {
  color: var(--im-pink);
}

/* L'iframe di Stripe ha un fondo pieno: una cornice sottile lo lega al
   vetro del pannello. */
.pay__element {
  padding: 4px;
  border-radius: 18px;
  background: rgba(7, 10, 31, 0.35);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
}

.pay__cta {
  padding-top: 4px;
}

@media (min-width: 640px) {
  .pay__cta {
    max-width: 360px;
  }
}
</style>
