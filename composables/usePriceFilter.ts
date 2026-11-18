import { computed, ref, watch, type Ref } from "vue";
import {
  emptyPriceRange,
  isPriceRangeRestricted,
  resetPriceRange,
  selectPriceRange,
  syncPriceBounds,
  toPriceFilterPayload,
  type PriceRangeState,
} from "~/utils/priceFilter";

/**
 * Stato della fascia di prezzo per i pannelli filtri del catalogo.
 * La regola di applicazione sta in `utils/priceFilter.ts`, condivisa col desktop.
 */
export function usePriceFilter(
  priceStats: Ref<{ min: number; max: number } | null | undefined>,
  options: { preserveBounds?: boolean } = {},
) {
  const state = ref<PriceRangeState>(emptyPriceRange());

  watch(
    priceStats,
    (stats) => {
      state.value = syncPriceBounds(state.value, stats, options);
    },
    { immediate: true },
  );

  const minumPrice = computed(() => state.value.boundMin);
  const maxPrice = computed(() => state.value.boundMax);
  const selectedMinPrice = computed(() => state.value.selectedMin);
  const selectedMaxPrice = computed(() => state.value.selectedMax);
  const isPriceRangeSelected = computed(() => isPriceRangeRestricted(state.value));
  const pricePayload = computed(() => toPriceFilterPayload(state.value));

  const setRange = (range: { low: number; high: number }) => {
    state.value = selectPriceRange(state.value, range);
  };

  const resetPrice = () => {
    state.value = resetPriceRange(state.value);
  };

  return {
    minumPrice,
    maxPrice,
    selectedMinPrice,
    selectedMaxPrice,
    isPriceRangeSelected,
    pricePayload,
    setRange,
    resetPrice,
  };
}
