import type { Ref } from "vue";

/** Larghezza minima di una card: sotto, la griglia perde una colonna. */
const MIN_CARD_WIDTH = 200;
/** Spazio fra le card (`gap-5`). */
const GRID_GAP = 20;
/** Prodotti per pagina di riferimento, arrotondati a righe intere. */
const TARGET_PER_PAGE = 12;

/**
 * Colonne e prodotti per pagina del catalogo, ricavati dalla larghezza reale
 * della griglia: la pagina contiene sempre righe complete (3 colonne → 12,
 * 5 → 15), quindi niente buchi in fondo alla griglia tranne che nell'ultima
 * pagina. Su mobile la lista è a una colonna.
 *
 * `area` è un contenitore sempre presente attorno alla griglia; `isGrid` dice
 * se è visibile la griglia (desktop) o la lista (mobile).
 */
export function useListingGrid(
  area: Ref<HTMLElement | null>,
  isGrid: Ref<boolean>,
) {
  const width = ref(0);
  let observer: ResizeObserver | null = null;

  const columns = computed(() => {
    if (!isGrid.value || !width.value) return 1;
    return Math.max(
      2,
      Math.floor((width.value + GRID_GAP) / (MIN_CARD_WIDTH + GRID_GAP)),
    );
  });

  const perPage = computed(
    () => columns.value * Math.ceil(TARGET_PER_PAGE / columns.value),
  );

  onMounted(() => {
    if (!area.value) return;
    width.value = area.value.clientWidth;
    if (typeof ResizeObserver === "undefined") return;
    observer = new ResizeObserver(([entry]) => {
      width.value = entry.contentRect.width;
    });
    observer.observe(area.value);
  });

  onBeforeUnmount(() => observer?.disconnect());

  return { columns, perPage };
}
