<template>
  <div>
    <div v-if="isConfirming" class="mx-auto max-w-xl px-6 py-16 text-center">
      <p>{{ t("checkout.confirming") }}</p>
    </div>

    <div
      v-else-if="errorMessage"
      class="mx-auto max-w-xl px-6 py-16 text-center"
    >
      <h2 class="text-accent-500 pb-4">{{ t("checkout.confirmFailed") }}</h2>
      <p>{{ errorMessage }}</p>
    </div>

    <template v-else>
      <MoleculesThankYou type="order" />
      <p v-if="orderNumber" class="pb-10 text-center">
        {{ t("checkout.orderNumber") }}: <strong>{{ orderNumber }}</strong>
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { PENDING_ORDER_STORAGE_KEY } from "~/data/const";
import { useCartStore } from "~/stores/cart";

const { t } = useI18n();
const route = useRoute();
const cart = useCartStore();
const { confirmOrder } = useShop();

const isConfirming = ref(true);
const orderNumber = ref("");
const errorMessage = ref("");

/**
 * Chiude l'ordine dopo il ritorno da Stripe.
 *
 * Il pagamento viene verificato lato server recuperando il PaymentIntent: la
 * pagina non può dichiarare pagato un ordine da sola. La creazione è idempotente
 * sul PaymentIntent, quindi un refresh non genera un secondo ordine.
 */
onMounted(async () => {
  const paymentIntentId = route.query.payment_intent as string | undefined;
  const raw = sessionStorage.getItem(PENDING_ORDER_STORAGE_KEY);

  if (!paymentIntentId || !raw) {
    isConfirming.value = false;
    return;
  }

  try {
    const pending = JSON.parse(raw);
    const result = await confirmOrder({ ...pending, paymentIntentId });

    orderNumber.value = result.orderNumber;
    sessionStorage.removeItem(PENDING_ORDER_STORAGE_KEY);
    cart.clear();
  } catch (error: any) {
    errorMessage.value =
      error?.statusMessage ?? error?.data?.statusMessage ?? t("checkout.genericError");
  } finally {
    isConfirming.value = false;
  }
});
</script>
