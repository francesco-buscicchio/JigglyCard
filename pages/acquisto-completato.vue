<template>
  <div class="done-page">
    <!-- Attesa della conferma: un'orbita che gira, annunciata come stato. -->
    <div
      v-if="state === 'confirming'"
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

    <MoleculesThankYou v-else-if="state === 'confirmed'" type="order">
      <p v-if="orderNumber" class="order-ticket">
        <span class="order-ticket__label">{{ t("checkout.orderNumber") }}:</span>
        <strong class="order-ticket__value">{{ orderNumber }}</strong>
      </p>
      <p v-if="maskedEmail" class="state__text state__text--note">
        {{ t("checkout.emailSentTo", { email: maskedEmail }) }}
      </p>
    </MoleculesThankYou>

    <div v-else-if="state === 'processing'" class="state" role="status">
      <span class="state__icon state__icon--info" aria-hidden="true">
        <Icon name="heroicons:clock-20-solid" size="28" />
      </span>
      <h2 class="state__title">{{ t("checkout.processingTitle") }}</h2>
      <p class="state__text">{{ t("checkout.processingText") }}</p>
    </div>

    <div v-else-if="state === 'failed'" class="state state--error" role="alert">
      <span class="state__icon" aria-hidden="true">
        <Icon name="heroicons:x-circle-20-solid" size="28" />
      </span>
      <h2 class="state__title">{{ t("checkout.paymentFailedTitle") }}</h2>
      <p class="state__text">{{ t("checkout.paymentFailedText") }}</p>
      <NuxtLink to="/checkout" class="state__link">
        <Icon name="heroicons:arrow-left-20-solid" size="16" />
        {{ t("checkout.backToCheckout") }}
      </NuxtLink>
    </div>

    <div v-else-if="state === 'error'" class="state state--error" role="alert">
      <span class="state__icon" aria-hidden="true">
        <Icon name="heroicons:exclamation-triangle-20-solid" size="28" />
      </span>
      <h2 class="state__title">{{ t("checkout.confirmFailed") }}</h2>
      <p class="state__text">{{ errorMessage }}</p>
    </div>

    <!-- Pagina aperta senza un pagamento (link diretto, segnalibro): niente
         "ordine confermato" se un ordine non c'è. -->
    <div v-else class="state">
      <h2 class="state__title">{{ t("checkout.nothingToConfirm") }}</h2>
      <NuxtLink to="/" class="state__link">
        {{ t("checkout.thanks.backHome") }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { PENDING_ORDER_STORAGE_KEY } from "~/data/const";
import { useCartStore } from "~/stores/cart";

type PageState = "confirming" | "confirmed" | "processing" | "failed" | "error" | "none";

const { t } = useI18n();
const route = useRoute();
const cart = useCartStore();
const { confirmOrder } = useShop();

const state = ref<PageState>("confirming");
const orderNumber = ref("");
const maskedEmail = ref("");
const errorMessage = ref("");

/** Il pagamento è chiuso (riuscito o in arrivo): carrello e pagamento aperto si azzerano. */
const closeCheckout = () => {
  sessionStorage.removeItem(PENDING_ORDER_STORAGE_KEY);
  cart.hydrate();
  cart.clear();
};

/**
 * Chiude l'ordine dopo il ritorno da Stripe.
 *
 * Il pagamento viene verificato lato server recuperando il PaymentIntent: la
 * pagina non può dichiarare pagato un ordine da sola. La creazione è idempotente
 * sul PaymentIntent, quindi un refresh non genera un secondo ordine.
 */
onMounted(async () => {
  const paymentIntentId = String(route.query.payment_intent ?? "");
  if (!paymentIntentId) {
    state.value = "none";
    return;
  }

  try {
    const result = await confirmOrder(paymentIntentId);

    if (result.status === "confirmed") {
      orderNumber.value = result.orderNumber;
      maskedEmail.value = result.email;
      closeCheckout();
    } else if (result.status === "processing") {
      closeCheckout();
    }
    // Pagamento non riuscito: il carrello resta com'è, per riprovare.
    state.value = result.status;
  } catch (error: any) {
    errorMessage.value =
      error?.data?.statusMessage ?? error?.statusMessage ?? t("checkout.genericError");
    state.value = "error";
  }
});

useSeoMeta({ robots: "noindex, nofollow" });
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

.state__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 700;
  color: var(--im-pink);
}

.state__link:hover {
  color: var(--im-ink);
}

.state__text--note {
  margin: 16px auto 0;
  font-size: 15px;
}

.state__icon--info {
  background: linear-gradient(135deg, #c8f1fa, var(--im-teal));
  box-shadow: 0 14px 36px -10px rgba(92, 200, 224, 0.6);
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
