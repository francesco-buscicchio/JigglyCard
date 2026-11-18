<template>
  <div>
    <button type="button" class="filter-trigger" @click="togglePanel">
      <Icon name="heroicons:adjustments-horizontal-20-solid" size="18" />
      {{ t("catalog.controls.filters") }}
      <span v-if="activeCount" class="filter-trigger__count">{{ activeCount }}</span>
    </button>

    <transition name="fade">
      <div v-if="isOpen" class="overlay" @click.self="togglePanel"></div>
    </transition>

    <transition name="slide-right">
      <div
        v-if="isOpen"
        class="filter-panel"
        role="dialog"
        aria-modal="true"
        :aria-label="t('catalog.controls.filters')"
      >
        <div class="filter-panel__head">
          <h2 class="filter-panel__title">{{ t("catalog.controls.filters") }}</h2>
          <button
            type="button"
            class="filter-panel__close"
            :aria-label="t('catalog.controls.close')"
            @click="togglePanel"
          >
            <Icon name="heroicons:x-mark-20-solid" size="22" />
          </button>
        </div>

        <div class="filter-panel__body">
          <!-- Prima sezione: nel cassetto la lista espansioni è lunga e il
               prezzo, assente su mobile, deve essere raggiungibile subito.
               Componente, etichette e payload sono gli stessi del desktop. -->
          <MoleculesFilterSection
            v-if="maxPrice > minumPrice"
            :title="t('catalog.controls.price')"
            :selected="isPriceRangeSelected ? 1 : 0"
            initially-open
          >
            <MoleculesPriceRange
              :min="minumPrice"
              :max="maxPrice"
              :low="selectedMinPrice"
              :high="selectedMaxPrice"
              @change="updatePriceRange"
            />
          </MoleculesFilterSection>

          <MoleculesFilterSection
            v-for="(category, index) of filterCategories"
            :key="category.objectID"
            :title="translateCategoryLabel(category.name)"
            :selected="category.value.filter((item) => item.checked).length"
            :initially-open="index < 2"
          >
            <div class="filter-panel__options">
              <AtomsFilterOption
                v-for="(item, itemIndex) of category.value"
                :key="item.id"
                :model-value="item.checked"
                :label="translateFilterValue(item.name, category.name)"
                :count="item.count"
                @update:model-value="
                  updateCheckboxValue(category.objectID, itemIndex, $event)
                "
              />
            </div>
          </MoleculesFilterSection>
        </div>

        <div class="filter-panel__actions">
          <button
            type="button"
            class="im-btn im-btn--ghost"
            :disabled="!areFiltersSelected"
            @click="resetAllFilters"
          >
            {{ t("catalog.controls.reset") }}
          </button>
          <button type="button" class="im-btn im-btn--primary" @click="applyFilters">
            {{ t("catalog.controls.apply") }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, type PropType } from "vue";
import { getTypeTranslationKey } from "~/utils/filterTranslation";
import { rarityRank } from "~/utils/showcaseCards";
import { usePriceFilter } from "~/composables/usePriceFilter";

const props = defineProps({
  filters: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  facets: {
    type: Object as PropType<Record<string, Record<string, number>> | null>,
    default: null,
  },
  facetLabels: {
    // Slug -> nome leggibile, per le faccette che filtrano per slug.
    type: Object as PropType<Record<string, Record<string, string>>>,
    default: () => ({}),
  },
  priceStats: {
    type: Object as PropType<{ min: number; max: number } | null>,
    default: null,
  },
  /**
   * Fascia già applicata al catalogo (euro). Quando il genitore la azzera
   * — "Cancella tutti" o lo stato vuoto — lo slider torna sui bordi, come
   * il reset del pannello desktop.
   */
  appliedPrice: {
    type: Object as PropType<{ min?: number; max?: number } | null>,
    default: null,
  },
});

const { t, te } = useI18n();
const filterList = ref<string[]>([]);
const filterCategories = ref<
  {
    objectID: string;
    name: string;
    value: { id: string; name: string; checked: boolean; count: number }[];
  }[]
