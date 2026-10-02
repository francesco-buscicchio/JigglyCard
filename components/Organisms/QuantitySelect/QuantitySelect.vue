<template>
  <div class="qty">
    <!-- Il gruppo dà un nome al menu: il bottone da solo legge solo il numero. -->
    <div class="qty__picker" role="group" :aria-labelledby="labelId">
      <span :id="labelId" class="qty__label">
        {{ t("product.quantity.quantity") }}
      </span>
      <MoleculesPageSorter
        class="qty__sorter"
        :sortingItems="quantityOptions"
        :selected="quantity"
        @handleSorting="updateQuantity"
        type="slim"
      />
    </div>

    <p class="qty__price">
      {{ totalPrice }}<span class="qty__currency">€</span>
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  quantity: number;
  price: number;
  selectedQuantity: number;
}>();

const emit = defineEmits(["quantityChanged"]);

const quantity = ref(props.selectedQuantity);
const { t } = useI18n();
const labelId = useId();
const quantityOptions = computed(() => {
  return Array.from({ length: props.quantity }, (_, i) => ({
    value: (i + 1).toString(),
    name: (i + 1).toString(),
  }));
});

const totalPrice = computed(() => (quantity.value * props.price).toFixed(2));

function updateQuantity(newQuantity: string) {
  quantity.value = Number(newQuantity);
  emit("quantityChanged", Number(newQuantity));
}
</script>

<style scoped>
.qty {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 16px;
}

.qty__picker {
  display: flex;
  align-items: center;
  gap: 10px;
}

.qty__label {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--im-muted);
}

/* Il menu nasce per l'ordinamento (200px minimi): per un numero basta una
   pillola stretta, che sta nella card anche a 375px. */
.qty__sorter :deep(.sorter__button) {
  min-width: 74px;
  max-width: 120px;
  width: auto;
  padding: 7px 10px 7px 16px;
  border-radius: 999px;
  font-variant-numeric: tabular-nums;
}

/* Con molti pezzi disponibili la lista diventerebbe lunga quanto la pagina. */
.qty__sorter :deep(.sorter__list) {
  left: 0;
  right: auto;
  max-height: 232px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.qty__price {
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  color: var(--im-ink);
}

.qty__currency {
  margin-left: 4px;
  font-family: inherit;
  font-size: 0.7em;
  color: var(--im-pink);
}
</style>
