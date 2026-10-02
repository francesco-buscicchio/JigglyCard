<template>
  <div ref="rootRef" class="qadd" :class="{ 'qadd--compact': compact }" @keydown.esc="open = false">
    <button
      type="button"
      class="qadd__btn"
      :class="{ 'is-done': justAdded }"
      :disabled="!canAdd"
      :title="canAdd ? undefined : t('product.quickAdd.maxed')"
      :aria-label="t('product.quickAdd.aria', { name: product.productName })"
      :aria-haspopup="hasChoice ? 'menu' : undefined"
      :aria-expanded="hasChoice ? open : undefined"
      @click.stop.prevent="onClick"
    >
      <Icon
        :name="justAdded ? 'heroicons:check-20-solid' : 'heroicons:shopping-cart-20-solid'"
        size="18"
      />
      <span v-if="!compact" class="qadd__label">
        {{ justAdded ? t("product.quickAdd.added") : t("product.quickAdd.add") }}
      </span>
    </button>

    <Transition name="qadd-pop">
      <div v-if="open" class="qadd__menu" role="menu" @click.stop.prevent>
        <p class="qadd__title">{{ t("product.quickAdd.choose") }}</p>
        <button
          v-for="variant in purchasable"
          :key="variant.id"
          type="button"
          role="menuitem"
          class="qadd__option"
          :disabled="isMaxed(variant)"
          @click.stop.prevent="add(variant)"
        >
          <span class="qadd__variant">
            {{ label(variant.language) }} · {{ label(variant.condition) }}
          </span>
          <span class="qadd__price">{{ variant.price.toFixed(2) }} €</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "~/stores/cart";
import type { ProductType } from "~/types/productType.type";
import type { Variant } from "~/types/variant.type";

/**
 * "Aggiungi al carrello" direttamente dalle card del catalogo.
 *
 * Con una sola versione disponibile aggiunge subito un pezzo; con più lingue
 * o condizioni apre un piccolo menu con i prezzi, dalla più economica. Le
 * versioni già tutte nel carrello non si possono aggiungere di nuovo.
 */
const props = withDefaults(
  defineProps<{
    product: ProductType;
    /** Solo icona, per le card strette. */
    compact?: boolean;
  }>(),
  { compact: false },
);

const { t, te } = useI18n();
const cart = useCartStore();
const rootRef = ref<HTMLElement | null>(null);
const open = ref(false);
const justAdded = ref(false);
let doneTimer: ReturnType<typeof setTimeout> | null = null;

const purchasable = computed(() =>
  [...(props.product.variants ?? [])]
    .filter((variant) => variant.quantity > 0)
    .sort((a, b) => a.price - b.price),
);

const inCart = (variant: Variant) =>
  cart.lines.find((line) => line.variantId === variant.id)?.quantity ?? 0;

const isMaxed = (variant: Variant) => inCart(variant) >= variant.quantity;

const canAdd = computed(
  () =>
    props.product.available !== false &&
    purchasable.value.some((variant) => !isMaxed(variant)),
);

const hasChoice = computed(() => purchasable.value.length > 1);

const label = (value: string) => {
  const key = `filter.${value}`;
  return te(key) ? t(key) : value;
};

const add = (variant: Variant) => {
  if (isMaxed(variant)) return;
  cart.addLine({
    variantId: variant.id,
    blueprintId: props.product.blueprintId ?? 0,
    productSlug: props.product.id,
    productUrl: `/${props.product.tcgSlug}/${props.product.categorySlug}/${props.product.id}`,
    name: props.product.productName,
    imageUrl: props.product.imageUrl,
    language: variant.language,
    condition: variant.condition,
    // Lo store lavora in centesimi: il prezzo della variante è in euro.
    priceCents: Math.round(variant.price * 100),
    availableQuantity: variant.quantity,
  });
  open.value = false;
  justAdded.value = true;
  if (doneTimer) clearTimeout(doneTimer);
  doneTimer = setTimeout(() => (justAdded.value = false), 1600);
};

const onClick = () => {
  if (!canAdd.value) return;
  if (hasChoice.value) {
    open.value = !open.value;
    return;
  }
  add(purchasable.value[0]);
};

const onDocumentClick = (event: MouseEvent) => {
  if (open.value && !rootRef.value?.contains(event.target as Node)) open.value = false;
};

onMounted(() => {
  cart.hydrate();
  document.addEventListener("click", onDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocumentClick);
  if (doneTimer) clearTimeout(doneTimer);
});
</script>

<style scoped>
.qadd {
  position: relative;
}

.qadd__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  color: #2a0a14;
  background: linear-gradient(135deg, #fde4e8 0%, var(--im-pink) 35%, var(--im-pink-strong) 100%);
  box-shadow: 0 8px 20px -10px rgba(236, 145, 160, 0.9);
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.qadd--compact .qadd__btn {
  width: 40px;
  padding: 0;
}

.qadd__btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px -10px rgba(236, 145, 160, 1);
}

.qadd__btn.is-done {
  color: #062a1c;
  background: linear-gradient(135deg, #c9f7e3, #5ee0a0);
}

.qadd__btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  box-shadow: none;
}

.qadd__btn:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
}

.qadd__label {
  cursor: inherit;
}

.qadd__menu {
  position: absolute;
  right: 0;
  bottom: calc(100% + 8px);
  z-index: 30;
  display: flex;
  width: 250px;
  flex-direction: column;
  gap: 2px;
  padding: 6px;
  border-radius: 16px;
  border: 1px solid var(--im-line);
  background: rgba(17, 20, 52, 0.97);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 24px 50px -12px rgba(0, 0, 0, 0.75);
  text-align: left;
  cursor: default;
}

.qadd__title {
  padding: 6px 10px 4px;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--im-muted);
}

.qadd__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 10px;
  font-size: 13px;
  color: var(--im-ink);
  transition: background-color 0.15s ease;
}

.qadd__option:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.08);
}

.qadd__option:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qadd__variant {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: inherit;
}

.qadd__price {
  flex: none;
  font-weight: 700;
  cursor: inherit;
}

.qadd-pop-enter-active,
.qadd-pop-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.qadd-pop-enter-from,
.qadd-pop-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.98);
}
</style>
