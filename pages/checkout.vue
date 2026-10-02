<template>
  <div class="checkout-page im-container">
    <MoleculesBreadcrumb />

    <header class="co-head">
      <h1 class="im-display co-head__title">{{ t("checkout.title") }}</h1>

      <!-- Le tre tappe dell'acquisto: il carrello è fatto, qui si compilano
           spedizione e pagamento. -->
      <ol class="steps">
        <li class="steps__item is-done">
          <span class="steps__dot">
            <Icon name="heroicons:check-20-solid" size="16" />
          </span>
          <span class="steps__label">{{ t("cart.title") }}</span>
        </li>
        <li class="steps__item is-current" aria-current="step">
          <span class="steps__dot">02</span>
          <span class="steps__label">{{ t("checkout.shippingInfo") }}</span>
        </li>
        <li class="steps__item">
          <span class="steps__dot">03</span>
          <span class="steps__label">{{ t("payments.methodsTitle") }}</span>
        </li>
      </ol>
    </header>

    <div class="co-layout">
      <div class="co-main">
        <section class="co-panel" aria-labelledby="co-shipping-info">
          <h2 id="co-shipping-info" class="co-panel__title">
            <Icon name="heroicons:map-pin-20-solid" size="20" class="co-panel__icon" />
            {{ t("checkout.shippingInfo") }}
          </h2>
          <OrganismsCheckoutForm @updateFormStatus="handleFormStatus" />
        </section>

        <section class="co-panel">
          <OrganismsSelectOptions
            :shippingOptions="shippingOptions"
            :selectedOption="selectedShippingOption"
            @update:selectedOption="updateSelectedOption"
          />
        </section>

        <div v-if="stockIssues.length" class="stock-alert" role="alert">
          <span class="stock-alert__icon">
            <Icon name="heroicons:exclamation-triangle-20-solid" size="20" />
          </span>
          <div class="min-w-0">
            <p class="stock-alert__title">{{ t("cart.stockChanged") }}</p>
            <ul class="stock-alert__list">
              <li v-for="issue in stockIssues" :key="issue.variantId">
                <span class="stock-alert__name">{{ issue.variantId }}</span> —
                {{ t("cart.stockRequested") }} {{ issue.requested }},
                {{ t("cart.stockAvailable") }} {{ issue.available }}
              </li>
            </ul>
            <NuxtLink :to="PATH.CART" class="stock-alert__link">
              <Icon name="heroicons:arrow-left-20-solid" size="16" />
              {{ t("cart.shipping.back") }}
            </NuxtLink>
          </div>
        </div>

        <div v-show="isMobileView">
          <OrganismsCartSummary
            :products="products"
            :shipping-cost="selectedShippingOption?.price || 0"
          />
        </div>

        <section class="co-panel co-panel--pay" v-if="totalAmount > 0">
          <OrganismsCheckoutPayment
            :is-checkout-valid="isFormValid"
            :totalAmount="totalAmountWithShipment"
            :userData="formData"
            :shippingOption="selectedShippingOption"
            @stockIssues="stockIssues = $event"
          />
        </section>
      </div>

      <!-- Riepilogo fermo accanto ai pannelli mentre si compila. -->
      <div class="co-aside" v-show="!isMobileView">
        <OrganismsCartSummary
          :products="products"
          :shipping-cost="selectedShippingOption?.price || 0"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { PATH } from "~/data/const";
import type { CheckoutLineIssue } from "~/types/shop";

const { t } = useI18n();
const isMobileView = isMobile();
const { getShippingMethods } = useShop();

export type CheckoutFormData = {
  name: string;
  surname: string;
  email: string;
  cap: string;
  city: string;
  streetAndHouseNumber: string;
  iWantTheInvoice: boolean;
};

const formData = ref<CheckoutFormData | null>(null);
const isFormValid = ref(false);

function handleFormStatus(payload: {
  values: CheckoutFormData;
  isValid: boolean;
}) {
  formData.value = payload.values;
  isFormValid.value = payload.isValid;
}

// I metodi di spedizione arrivano dal CMS: unica fonte, condivisa con la
// pagina carrello, che prima usava una lista diversa da quella hardcoded qui.
const { items: shippingMethods } = await getShippingMethods();
const shippingOptions = shippingMethods.map((method) => ({
  id: method.id,
  label: method.name,
  price: method.priceCents / 100,
}));

const selectedShippingOption = ref(shippingOptions[0]);
const stockIssues = ref<CheckoutLineIssue[]>([]);

function updateSelectedOption(option: any) {
  selectedShippingOption.value = option;
}

const { products, totalCart } = useCart();

const totalAmount = computed(() => Number(totalCart.value) * 100);
const totalAmountWithShipment = computed(() => {
  return Number(totalCart.value) + (selectedShippingOption.value?.price || 0);
});

definePageMeta({
  layout: "default",
});
</script>

<style scoped>
.checkout-page {
  padding-bottom: 64px;
}

