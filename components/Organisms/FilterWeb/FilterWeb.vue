<template>
  <div class="bg-accent-50 rounded-lg w-[400px]">
    <div class="flex items-center justify-center py-10">
      <h5>{{ t("catalog.controls.filters") }}</h5>
    </div>

    <div>
      <div v-for="category of filterCategories" :key="category.objectID">
        <MoleculesAccordion>
          <template #header>
            <p>{{ translateCategoryLabel(category.name) }}</p>
          </template>
          <div
            v-for="(item, index) of category.value"
            :key="item.id"
            class="mb-4"
          >
            <div class="flex items-center ml-6">
              <AtomsCheckbox
                :id="`${category.objectID}-${index}`"
                :modelValue="item.checked"
                @update:modelValue="
                  updateCheckboxValue(category.objectID, index, $event)
                "
                class="mr-6 bg-white custom-checkbox"
              />
              <p class="text-left">
                {{ translateFilterValue(item.name, category.name) }}
              </p>
            </div>
          </div>
        </MoleculesAccordion>
      </div>

      <!-- Prezzo temporaneamente disabilitato -->
      <!--
      <div class="mx-6 mt-4">
        <p>{{ t("catalog.controls.price") }}</p>
        <div class="flex items-center justify-center whitespace-nowrap mt-2">
          <span class="mr-2 w-20"
            >{{ t("catalog.controls.from") }} {{ selectedMinPrice }}</span
          >
          <MoleculesSlider
            :min="minumPrice"
            :max="maxPrice"
            :initialMinPrice="selectedMinPrice"
            :initialMaxPrice="selectedMaxPrice"
            @update:minPrice="updateMinPrice($event)"
            @update:maxPrice="updateMaxPrice($event)"
          />
          <span class="ml-2 w-20"
            >{{ t("catalog.controls.to") }} {{ selectedMaxPrice }}</span
          >
        </div>
      </div>

      <div class="flex items-center my-6">
        <p class="ml-12 mr-6">{{ t("catalog.controls.min") }}</p>
        <AtomsInputText
          :key="inputKey"
          class="w-20"
          v-model="selectedMinPrice"
          :placeholder="''"
          @keydown="validateNumberInput($event)"
          @input="validatePriceInput('min', $event)"
        />
      </div>
      <div class="flex items-center">
        <p class="ml-12 mr-6">{{ t("catalog.controls.max") }}</p>
        <AtomsInputText
          :key="inputKey + 1"
          class="w-20"
          v-model="selectedMaxPrice"
          :placeholder="''"
          @keydown="validateNumberInput($event)"
          @input="validatePriceInput('max', $event)"
        />
      </div>
      -->
    </div>

    <!-- Pulsanti -->
    <div class="bottom-container">
      <div class="flex mt-4 mb-6 mr-6">
        <AtomsButtonCTA
          class="text-underlined"
          :class="areFiltersSelected ? 'visible' : 'invisible'"
          type="text"
          @click="resetAllFilters"
        >
          <p class="text-base">{{ t("catalog.controls.clear") }}</p>
        </AtomsButtonCTA>
        <AtomsButtonCTA @click="applyFilters">
          <h5>{{ t("catalog.controls.apply") }}</h5>
        </AtomsButtonCTA>
      </div>
    </div>
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
    value: { id: string; name: string; checked: boolean }[];
  }[]
>([]);
const facetOptionCache = ref<Record<string, Set<string>>>({});
const minumPrice = ref(0);
const maxPrice = ref(0);
const selectedMinPrice = ref(0);
const selectedMaxPrice = ref(0);
const inputKey = ref(0);
const facetDefinitions = [
  { facetKey: "languages", category: "language" },
  { facetKey: "conditions", category: "condition" },
  { facetKey: "tcg", category: "brand" },
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
      inputKey.value++;
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
    inputKey.value++;
  },
  { immediate: true }
);

const areFiltersSelected = computed(() => {
  const hasCheckedFilter = filterCategories.value?.some(
    (category: {
      name: string;
      value: { name: string; checked: boolean }[];
    }) => {
      return category.value.some((filter) => filter.checked);
    }
  );

  const isPriceRangeSelected =
    selectedMaxPrice.value !== maxPrice.value ||
    selectedMinPrice.value !== minumPrice.value;
  return hasCheckedFilter || isPriceRangeSelected;
});

const emit = defineEmits(["filterUpdate"]);

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

function updateMinPrice(value: number) {
  selectedMinPrice.value = value;
  if (selectedMaxPrice.value < value) {
    selectedMaxPrice.value = value;
  }
}

function updateMaxPrice(value: number) {
  selectedMaxPrice.value = Math.min(value, maxPrice.value);
}

function validateNumberInput(event: KeyboardEvent) {
  const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Tab"];
  if (!/[0-9]/.test(event.key) && !allowedKeys.includes(event.key)) {
    event.preventDefault();
  }
}

function validatePriceInput(type: "min" | "max", event: Event) {
  const input = (event.target as HTMLInputElement).value;
  const numericValue = parseInt(input, 10);

  if (!isNaN(numericValue)) {
    if (type === "min") {
      selectedMinPrice.value = Math.max(
        minumPrice.value,
        Math.min(numericValue, selectedMaxPrice.value)
      );
    } else {
      selectedMaxPrice.value = Math.min(
        Math.max(numericValue, selectedMinPrice.value),
        maxPrice.value
      );
    }
  }
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
  inputKey.value++; //force rerender
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
    value: { id: string; name: string; checked: boolean }[];
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
</script>

<style scoped>
.text-underlined {
  text-decoration: underline;
}

.custom-checkbox {
  border: 1px solid #003849;
}

.bottom-container {
  margin-top: auto;
  padding: 16px;
}
</style>
