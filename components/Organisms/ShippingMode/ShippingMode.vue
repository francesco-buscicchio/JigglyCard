<template>
  <div class="summary">
    <p class="im-eyebrow summary__kicker">
      <span class="summary__pulse" aria-hidden="true"></span>
      {{ t("cart.summary.title") }}
    </p>

    <!-- Spedizione: le opzioni sono tessere selezionabili, il radio resta
         quello nativo (tastiera e lettori di schermo invariati). -->
    <section class="summary__block" :aria-labelledby="shippingTitleId">
      <h2 :id="shippingTitleId" class="summary__title">
        <Icon name="heroicons:truck-20-solid" size="18" class="summary__title-icon" />
        {{ t("cart.shipping.heading") }}
      </h2>

      <div
        v-if="shippingOptions.length > 0"
        class="ship-options"
        role="radiogroup"
        :aria-labelledby="shippingTitleId"
      >
        <AtomsRadioButton
          v-for="option in shippingOptions"
          :key="option.id"
          class="ship-option"
          :id="option.id"
          :value="option"
          :selectedValue="selectedOption?.id"
          name="shippingMethod"
          @update:modelValue="updateSelectedOption"
        >
          <template #label>
            <span class="ship-option__name">{{ option.label }}</span>
            <span class="ship-option__price">{{ Number(option.price).toFixed(2) }} €</span>
          </template>
        </AtomsRadioButton>
      </div>
      <p class="summary__note">
        {{ t("cart.shipping.note") }}
      </p>
    </section>

    <div class="summary__divider" aria-hidden="true"></div>

    <!-- Codice promo: campo e bottone nella stessa pillola, il messaggio
         d'errore sotto, fuori dalla pillola. -->
    <div class="coupon">
      <p class="coupon__question">{{ t("cart.shipping.couponQuestion") }}</p>
      <div class="coupon__group" :class="{ 'has-error': !!couponData.error }">
        <MoleculesContainerInput
          class="coupon__field"
          :status="couponData.error === '' ? 'newsletter' : 'error'"
          :placeholder="placeholder"
          @inputUpdate="updateCouponCode($event)"
          :notValidMessage="couponData.error"
          :isValid="couponData.error === ''"
        />
        <AtomsButtonCTA
          type="secondary"
          class="coupon__apply"
          :text="codeApply"
          @click="applyCoupon()"
        />
      </div>
    </div>

    <div class="summary__totals">
      <div class="coupon-applied" v-if="couponData.value > 0">
        <span class="coupon-applied__chip">
          <Icon name="heroicons:ticket-20-solid" size="16" class="coupon-applied__icon" />
          <span class="coupon-applied__text">
            {{ t("cart.shipping.couponLabel") }}:
            <strong>{{ couponData.name }}</strong>
          </span>
          <button
            type="button"
            class="coupon-applied__remove"
            :aria-label="t('cart.shipping.removeCoupon')"
            :title="t('cart.shipping.removeCoupon')"
            @click="removeCoupon"
          >
            <Icon name="heroicons:x-mark-20-solid" size="16" />
          </button>
        </span>
        <span class="coupon-applied__value">-{{ Number(couponData.value).toFixed(2) }} €</span>
      </div>

      <div class="summary__total">
        <span class="summary__total-label">{{ t("cart.shipping.total") }}</span>
        <span class="summary__total-value">
          {{ total }}<span class="summary__total-currency">€</span>
        </span>
      </div>
    </div>

    <div class="summary__actions">
      <AtomsButtonCTA
        type="primary"
        :text="t('cart.shipping.buyCta')"
        @button-clicked="goTo(PATH.CHECKOUT)"
      >
        <Icon name="heroicons:arrow-right-20-solid" size="18" />
      </AtomsButtonCTA>
      <AtomsButtonCTA
        type="text"
        class="summary__back"
        :text="t('cart.shipping.back')"
        @button-clicked="goBack"
      >
        <Icon
          name="heroicons:arrow-left-20-solid"
          size="16"
          class="summary__back-icon"
        />
      </AtomsButtonCTA>
    </div>

    <div class="summary__help">
      <span class="summary__help-icon" aria-hidden="true">
        <Icon name="heroicons:lifebuoy-20-solid" size="18" />
      </span>
      <MoleculesTextViewer class="summary__help-text">
        <template v-slot:title>
          {{ t("cart.help.title") }}
        </template>
        <template v-slot:content>
          {{ t("cart.help.content") }}
        </template>
      </MoleculesTextViewer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { goBack } from "@/utils/navigationUtils";
