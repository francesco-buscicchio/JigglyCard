<template>
  <MoleculesToastMessage
    :text="toastData.message"
    :type="toastData.type"
    :trigger-key="toastKey"
  />
  <!-- Un solo blocco per mobile e desktop: cambia solo l'impaginazione (CSS).
       Prima c'erano due copie, nascoste a turno, di selettore e bottone. -->
  <div v-if="quantityOptions" class="qa">
    <div class="qa__row">
      <div class="qa__field" role="group" :aria-labelledby="labelId">
        <span :id="labelId" class="qa__label">
          {{ t("product.quantity.quantity") }}
        </span>
        <MoleculesPageSorter
          :sortingItems="quantityOptions"
          :selected="quantityRef"
          @handleSorting="updateQuantity"
        />
      </div>

      <p class="qa__stock">
        <span class="qa__stock-dot" aria-hidden="true"></span>
        {{ t("product.quantity.availability") }}:
        {{ quantityOptions.length }} {{ t("product.quantity.pieces") }}
      </p>
    </div>

    <div class="qa__checkout">
      <div class="qa__buy">
        <p class="qa__price">
          <span class="qa__amount">{{ totalPrice }}</span>
          <span class="qa__currency">€</span>
        </p>
        <AtomsButtonCTA
          type="primary"
          :text="t('product.hero.AddToCart')"
          class="qa__cta"
          @click="addToCart"
        >
          <Icon name="heroicons:shopping-bag-20-solid" size="20" aria-hidden="true" />
        </AtomsButtonCTA>
      </div>
      <p class="qa__note">{{ t("product.hero.TaxesAndShipping") }}</p>
    </div>

    <!-- Rassicurazioni: gli stessi testi della hero in home. -->
    <ul class="qa__trust">
      <li class="qa__trust-item">
        <span class="qa__trust-icon" aria-hidden="true">
          <Icon name="heroicons:truck-20-solid" size="16" />
        </span>
        {{ t("home.immersive.hero.trust.shipping") }}
      </li>
      <li class="qa__trust-item">
        <span class="qa__trust-icon" aria-hidden="true">
          <Icon name="heroicons:lock-closed-20-solid" size="16" />
        </span>
        {{ t("home.immersive.hero.trust.payments") }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "~/stores/cart";
import { ToastMessageType } from "~/types/toastMessage.type";
import type { ProductType } from "~/types/productType.type";
import type { Variant } from "~/types/variant.type";

const { t } = useI18n();
const cart = useCartStore();

// Collega la tendina della quantità alla sua etichetta.
const labelId = useId();
const quantityRef = ref(1);
const toastKey = ref(0);
const props = defineProps<{
  variant: Variant;
  product: ProductType;
}>();
const toastData = {
  message: "",
  type: "",
};

const quantityOptions = computed(() => {
  if (!props.variant) return null;
  return Array.from({ length: props.variant.quantity }, (_, i) => ({
    value: (i + 1).toString(),
    name: (i + 1).toString(),
  }));
});

const totalPrice = computed(() => {
  if (!props.variant) return null;
  return (quantityRef.value * props.variant.price).toFixed(2);
});

function updateQuantity(newQuantity: string) {
  quantityRef.value = Number(newQuantity);
}

function addToCart() {
  if (!props.variant || !props.product) return;

  cart.addLine(
    {
      variantId: props.variant.id,
      blueprintId: props.product.blueprintId ?? 0,
      productSlug: props.product.id,
      productUrl: `/${props.product.tcgSlug}/${props.product.categorySlug}/${props.product.id}`,
      name: props.product.productName,
      imageUrl: props.product.imageUrl,
      language: props.variant.language,
      condition: props.variant.condition,
      // Lo store lavora in centesimi: il prezzo della variante è in euro.
      priceCents: Math.round(props.variant.price * 100),
      availableQuantity: props.variant.quantity,
    },
    quantityRef.value,
  );

  toastData.message = t("toast.cart.success");
  toastData.type = ToastMessageType.SUCCESS;
  toastKey.value++;
}
</script>

<style scoped>
.qa {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.qa__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 20px;
}

.qa__field {
  display: flex;
  align-items: center;
  gap: 14px;
}

.qa__label {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--im-muted);
}

/* La quantità è un numero corto: la tendina non serve larga come quella
   dell'ordinamento, e con molti pezzi la lista scorre invece di allungare
   la pagina. */
.qa__field :deep(.sorter__button) {
  min-width: 104px;
}

.qa__field :deep(.sorter__list) {
  max-height: 288px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.qa__stock {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  line-height: 1.4;
  color: var(--im-muted);
}

/* Puntino "live": la disponibilità è aggiornata, il prodotto c'è. */
.qa__stock-dot {
  position: relative;
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--im-teal);
  box-shadow: 0 0 10px rgba(92, 200, 224, 0.8);
}

.qa__stock-dot::after {
  content: "";
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid rgba(92, 200, 224, 0.6);
  animation: qa-ping 2.2s ease-out infinite;
}

/* Prezzo e bottone in un riquadro incassato nel vetro del box. */
.qa__checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 20px;
  border: 1px solid var(--im-line);
  background:
    radial-gradient(120% 140% at 0% 0%, rgba(236, 145, 160, 0.12), transparent 60%),
    rgba(7, 10, 31, 0.45);
}

@media (min-width: 1024px) {
  .qa__checkout {
    padding: 20px 22px;
  }
}

.qa__buy {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px 20px;
}

.qa__price {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  flex: none;
  white-space: nowrap;
}

.qa__amount {
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-weight: 800;
  font-size: clamp(32px, 3.6vw, 42px);
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--im-ink);
}

.qa__currency {
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: var(--im-pink);
}

/* Il bottone si allarga a tutto lo spazio libero; su mobile va a capo e
   diventa a tutta larghezza. */
.qa__cta {
  flex: 1 1 220px;
  min-height: 54px;
}

/* Il testo arriva minuscolo dalle traduzioni ("aggiungi al carrello"). */
.qa__cta :deep(.subtitle-m) {
  display: inline-block;
}

.qa__cta :deep(.subtitle-m)::first-letter {
  text-transform: uppercase;
}

.qa__note {
  font-size: 13px;
  line-height: 1.5;
  color: var(--im-muted);
}

.qa__trust {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.qa__trust-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.03);
  font-size: 13px;
  line-height: 1.3;
  color: var(--im-muted);
}

.qa__trust-icon {
  display: inline-flex;
  flex: none;
  color: var(--im-pink-strong);
}

@keyframes qa-ping {
  0% {
    opacity: 0.9;
    transform: scale(0.6);
  }
  80%,
  100% {
    opacity: 0;
    transform: scale(1.8);
  }
}

@media (prefers-reduced-motion: reduce) {
  .qa__stock-dot::after {
    animation: none;
    opacity: 0;
  }
}
</style>