>([]);
const facetOptionCache = ref<Record<string, Set<string>>>({});
const isOpen = ref(false);
const priceStats = computed(() => props.priceStats);
const {
  minumPrice,
  maxPrice,
  selectedMinPrice,
  selectedMaxPrice,
  isPriceRangeSelected,
  pricePayload,
  setRange,
  resetPrice,
} = usePriceFilter(priceStats, { preserveBounds: true });
/** categoria del pannello filtri -> chiave del dizionario etichette */
const FACET_LABEL_KEYS: Record<string, string> = {
  brand: "tcg",
  type: "type",
  expansion: "setSlug",
};

const facetDefinitions = [
  { facetKey: "languages", category: "language" },
  { facetKey: "conditions", category: "condition" },
  { facetKey: "rarity", category: "rarity" },
  { facetKey: "type", category: "type" },
  { facetKey: "setSlug", category: "expansion" },
  { facetKey: "available", category: "available" },
];

/** Rarità dalla più comune alla più ambita, le altre voci in ordine alfabetico. */
const compareOptions = (category: string) => (a: string, b: string) =>
  (category === "rarity" ? rarityRank(b) - rarityRank(a) : 0) ||
  a.localeCompare(b);

watch(
  () => props.filters,
  (newFilters) => {
    filterList.value = newFilters ?? [];
    updateSelectedFilters();
  },
  { immediate: true }
);

watch(
  () => props.facets,
  (newFacets) => {
    buildFilterCategories(newFacets);
    updateSelectedFilters();
  },
  { immediate: true }
);

/**
 * Il catalogo è stato ripulito dal prezzo (chip "Cancella tutti" o risultati
 * vuoti) mentre il cassetto teneva ancora la fascia: si riallinea lo slider.
 */
watch(
  () => props.appliedPrice,
  (price) => {
    const cleared = price?.min === undefined && price?.max === undefined;
    if (cleared && isPriceRangeSelected.value) resetPrice();
  },
);

const areFiltersSelected = computed(
  () =>
    isPriceRangeSelected.value ||
    filterCategories.value.some((category) =>
      category.value.some((filter) => filter.checked),
    ),
);

const emit = defineEmits(["filterUpdate"]);

/** Voci spuntate più la fascia di prezzo, se ristretta: come sul desktop. */
const activeCount = computed(
  () =>
    filterCategories.value.reduce(
      (sum, category) =>
        sum + category.value.filter((filter) => filter.checked).length,
      0,
    ) + (isPriceRangeSelected.value ? 1 : 0),
);

function togglePanel() {
  isOpen.value = !isOpen.value;
}

function updateCheckboxValue(
  categoryID: string,
  filterIndex: number,
  value: boolean
) {
  const index = filterCategories.value.findIndex((val: any) => {
    return val.objectID === categoryID;
  });

  const category = filterCategories.value[index];
  const filter = category.value[filterIndex];

  filter.checked = value;
}

/** Lo slider aggiorna solo la bozza: su mobile si conferma con "Applica". */
function updatePriceRange(range: { low: number; high: number }) {
  setRange(range);
}

function currentFilters() {
  const result = filterCategories.value.reduce((acc: any, item: any) => {
    acc[item.name] = item.value
      .filter((val: any) => val.checked)
      .map((val: any) => val.name);
    return acc;
  }, {});
  result.price = pricePayload.value;
  return result;
}

function applyFilters() {
  emit("filterUpdate", currentFilters());
  togglePanel();
}

/**
 * Stesso effetto del reset desktop: toglie voci e fascia e rilancia la
 * ricerca. Il cassetto resta aperto, "Applica" lo chiude.
 */
function resetAllFilters() {
  filterCategories.value.forEach((category: any) => {
    category.value.forEach((filter: any) => {
      filter.checked = false;
    });
  });
  resetPrice();
  emit("filterUpdate", currentFilters());
}