import { PATH } from "~/data/const";
import { goTo } from "@/utils/navigationUtils";
const { t } = useI18n();
const { getShippingMethods } = useShop();
import { type CartItem } from "~/composables/useCart";
import { useCartStore } from "~/stores/cart";

type ShippingOption = {
  id: string;
  label: string;
  price: number;
};

type NormalizedShippingMethod = {
  id: string;
  name: string;
  price: number;
  maxWeight: number;
  maxValue: number;
  international: boolean;
};

const props = defineProps<{
  products: CartItem[];
  totalCart: number | string;
  couponData: any;
  isInternational?: boolean;
}>();

const emit = defineEmits(["couponApplied", "removeCoupon"]);
const isDesktopView = isDesktop();
const shippingTitleId = useId();
const runtimeConfig = useRuntimeConfig();
const couponCode = ref("");
const shippingMethods = ref<any[]>([]);
const selectedOption = ref<ShippingOption | null>(null);

const cartValue = computed(() => Number(props.totalCart) || 0);
const cartWeight = computed(() => {
  return (props.products || []).reduce((total, item) => {
    const weight = Number((item as any).weight ?? (item as any).productWeight);
    if (!Number.isFinite(weight)) return total;
    return total + weight * Number(item.selectedQuantity || 0);
  }, 0);
});

const isInternational = computed(() => Boolean(props.isInternational));

function parseNumber(value: any) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function parseBoolean(value: any) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return Boolean(value);
}

function normalizeShippingMethod(raw: any): NormalizedShippingMethod {
  const name = raw.name ?? raw.Name ?? "Spedizione";
  const price = parseNumber(raw.price ?? raw.Price ?? 0);
  const maxWeight = parseNumber(
    raw.max_weight ?? raw.Max_Weight ?? raw.maxWeight ?? 0
  );
  const maxValue = parseNumber(
    raw.max_value ?? raw.Max_Value ?? raw.maxValue ?? 0
  );
  const international = parseBoolean(
    raw.international ?? raw.International ?? false
  );
  const id = String(raw.documentId ?? raw.id ?? `${name}-${price}`);
  return {
    id,
    name,
    price,
    maxWeight,
    maxValue,
    international,
  };
}

const shippingOptions = computed(() => {
  const normalized = shippingMethods.value.map(normalizeShippingMethod);
  const eligible = normalized.filter((method) => {
    if (method.international !== isInternational.value) return false;
    if (method.maxValue > 0 && cartValue.value > method.maxValue) return false;
    if (method.maxWeight > 0 && cartWeight.value > method.maxWeight)
      return false;
    return true;
  });

  const byName = new Map<string, ShippingOption>();
  eligible.forEach((method) => {
    const existing = byName.get(method.name);
    if (!existing || method.price < existing.price) {
      byName.set(method.name, {
        id: method.id,
        label: method.name,
        price: method.price,
      });
    }
  });

  return Array.from(byName.values()).sort((a, b) => a.price - b.price);
});

watch(
  shippingOptions,
  (options) => {
    if (!options.length) {
      selectedOption.value = null;
      return;
    }
    if (!selectedOption.value) {
      selectedOption.value = options[0];
      return;
    }
    const exists = options.some((opt) => opt.id === selectedOption.value?.id);
    if (!exists) selectedOption.value = options[0];
  },
  { immediate: true }
);

const updateCouponCode = (event: string) => {
  couponCode.value = event;
};

// Il totale comprende la spedizione scelta, come al checkout: prima mostrava
// solo la merce e al passo dopo il cliente si trovava un importo più alto.
const cartStore = useCartStore();
const total = computed(() => {
  const shipping = cartStore.couponFreeShipping
    ? 0
    : Number(selectedOption.value?.price ?? 0);
  return Math.max(
    0,
    Number(props.totalCart) - Number(props.couponData.value) + shipping,
  ).toFixed(2);
});

