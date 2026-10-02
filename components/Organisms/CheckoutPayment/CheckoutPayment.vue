<template>
  <div class="pay">
    <h2 class="pay__title">
      <Icon name="heroicons:credit-card-20-solid" size="20" class="pay__title-icon" />
      {{ t("payments.methodsTitle") }}
    </h2>

    <!-- Senza chiave pubblica Stripe solleverebbe un'eccezione e
         bloccherebbe la pagina: il modulo non si monta proprio. -->
    <div v-if="stripePublicKey && amountCents >= MIN_AMOUNT_CENTS" class="pay__element">
      <StripeElements
        :stripe-key="stripePublicKey"
        :instance-options="stripeOptions"
        :elements-options="elementsOptionsForAmount"
        ref="elementsComponent"
      >
        <StripeElement
          type="payment"
          :options="paymentElementOptions"
          ref="paymentComponent"
        />
      </StripeElements>
    </div>
    <p v-else-if="!stripePublicKey" class="pay__notice" role="alert">
      {{ t("checkout.paymentUnavailable") }}
    </p>

    <div class="pay__cta">
      <AtomsButtonCTA
        @click="confirmAndPay"
        :type="isPaying ? 'disabled' : 'primary'"
        :text="isPaying ? t('checkout.actions.paying') : t('checkout.actions.confirmAndPay')"
        :aria-busy="isPaying"
      >
        <Icon name="heroicons:lock-closed-20-solid" size="18" />
      </AtomsButtonCTA>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, type PropType } from "vue";
import type { CheckoutFormData } from "~/pages/checkout.vue";
import type { CheckoutLineIssue, CheckoutReservation } from "~/types/shop";
import {
  elementsOptions,
  stripeOptions,
  paymentElementOptions,
} from "~/service/StripeConfig";
import { useCartStore } from "~/stores/cart";
import { PENDING_ORDER_STORAGE_KEY } from "~/data/const";

type ShippingOption = { id?: string | null; label: string; price: number };
type OpenIntent = {
  paymentIntentId: string;
  clientSecret: string;
  fingerprint: string;
};

/** Stripe non accetta pagamenti in euro sotto i 50 centesimi. */
const MIN_AMOUNT_CENTS = 50;

const { t } = useI18n();
const config = useRuntimeConfig();
const cart = useCartStore();
const { createCheckoutIntent } = useShop();
const { handleError, notify } = useErrorHandler();

const stripePublicKey = config.public.STRIPE_PUBLIC_KEY;
const purchaseCompletedUrl = config.public.PURCHASE_COMPLETED_URL;

const props = defineProps({
  shippingOption: { type: Object as PropType<ShippingOption | null>, default: null },
  isCheckoutValid: { type: Boolean, required: true, default: false },
  /** Totale che il cliente ha davanti, in centesimi: è quello che si addebita. */
  amountCents: { type: Number, required: true },
  userData: { type: Object as PropType<CheckoutFormData | null>, default: null },
});

const emits = defineEmits<{
  (e: "invalidForm"): void;
  (e: "stockIssues", issues: CheckoutLineIssue[]): void;
  (e: "priceChanged", totals: CheckoutReservation["totals"]): void;
}>();

/**
 * Stesse opzioni di StripeConfig, cambia solo l'aspetto: il tema "stripe"
 * (bianco, accenti blu) sul pannello notturno sembrava un modulo incollato
 * da un altro sito. Qui i colori del brand, con valori pieni perché Stripe
 * non accetta trasparenze nelle variabili.
 */
const nightAppearance = {
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
};

// Il modulo di Stripe nasce con l'importo vero (lo mostrano anche Apple Pay e
// Google Pay) e si aggiorna quando cambiano spedizione o coupon.
const elementsOptionsForAmount = {
  ...elementsOptions,
  amount: Math.max(props.amountCents, MIN_AMOUNT_CENTS),
  appearance: nightAppearance,
};

const elementsComponent = ref<any>(null);
const paymentComponent = ref<any>(null);
const isPaying = ref(false);
const openIntent = ref<OpenIntent | null>(null);

watch(
  () => props.amountCents,
  (amount) => {
    if (amount >= MIN_AMOUNT_CENTS) {
      elementsComponent.value?.elements?.update({ amount });
    }
  },
);

const readStoredIntentId = () => {
  try {
    return JSON.parse(sessionStorage.getItem(PENDING_ORDER_STORAGE_KEY) ?? "null")
      ?.paymentIntentId as string | undefined;
  } catch {
    return undefined;
  }
};

const compact = (value: string) => value.replace(/[\s.\-/()]/g, "").toUpperCase();

