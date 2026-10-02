<template>
  <div class="done-page">
    <!-- Attesa della conferma: un'orbita che gira, annunciata come stato. -->
    <div
      v-if="isConfirming"
      class="state state--wait"
      role="status"
      aria-live="polite"
    >
      <span class="state__loader" aria-hidden="true">
        <span class="state__orbit"></span>
        <span class="state__core"></span>
      </span>
      <p class="state__text">{{ t("checkout.confirming") }}</p>
    </div>

    <div v-else-if="errorMessage" class="state state--error" role="alert">
      <span class="state__icon" aria-hidden="true">
        <Icon name="heroicons:exclamation-triangle-20-solid" size="28" />
      </span>
      <h2 class="state__title">{{ t("checkout.confirmFailed") }}</h2>
      <p class="state__text">{{ errorMessage }}</p>
    </div>

    <template v-else>
      <MoleculesThankYou type="order">
        <p v-if="orderNumber" class="order-ticket">
          <span class="order-ticket__label">{{ t("checkout.orderNumber") }}:</span>
          <strong class="order-ticket__value">{{ orderNumber }}</strong>
        </p>
      </MoleculesThankYou>
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

<style scoped>
.done-page {
  min-height: 60vh;
  padding-top: 16px;
}

/* Attesa ed errore: lo stesso pannello di vetro del grazie, più piccolo. */
.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  width: calc(100% - 40px);
  max-width: 560px;
  margin: 24px auto 64px;
  padding: 48px 24px;
  text-align: center;
  border-radius: 28px;
  border: 1px solid var(--im-line);
  background:
    radial-gradient(70% 60% at 50% 0%, rgba(92, 200, 224, 0.14), transparent 70%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.state--error {
  border-color: rgba(255, 128, 150, 0.35);
  background:
    radial-gradient(70% 60% at 50% 0%, rgba(224, 81, 104, 0.18), transparent 70%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
}

.state__text {
  max-width: 440px;
  font-size: 16px;
  line-height: 1.6;
  color: var(--im-muted);
}

.state__title {
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-size: clamp(20px, 3vw, 26px);
  font-weight: 700;
  line-height: 1.3;
  color: var(--im-ink);
}

.state__icon {
  display: inline-grid;
  place-content: center;
  width: 64px;
  height: 64px;
  border-radius: 20px;
  color: #2a0a14;
  background: linear-gradient(135deg, #ffc2cc, var(--im-rose));
  box-shadow: 0 14px 36px -10px rgba(224, 81, 104, 0.7);
}

/* Orbita: anello sfumato che ruota attorno a un nucleo luminoso. Il nucleo
   è fratello dell'anello e non figlio, altrimenti la maschera lo taglia. */
.state__loader {
  position: relative;
  width: 64px;
  height: 64px;
}

.state__orbit {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(92, 200, 224, 0.9) 120deg,
    var(--im-pink) 240deg,
    transparent 360deg
  );
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0);
  mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0);
  animation: state-spin 1.1s linear infinite;
}

.state__core {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--im-pink);
  box-shadow: 0 0 16px var(--im-pink);
}

.state--wait .state__text {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 13px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--im-ink);
}

/* Numero d'ordine come un biglietto: etichetta mono e codice in evidenza. */
.order-ticket {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 6px 12px;
  max-width: 100%;
  margin-top: 24px;
  padding: 10px 18px;
  border-radius: 999px;
  border: 1px dashed rgba(247, 210, 216, 0.45);
  background: rgba(7, 10, 31, 0.45);
}

.order-ticket__label {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--im-muted);
}

.order-ticket__value {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.08em;
  overflow-wrap: anywhere;
  color: var(--im-pink);
}

@keyframes state-spin {
  to {
    transform: rotate(360deg);
  }
}

/* Senza rotazione l'anello resta visibile e pulsa piano. */
@media (prefers-reduced-motion: reduce) {
  .state__orbit {
    animation: state-breathe 2.4s ease-in-out infinite;
  }
}

@keyframes state-breathe {
  50% {
    opacity: 0.5;
  }
}
</style>