const applyCoupon = () => {
  emit("couponApplied", couponCode.value);
};

const removeCoupon = () => {
  emit("removeCoupon");
};

const placeholder = computed(() => {
  return isDesktopView.value
    ? t("cart.shipping.couponLabel")
    : t("cart.shipping.couponPlaceholder");
});
const codeApply = computed(() => {
  return isDesktopView.value
    ? t("cart.shipping.applyDesktop")
    : t("cart.shipping.apply");
});

function updateSelectedOption(option: ShippingOption) {
  selectedOption.value = option;
}

async function loadShippingMethods() {
  try {
    const { items } = await getShippingMethods();
    // `normalizeShippingMethod` lavora in euro; il CMS espone i centesimi.
    shippingMethods.value = items.map((method) => ({
      id: method.id,
      name: method.name,
      price: method.priceCents / 100,
      max_weight: method.maxWeight ?? 0,
      max_value: (method.maxValueCents ?? 0) / 100,
      international: method.international,
    }));
  } catch (_) {
    shippingMethods.value = [];
  }
}

onMounted(loadShippingMethods);
</script>

<style scoped>
/* Pannello di vetro del riepilogo carrello: è lui il "box", la pagina decide
   solo dove sta (e su desktop lo tiene fermo mentre si scorre). */
.summary {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 22px 18px;
  border-radius: 28px;
  border: 1px solid var(--im-line);
  background:
    radial-gradient(120% 70% at 100% 0%, rgba(92, 200, 224, 0.1), transparent 60%),
    radial-gradient(120% 70% at 0% 100%, rgba(236, 145, 160, 0.1), transparent 60%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.025));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 30px 60px -40px rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

@media (min-width: 768px) {
  .summary {
    padding: 28px 26px;
  }
}

.summary__kicker {
  font-size: 11px;
}

/* Spia accesa accanto al titolo, come sui pannelli della home. */
.summary__pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--im-teal);
  box-shadow: 0 0 10px var(--im-teal);
  animation: summary-pulse 2.4s ease-in-out infinite;
}

.summary__block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary__title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--im-ink);
}

.summary__title-icon {
  color: var(--im-pink);
}

/* --- Opzioni di spedizione ------------------------------------------- */

.ship-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ship-option {
  gap: 12px;
  padding: 13px 16px;
  border-radius: 16px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.03);
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.ship-option:hover {
  border-color: rgba(255, 255, 255, 0.22);
}

.ship-option:has(input:checked) {
  border-color: rgba(236, 145, 160, 0.6);
  background: linear-gradient(135deg, rgba(247, 210, 216, 0.12), rgba(236, 145, 160, 0.04));
  box-shadow: 0 10px 28px -18px rgba(236, 145, 160, 0.8);
}

/* L'anello di focus va sulla tessera intera, non solo sul pallino. */
.ship-option:has(input:focus-visible) {
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
}

.ship-option__name {
  flex: 1;
  min-width: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--im-ink);
  cursor: inherit;
}

.ship-option__price {
  flex: none;
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-size: 14px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--im-pink);
  cursor: inherit;
}

.summary__note {
  font-size: 12px;
  line-height: 1.5;
  color: var(--im-muted);
}

/* Filo sfumato al posto dei vecchi bordi spessi. */
.summary__divider {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(247, 210, 216, 0.35) 25%,
    rgba(92, 200, 224, 0.35) 75%,
    transparent
  );
}

/* --- Codice promo ---------------------------------------------------- */

.coupon__question {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--im-ink);
}

/*
 * Griglia a due righe: nella prima campo e bottone, nella seconda l'eventuale
 * errore. La pillola è il ::before steso sulla prima riga, così il messaggio
 * resta fuori e il bottone non può più uscire dal bordo.
 * `display: contents` sul campo fa partecipare alla griglia i suoi figli
 * (input ed errore), che stanno in ContainerInput.
 */
.coupon__group {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
}

.coupon__group::before {
  content: "";
  grid-row: 1;
  grid-column: 1 / -1;
  align-self: stretch;
  border-radius: 999px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.04);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.coupon__group:hover::before {
  border-color: rgba(255, 255, 255, 0.22);
}

