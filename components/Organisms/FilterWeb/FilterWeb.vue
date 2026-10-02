<template>
  <div class="filters">
    <div class="filters__head">
      <h2 class="filters__title">
        {{ t("catalog.controls.filters") }}
        <span v-if="activeCount" class="filters__count">{{ activeCount }}</span>
      </h2>
      <button
        v-show="areFiltersSelected"
        type="button"
        class="filters__reset"
        @click="resetAllFilters"
      >
        {{ t("catalog.controls.reset") }}
      </button>
    </div>

    <MoleculesFilterSection
      v-for="(category, index) of filterCategories"
      :key="category.objectID"
      :title="translateCategoryLabel(category.name)"
      :selected="category.value.filter((item) => item.checked).length"
      :initially-open="index < 2"
    >
      <!-- Le espansioni sono centinaia: senza ricerca la lista è inservibile. -->
      <div v-if="isSearchableCategory(category)" class="filters__search">
        <Icon name="heroicons:magnifying-glass-20-solid" size="16" />
        <input
          v-model="optionSearch[category.objectID]"
          type="search"
          :placeholder="t('catalog.controls.searchOption')"
        />
      </div>

      <div
        class="filters__options"
        :class="{ 'filters__options--long': isSearchableCategory(category) }"
      >
        <AtomsFilterOption
          v-for="item of visibleOptions(category)"
          :key="item.id"
          :model-value="item.checked"
          :label="translateFilterValue(item.name, category.name)"
          :count="item.count"
          @update:model-value="
            updateCheckboxValue(
              category.objectID,
              category.value.indexOf(item),
              $event,
            )
          "
        />
        <p v-if="!visibleOptions(category).length" class="filters__empty">
          {{ t("catalog.controls.noOption") }}
        </p>
      </div>
    </MoleculesFilterSection>

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
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, type PropType } from "vue";
import { getTypeTranslationKey } from "~/utils/filterTranslation";
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
const minumPrice = ref(0);
const maxPrice = ref(0);
const selectedMinPrice = ref(0);
const selectedMaxPrice = ref(0);
/** categoria del pannello filtri -> chiave del dizionario etichette */
const FACET_LABEL_KEYS: Record<string, string> = {
  brand: "tcg",
  type: "type",
  expansion: "setSlug",
};

const facetDefinitions = [
  { facetKey: "languages", category: "language" },
  { facetKey: "conditions", category: "condition" },
  { facetKey: "type", category: "type" },
  { facetKey: "setSlug", category: "expansion" },
  { facetKey: "available", category: "available" },
];

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

watch(
  () => props.priceStats,
  (stats) => {
    if (!stats) {
      minumPrice.value = 0;
      maxPrice.value = 0;
      selectedMinPrice.value = 0;
      selectedMaxPrice.value = 0;
      return;
    }

    const normalizedMin = Math.floor(stats.min ?? 0);
    const normalizedMax = Math.ceil(stats.max ?? 0);
    const safeMax = Math.max(normalizedMin, normalizedMax);

    minumPrice.value = normalizedMin;
    maxPrice.value = safeMax;

    selectedMinPrice.value = Math.max(
      normalizedMin,
      Math.min(
        selectedMinPrice.value || normalizedMin,
        safeMax
      )
    );

    selectedMaxPrice.value = Math.min(
      safeMax,
      Math.max(
        selectedMaxPrice.value || safeMax,
        selectedMinPrice.value
      )
    );
  },
  { immediate: true }
);

const isPriceRangeSelected = computed(
  () =>
    selectedMaxPrice.value !== maxPrice.value ||
    selectedMinPrice.value !== minumPrice.value,
);

/** Voci spuntate più la fascia di prezzo, se ristretta. */
const activeCount = computed(
  () =>
    filterCategories.value.reduce(
      (sum, category) =>
        sum + category.value.filter((filter) => filter.checked).length,
      0,
    ) + (isPriceRangeSelected.value ? 1 : 0),
);

