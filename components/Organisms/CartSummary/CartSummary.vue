<template>
  <section class="sum" :aria-labelledby="titleId">
    <header class="sum__head">
      <h2 :id="titleId" class="sum__title">{{ t("cart.summary.title") }}</h2>
      <span class="sum__count">{{ products.length }}</span>
    </header>

    <!-- Su desktop la lista scorre da sola: il pannello resta fermo accanto
         al form e il totale non deve finire fuori dallo schermo. -->
    <ul class="sum__lines" tabindex="0" :aria-labelledby="titleId">
      <li v-for="product in products" :key="product.id" class="sum__line">
        <span class="sum__thumb">
          <img :src="product.image || defaultCardImage" alt="" loading="lazy" />
        </span>
        <div class="sum__info">
          <p class="sum__name">{{ product.title }}</p>
          <p v-if="product.selectedQuantity > 1" class="sum__code">
            × {{ product.selectedQuantity }}
          </p>
        </div>
        <p class="sum__price">{{ lineTotal(product).toFixed(2) }} €</p>
      </li>
    </ul>

    <div class="sum__divider" aria-hidden="true"></div>

    <div class="sum__row">
      <p class="sum__row-label">
        <Icon name="heroicons:truck-20-solid" size="16" class="sum__row-icon" />
        {{ t("cart.summary.shipping") }}
      </p>
      <p class="sum__row-value" :class="{ 'is-free': props.shippingCost <= 0 }">
        {{ shippingCost }}
      </p>
    </div>

    <div class="sum__total">
      <p class="sum__total-label">{{ t("cart.summary.total") }}</p>
      <p class="sum__total-value">
        {{ finalTotal }}<span class="sum__total-currency">€</span>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, defineProps, type PropType } from "vue";
import type { CartItem } from "~/composables/useCart";
import defaultCardImage from "@/assets/img/default-card-image.png";

const { t } = useI18n();
const titleId = useId();
const props = defineProps({
  products: {
    type: Array as PropType<CartItem[]>,
    required: true,
    validator: (value: CartItem[]) => {
      return Array.isArray(value);
    },
  },
  shippingCost: {
    type: Number,
    required: true,
    validator: (value: number) => {
      return value >= 0;
    },
  },
});

// Prezzo per quantità: sommando solo i prezzi unitari il totale mostrato al
// checkout era sbagliato appena una riga aveva più di un pezzo.
const lineTotal = (product: { price: number; selectedQuantity?: number }) =>
  product.price * (product.selectedQuantity ?? 1);

const totalPrice = computed(() =>
  props.products.reduce((sum, product) => sum + lineTotal(product), 0),
);

const finalTotal = computed(() => {
  return (totalPrice.value + props.shippingCost).toFixed(2);
});

const shippingCost = computed(() => {
  return props.shippingCost > 0
    ? `${props.shippingCost} €`
    : t("cart.summary.free");
});
</script>

<style scoped>
.sum {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  .sum {
    padding: 26px 24px;
  }
}

.sum__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.sum__title {
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--im-ink);
}

.sum__count {
  flex: none;
  display: inline-grid;
  place-content: center;
  min-width: 30px;
  height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid rgba(247, 210, 216, 0.4);
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 12px;
  font-weight: 700;
  color: var(--im-pink);
}

/* --- Righe ----------------------------------------------------------- */

.sum__lines {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0 -6px;
  padding: 2px 6px;
  border-radius: 12px;
}

@media (min-width: 1024px) {
  .sum__lines {
    max-height: 340px;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
  }
}

.sum__lines:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
}

.sum__line {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sum__thumb {
  flex: none;
  width: 40px;
  aspect-ratio: 63 / 88;
  overflow: hidden;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.sum__thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.sum__info {
  flex: 1;
  min-width: 0;
}

.sum__name {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
  overflow-wrap: anywhere;
  color: var(--im-ink);
}

.sum__code {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 11px;
  line-height: 1.4;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--im-muted);
}

.sum__price {
  flex: none;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.35;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  color: var(--im-ink);
}

.sum__divider {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(247, 210, 216, 0.35) 25%,
    rgba(92, 200, 224, 0.35) 75%,
    transparent
  );
}

/* --- Spedizione e totale --------------------------------------------- */

.sum__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.sum__row-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  line-height: 1.4;
  color: var(--im-muted);
}

.sum__row-icon {
  color: var(--im-pink);
}

.sum__row-value {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  white-space: nowrap;
  color: var(--im-ink);
}

/* "Gratis" in evidenza, come un chip. */
.sum__row-value.is-free {
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--im-teal);
  background: rgba(92, 200, 224, 0.12);
  box-shadow: inset 0 0 0 1px rgba(92, 200, 224, 0.35);
}

.sum__total {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px 12px;
  padding: 16px 18px;
  border-radius: 20px;
  background: rgba(7, 10, 31, 0.45);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
}

.sum__total-label {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 12px;
  line-height: 1.4;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--im-muted);
}

.sum__total-value {
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-size: 30px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  color: var(--im-ink);
}

.sum__total-currency {
  margin-left: 4px;
  font-family: inherit;
  font-size: 0.6em;
  color: var(--im-pink);
}
</style>