.coupon__group:focus-within::before {
  border-color: var(--im-pink-strong);
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 0 0 4px rgba(236, 145, 160, 0.16);
}

.coupon__group.has-error::before {
  border-color: rgba(255, 128, 150, 0.65);
}

.coupon__field {
  display: contents;
}

.coupon__field > :deep(.label) {
  display: none;
}

.coupon__field > :deep(.relative) {
  grid-row: 1;
  grid-column: 1;
  min-width: 0;
}

/* Il campo diventa trasparente: bordo e alone sono quelli della pillola. */
.coupon__group .coupon__field :deep(.jc-input),
.coupon__group .coupon__field :deep(.jc-input:focus),
.coupon__group .coupon__field :deep(.jc-input:hover) {
  height: 50px;
  padding: 0 8px 0 20px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  box-shadow: none;
  font-size: 16px;
  text-overflow: ellipsis;
}

/* Il colore inline di ContainerInput è un rosso puro, illeggibile sul blu
   notte: serve !important per batterlo. */
.coupon__field > :deep(div[style]) {
  grid-row: 2;
  grid-column: 1 / -1;
  padding: 8px 20px 0;
  font-size: 13px !important;
  line-height: 1.4;
  color: #ff9aab !important;
}

.coupon__group .coupon__apply {
  grid-row: 1;
  grid-column: 2;
  width: auto;
  min-height: 40px;
  margin: 5px 5px 5px 0;
  padding: 0 18px;
  font-size: 14px;
}

/* Su desktop il testo è "applica", minuscolo. */
.coupon__group .coupon__apply :deep(span) {
  display: inline-block;
}

.coupon__group .coupon__apply :deep(span)::first-letter {
  text-transform: uppercase;
}

/* --- Totale ---------------------------------------------------------- */

.summary__totals {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 20px;
  background: rgba(7, 10, 31, 0.45);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
}

.coupon-applied {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.coupon-applied__chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 4px 4px 4px 12px;
  border-radius: 999px;
  border: 1px solid rgba(92, 200, 224, 0.35);
  background: rgba(92, 200, 224, 0.08);
}

.coupon-applied__icon {
  flex: none;
  color: var(--im-teal);
}

.coupon-applied__text {
  min-width: 0;
  overflow: hidden;
  font-size: 13px;
  line-height: 1.3;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--im-ink);
}

.coupon-applied__text strong {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  letter-spacing: 0.06em;
}

.coupon-applied__remove {
  flex: none;
  display: inline-grid;
  place-content: center;
  width: 26px;
  height: 26px;
  border-radius: 999px;
  color: var(--im-muted);
  cursor: pointer;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}

.coupon-applied__remove:hover {
  color: var(--im-ink);
  background: rgba(255, 255, 255, 0.1);
}

.coupon-applied__remove:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 1px;
}

.coupon-applied__value {
  flex: none;
  font-weight: 700;
  font-size: 14px;
  font-variant-numeric: tabular-nums;
  color: var(--im-teal);
}

.summary__total {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.summary__total-label {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--im-muted);
}

.summary__total-value {
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-size: 30px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  color: var(--im-ink);
}

.summary__total-currency {
  margin-left: 4px;
  font-family: inherit;
  font-size: 0.6em;
  color: var(--im-pink);
}

/* --- Azioni ---------------------------------------------------------- */

.summary__actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary__back-icon {
  order: -1;
}

/* --- Assistenza ------------------------------------------------------ */

.summary__help {
  display: flex;
  gap: 12px;
  padding-top: 18px;
  border-top: 1px solid var(--im-line);
}

.summary__help-icon {
  flex: none;
  display: inline-grid;
  place-content: center;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.05);
  color: var(--im-teal);
}

.summary__help .summary__help-text {
  margin: 0;
}

.summary__help-text :deep(h5) {
  padding-bottom: 4px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--im-ink);
}

.summary__help-text :deep(p) {
  font-size: 13px;
  line-height: 1.55;
  color: var(--im-muted);
}

@keyframes summary-pulse {
  50% {
    opacity: 0.35;
  }
}

@media (prefers-reduced-motion: reduce) {
  .summary__pulse {
    animation: none;
  }

  .ship-option,
  .coupon__group::before {
    transition: none;
  }
}
</style>