/** Dati che il cliente ha compilato, nella forma che si aspetta il CMS. */
function buildCustomerPayload(form: CheckoutFormData) {
  const company = form.invoiceKind === "company";
  return {
    customer: {
      name: form.name.trim(),
      surname: form.surname.trim(),
      email: form.email.trim(),
      phone: compact(form.phone),
    },
    address: {
      street: form.streetAndHouseNumber.trim(),
      city: form.city.trim(),
      zip: form.cap.trim(),
      province: form.province,
      country: "IT",
    },
    invoice: form.iWantTheInvoice
      ? {
          kind: form.invoiceKind,
          companyName: company ? form.invoiceCompanyName.trim() : "",
          taxCode: compact(form.invoiceTaxCode),
          vatNumber: company ? compact(form.invoiceVatNumber) : "",
          sdiCode: company ? compact(form.invoiceSdiCode) : "",
          pec: company ? form.invoicePec.trim() : "",
        }
      : null,
  };
}

/**
 * Prenota la merce e apre il pagamento, solo ora che il cliente paga.
 *
 * Aprirlo all'ingresso nel checkout bloccava merce per 15 minuti a ogni
 * visita e fissava la spedizione e il coupon di quel momento. Qui la
 * prenotazione porta con sé spedizione, coupon e dati scelti adesso; se nel
 * frattempo qualcosa è cambiato, il pagamento aperto prima si annulla.
 */
async function ensureIntent(
  payload: Omit<Parameters<typeof createCheckoutIntent>[0], "previousPaymentIntentId">,
) {
  const fingerprint = JSON.stringify(payload);
  if (openIntent.value?.fingerprint === fingerprint) return openIntent.value;

  const result = await createCheckoutIntent({
    ...payload,
    previousPaymentIntentId: openIntent.value?.paymentIntentId ?? readStoredIntentId(),
  });

  if (!result.ok) {
    if (result.alreadyPaid && result.paymentIntentId) {
      await navigateTo(`/acquisto-completato?payment_intent=${result.paymentIntentId}`);
      return null;
    }
    if (result.priceChanged && result.totals) {
      emits("priceChanged", result.totals);
      await cart.revalidate();
      notify(t("checkout.priceChanged"), "warning");
      return null;
    }
    if (result.couponError) {
      cart.removeCoupon();
      cart.couponError = result.couponError;
      notify(t("checkout.couponNoLongerValid", { reason: result.couponError }), "warning");
      return null;
    }
    emits("stockIssues", result.issues ?? []);
    notify(t("cart.stockChanged"), "warning");
    return null;
  }

  openIntent.value = {
    paymentIntentId: result.paymentIntentId,
    clientSecret: result.clientSecret,
    fingerprint,
  };
  sessionStorage.setItem(
    PENDING_ORDER_STORAGE_KEY,
    JSON.stringify({ paymentIntentId: result.paymentIntentId }),
  );
  return openIntent.value;
}

const confirmAndPay = async () => {
  if (isPaying.value) return;
  if (!props.isCheckoutValid || !props.userData || !props.shippingOption?.id) {
    emits("invalidForm");
    notify(t("checkout.completeForm"), "warning");
    return;
  }

  const stripeInstance = elementsComponent.value?.instance;
  const elements = elementsComponent.value?.elements;
  if (!stripeInstance || !elements) {
    notify(t("checkout.paymentUnavailable"), "error");
    return;
  }

  isPaying.value = true;
  try {
    // L'importo del modulo deve essere quello che si sta per addebitare,
    // anche se il totale è cambiato prima che Stripe fosse pronto.
    await elements.update({ amount: props.amountCents });

    // Prima si convalida il modulo di Stripe (numero carta, scadenza...): se
    // è incompleto non ha senso prenotare la merce. Gli errori li mostra lui.
    const { error: submitError } = await elements.submit();
    if (submitError) return;

    const intent = await ensureIntent({
      lines: cart.lines.map((line) => ({
        variantId: line.variantId,
        quantity: line.quantity,
      })),
      shippingMethodId: props.shippingOption.id,
      couponCode: cart.couponCode || null,
      expectedTotalCents: props.amountCents,
      ...buildCustomerPayload(props.userData),
    });
    if (!intent) return;

    const { error } = await stripeInstance.confirmPayment({
      elements,
      clientSecret: intent.clientSecret,
      confirmParams: { return_url: purchaseCompletedUrl },
    });

    // Si arriva qui solo se il pagamento non è partito (carta rifiutata,
    // autenticazione annullata...): il PaymentIntent resta valido e il
    // cliente può riprovare, anche con un'altra carta.
    if (error) {
      notify(error.message || t("checkout.paymentFailed"), "error");
    }
  } catch (error) {
    handleError("Checkout error", error);
  } finally {
    isPaying.value = false;
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

.pay__notice {
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid rgba(255, 210, 122, 0.35);
  background: rgba(255, 210, 122, 0.08);
  font-size: 14px;
  line-height: 1.5;
  color: var(--im-ink);
}

@media (min-width: 640px) {
  .pay__cta {
    max-width: 360px;
  }
}
</style>