const areFiltersSelected = computed(() => activeCount.value > 0);

const emit = defineEmits(["filterUpdate"]);

/** Categorie con troppe voci per essere scorse a occhio. */
const SEARCHABLE_THRESHOLD = 12;
const optionSearch = ref<Record<string, string>>({});

const isSearchableCategory = (category: { value: unknown[] }) =>
  category.value.length > SEARCHABLE_THRESHOLD;

const visibleOptions = (category: {
  objectID: string;
  value: { name: string; count: number }[];
}) => {
  const term = (optionSearch.value[category.objectID] ?? "").trim().toLowerCase();
  if (!term) return category.value;
  return category.value.filter((item) =>
    item.name.toLowerCase().includes(term),
  );
};

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
  // I filtri si applicano alla spunta: il pulsante "Applica" costringeva a un
  // passaggio in più e non dava riscontro immediato.
  applyFilters();
}

/**
 * Il prezzo si applica con un ritardo: lo slider emette a ogni scatto e senza
 * attesa partirebbe una richiesta per pixel trascinato.
 */
let priceTimer: ReturnType<typeof setTimeout> | null = null;
const applyPriceSoon = () => {
  if (priceTimer) clearTimeout(priceTimer);
  priceTimer = setTimeout(() => applyFilters(), 400);
};

function updatePriceRange(range: { low: number; high: number }) {
  selectedMinPrice.value = range.low;
  selectedMaxPrice.value = range.high;
  applyPriceSoon();
}

function applyFilters() {
  const result = filterCategories.value.reduce((acc: any, item: any) => {
    acc[item.name] = item.value
      .filter((val: any) => val.checked)
      .map((val: any) => val.name);
    return acc;
  }, {});

  result["price"] = {
    min:
      selectedMinPrice.value === minumPrice.value
        ? undefined
        : selectedMinPrice.value,
    max:
      selectedMaxPrice.value === maxPrice.value
        ? undefined
        : selectedMaxPrice.value,
  };
  emit("filterUpdate", result);
}

function resetAllFilters() {
  filterCategories.value.forEach((category: any) => {
    category.value.forEach((filter: any) => {
      filter.checked = false;
    });
  });
  selectedMinPrice.value = minumPrice.value;
  selectedMaxPrice.value = maxPrice.value;
  applyFilters();
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
        .sort((a, b) => a.localeCompare(b))
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
    // Le tipologie sono gli slug di categoria del catalogo: tradotti per slug,
    // con il vecchio dizionario `filterType` come ripiego.
    const categoryKey = `category.${value}`;
    if (te(categoryKey)) return t(categoryKey);

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
</script>

<style scoped>
.filters {
  overflow: hidden;
  border-radius: 20px;
  border: 1px solid var(--im-line);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02));
}

.filters__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px;
}

.filters__title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  line-height: 1.2;
  text-transform: capitalize;
}

.filters__count {
  min-width: 22px;
  padding: 1px 7px;
  border-radius: 999px;
  background: var(--im-pink-strong);
  color: #2a0a14;
  font-family: "Roboto Flex", sans-serif;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
}

.filters__reset {
  font-size: 13px;
  font-weight: 600;
  color: var(--im-pink);
}

.filters__reset:hover {
  text-decoration: underline;
}

.filters__search {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.04);
  color: var(--im-muted);
}

.filters__search:focus-within {
  border-color: var(--im-pink-strong);
}

.filters__search input {
  width: 100%;
  border: 0;
  padding: 0;
  background: none;
  font-size: 14px;
  color: var(--im-ink);
}

.filters__search input:focus {
  outline: none;
  box-shadow: none;
}

.filters__options {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.filters__options--long {
  max-height: 280px;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
}

.filters__empty {
  font-size: 13px;
  color: var(--im-muted);
}
</style>