/* --- Intestazione --------------------------------------------------- */

.co-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px 32px;
  padding: 18px 0 28px;
}

.co-head__title {
  font-size: clamp(34px, 6vw, 60px);
  line-height: 1;
}

/* --- Tappe dell'acquisto (uguali in carrello.vue) -------------------- */

.steps {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.steps__item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  color: var(--im-muted);
}

.steps__item + .steps__item::before {
  content: "";
  flex: none;
  width: 24px;
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.3));
}

.steps__dot {
  flex: none;
  display: inline-grid;
  place-content: center;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.04);
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 11px;
  font-weight: 600;
}

.steps__label {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 11px;
  line-height: 1.3;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.steps__item.is-current {
  color: var(--im-ink);
}

.steps__item.is-current .steps__dot {
  border-color: transparent;
  color: #2a0a14;
  background: linear-gradient(135deg, #fde4e8, var(--im-pink-strong));
  box-shadow:
    0 0 0 4px rgba(236, 145, 160, 0.14),
    0 0 18px rgba(236, 145, 160, 0.55);
}

.steps__item.is-done .steps__dot {
  border-color: rgba(92, 200, 224, 0.45);
  color: var(--im-teal);
  background: rgba(92, 200, 224, 0.1);
}

.steps__item.is-done + .steps__item::before {
  background: linear-gradient(90deg, rgba(92, 200, 224, 0.5), rgba(236, 145, 160, 0.6));
}

/* Su mobile restano solo i numeri, più l'etichetta della tappa corrente. */
@media (max-width: 639px) {
  .steps__item:not(.is-current) .steps__label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
}

/* --- Impaginazione --------------------------------------------------- */

.co-layout {
  display: grid;
  gap: 20px;
}

@media (min-width: 1024px) {
  .co-layout {
    grid-template-columns: minmax(0, 1fr) 360px;
    gap: 32px;
    align-items: start;
  }

  .co-aside {
    position: sticky;
    top: 112px;
  }
}

@media (min-width: 1280px) {
  .co-layout {
    grid-template-columns: minmax(0, 1fr) 400px;
    gap: 40px;
  }
}

.co-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
  counter-reset: co-step;
}

.co-aside {
  min-width: 0;
}

/* Pannelli numerati: il numero arriva da un contatore CSS, così i
   componenti dentro non devono sapere in che ordine stanno. */
.co-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px 18px;
  border-radius: 28px;
  border: 1px solid var(--im-line);
  background:
    radial-gradient(90% 60% at 100% 0%, rgba(92, 200, 224, 0.07), transparent 60%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.025));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  counter-increment: co-step;
}

.co-panel::before {
  content: counter(co-step, decimal-leading-zero);
  position: absolute;
  top: 22px;
  right: 22px;
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--im-muted);
  opacity: 0.7;
}

@media (min-width: 768px) {
  .co-panel {
    padding: 30px 30px 32px;
  }

  .co-panel::before {
    top: 30px;
    right: 30px;
  }
}

/* Il pannello del pagamento ha un filo rosa in alto: è l'ultimo passo. */
.co-panel--pay {
  border-color: rgba(236, 145, 160, 0.28);
  background:
    radial-gradient(90% 60% at 0% 0%, rgba(236, 145, 160, 0.12), transparent 60%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.025));
}

.co-panel__title {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-right: 32px;
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-size: 19px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--im-ink);
}

@media (min-width: 1024px) {
  .co-panel__title {
    font-size: 22px;
  }
}

.co-panel__icon {
  flex: none;
  color: var(--im-pink);
}

/* Spazio per il numero del pannello anche sui titoli dei componenti. */
.co-panel :deep(h2) {
  padding-right: 32px;
}

/* --- Avviso scorte --------------------------------------------------- */

.stock-alert {
  display: flex;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 20px;
  border: 1px solid rgba(255, 210, 122, 0.35);
  background: linear-gradient(160deg, rgba(255, 210, 122, 0.12), rgba(255, 210, 122, 0.04));
}

.stock-alert__icon {
  flex: none;
  display: inline-grid;
  place-content: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  color: #2b1d00;
  background: linear-gradient(135deg, #ffe7b0, var(--im-gold));
}

.stock-alert__title {
  padding-bottom: 6px;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.45;
  color: var(--im-ink);
}

.stock-alert__list li {
  font-size: 14px;
  line-height: 1.5;
  overflow-wrap: anywhere;
  color: var(--im-muted);
}

.stock-alert__name {
  font-weight: 600;
  color: var(--im-ink);
}

.stock-alert__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  font-size: 14px;
  font-weight: 700;
  color: var(--im-pink);
  transition: color 0.2s ease;
}

.stock-alert__link:hover {
  color: var(--im-ink);
}

.stock-alert__link:focus-visible {
  border-radius: 6px;
  outline: 2px solid var(--im-teal);
  outline-offset: 3px;
}
</style>
