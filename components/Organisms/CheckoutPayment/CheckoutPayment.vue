<template>
  <MoleculesToastMessage
    :text="toastData.message"
    :type="toastData.type"
    :trigger-key="toastKey"
  />
  <div class="max-w-[420px]">
    <h5 class="mb-2">{{ t("payments.methodsTitle") }}</h5>

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
        :text="t('checkout.actions.confirmAndPay')"
      />
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