function buildFilterCategories(
  facetsData: Record<string, Record<string, number>> | null
) {
  const hasExistingCache = Object.keys(facetOptionCache.value).length > 0;

  if (!facetsData && !hasExistingCache) {
    filterCategories.value = [];
    return;
  }

  if (facetsData) {
    facetDefinitions.forEach(({ facetKey, category }) => {
      const facetValues = facetsData[facetKey];
      if (!facetOptionCache.value[category]) {
        facetOptionCache.value[category] = new Set();
      }
      if (!facetValues) return;

      Object.keys(facetValues)
        .filter((valueKey) => valueKey !== "__empty__" && valueKey !== "")
        .forEach((valueKey) => {
          facetOptionCache.value[category]?.add(valueKey);
        });
    });
  }

  const categories = facetDefinitions
    .map(({ facetKey, category }) => {
      const cachedValues = facetOptionCache.value[category];
      if (!cachedValues || cachedValues.size === 0) return null;

      const values = Array.from(cachedValues)
        .sort(compareOptions(category))
        .map((valueKey) => ({
          id: `${facetKey}-${valueKey}`,
          name: valueKey,
          checked: false,
          // Il conteggio arriva dal CMS insieme alla faccetta: mostrarlo evita
          // di applicare filtri che porterebbero a zero risultati.
          count: facetsData?.[facetKey]?.[valueKey] ?? 0,
        }));

      if (!values.length) return null;

      return {
        objectID: facetKey,
        name: category,
        value: values,
      };
    })
    .filter(Boolean);

  filterCategories.value = categories as {
    objectID: string;
    name: string;
    value: { id: string; name: string; checked: boolean; count: number }[];
  }[];
}

function updateSelectedFilters() {
  if (!filterCategories.value?.length) return;

  filterCategories.value.forEach((category) => {
    category.value.forEach((filter) => {
      filter.checked = filterList.value.includes(filter.name);
    });
  });
}

function translateFilterValue(value: string, categoryName?: string) {
  // Nome fornito dal catalogo (giochi, categorie, espansioni): il filtro
  // continua a inviare lo slug, qui si mostra l'etichetta leggibile.
  const facetLabel = categoryName
    ? props.facetLabels?.[FACET_LABEL_KEYS[categoryName] ?? ""]?.[value]
    : undefined;
  if (facetLabel && !te(`category.${value}`)) return facetLabel;

  if (categoryName === "type") {
    const typeKey = getTypeTranslationKey(value);
    if (typeKey) {
      const translationKey = `filterType.${typeKey}`;
      if (te(translationKey)) return t(translationKey);
    }
  }

  const key = `filter.${value}`;
  return te(key) ? t(key) : value;
}

function translateCategoryLabel(value: string) {
  const key = `filter.${value}`;
  return te(key) ? t(key) : value;
}

watch(isOpen, (newValue) => {
  document.body.style.overflow = newValue ? "hidden" : "";
});
</script>

<style scoped>
.filter-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.05);
  font-size: 14px;
  font-weight: 600;
  text-transform: capitalize;
  color: var(--im-ink);
}

.filter-trigger__count {
  min-width: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: var(--im-pink-strong);
  color: #2a0a14;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.filter-panel {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  width: min(420px, calc(100vw - 24px));
  height: 100%;
  border-left: 1px solid var(--im-line);
  border-radius: 20px 0 0 20px;
  background: #0d1033;
  box-shadow: -30px 0 60px rgba(0, 0, 0, 0.5);
}

.filter-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
}

.filter-panel__title {
  font-size: 20px;
  text-transform: capitalize;
}

.filter-panel__close {
  display: inline-flex;
  padding: 6px;
  border-radius: 999px;
  color: var(--im-muted);
}

.filter-panel__body {
  flex: 1;
  overflow-y: auto;
}

.filter-panel__options {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 320px;
  overflow-y: auto;
}

.filter-panel__actions {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 10px;
  padding: 16px 20px 20px;
  border-top: 1px solid var(--im-line);
}

.filter-panel__actions .im-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background-color: rgba(3, 4, 16, 0.65);
  backdrop-filter: blur(3px);
}
</style>
