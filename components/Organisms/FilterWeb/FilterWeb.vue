<template>
  <div class="bg-accent-50 rounded-lg w-[400px]">
    <div class="flex items-center justify-center py-10">
      <h5>{{ t("filters") }}</h5>
    </div>

    <div>
      <div v-for="category of filterCategories" :key="category.objectID">
        <MoleculesAccordion>
          <template #header>
            <p>{{ t(`filter.${category.name}`) }}</p>
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
              <p class="text-left">{{ t(`filter.${item.name}`) }}</p>
            </div>
          </div>
        </MoleculesAccordion>
      </div>

      <!-- Slider Prezzo -->
      <div class="mx-6 mt-4">
        <p>{{ t("price") }}</p>
        <div class="flex items-center justify-center whitespace-nowrap mt-2">
          <span class="mr-2 w-20">{{ t("da") }} {{ selectedMinPrice }}</span>
          <MoleculesSlider
            :min="minumPrice.value"
            :max="maxPrice.value"
            :initialMinPrice="selectedMinPrice"
            :initialMaxPrice="selectedMaxPrice"
            @update:minPrice="updateMinPrice($event)"
            @update:maxPrice="updateMaxPrice($event)"
          />
          <span class="ml-2 w-20">{{ t("a") }} {{ selectedMaxPrice }}</span>
        </div>
      </div>

      <!-- Input Prezzo -->
      <div class="flex items-center my-6">
        <p class="ml-12 mr-6">{{ t("min") }}</p>
        <AtomsInputNumber
          v-model="selectedMinPrice"
          @updateValue="onMinPriceInput"
          :min="minumPrice"
          :max="selectedMaxPrice"
          :step="0.01"
          status="default"
          placeholder="Prezzo minimo"
        />
      </div>
      <div class="flex items-center">
        <p class="ml-12 mr-6">{{ t("max") }}</p>
        <AtomsInputNumber
          v-model="selectedMaxPrice"
          @updateValue="onMaxPriceInput"
          :min="minumPrice"
          :max="selectedMaxPrice"
          :step="0.01"
          status="default"
          placeholder="Prezzo massimo"
        />
      </div>
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
          <p class="text-base">{{ t("clearFilters") }}</p>
        </AtomsButtonCTA>
        <AtomsButtonCTA @click="applyFilters">
          <h5>{{ t("apply") }}</h5>
        </AtomsButtonCTA>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { FILTERS_COLLECTION } from "~/data/const";

const { t } = useI18n();
const props = defineProps({
  filters: Array<String>,
});
const filterList = ref<String[]>([]);
const filterCategories = ref();
const client = useAlgolia();
const minumPrice = ref(0);
const maxPrice = ref(0);
const selectedMinPrice = ref(0);
const selectedMaxPrice = ref(0);
const selectedFilters = reactive<{ [key: string]: any }>({});
const inputKey = ref(0);

watch(props, () => {
  filterList.value = props.filters ?? [];
  updateSelectedFilters();
});

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

function updateSelectedFilters() {
  resetAllFilters();
  filterList.value.forEach((filterName) => {
    filterCategories.value.forEach((category: { value: any[] }) => {
      category.value.forEach((filter) => {
        if (filter.name === filterName) {
          filter.checked = true;
        }
      });
    });
  });
}

onMounted(async () => {
  let results = await client.searchSingleIndex({
    indexName: FILTERS_COLLECTION,
  });
  const excludeMinMaxFilter = results.hits.filter(
    (filter: any) => !filter.massimo && !filter.minimo
  );

  filterCategories.value = excludeMinMaxFilter.map((filter: any) => ({
    ...filter,
    value: filter.value?.map((language: any) => ({
      name: language,
      checked: false,
    })),
  }));

  const minMaxItem: any = results.hits.find(
    (filter: any) => filter.massimo && filter.minimo
  );

  if (minMaxItem) {
    selectedMinPrice.value = minMaxItem.minimo;
    selectedMaxPrice.value =
      minMaxItem.massimo < 100 ? 100 : minMaxItem.massimo;
    minumPrice.value = minMaxItem.minimo;
    maxPrice.value = minMaxItem.massimo < 100 ? 100 : minMaxItem.massimo;
  }
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

function onMinPriceInput(value: string | number) {
  const numericValue = parseFloat(value as string);
  if (!isNaN(numericValue)) {
    selectedMinPrice.value = Math.max(
      minumPrice.value,
      Math.min(numericValue, selectedMaxPrice.value)
    );
  }
}

function onMaxPriceInput(value: string | number) {
  const numericValue = parseFloat(value as string);
  if (!isNaN(numericValue)) {
    selectedMaxPrice.value = Math.min(
      maxPrice.value,
      Math.max(numericValue, selectedMinPrice.value)
    );
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
    min: selectedMinPrice.value,
    max: selectedMaxPrice.value,
  };
  emit("filterUpdate", result);
}

function resetAllFilters() {
  filterCategories.value.forEach((category: any) => {
    category.value.forEach((filter: any) => {
      filter.checked = false;
    });
  });
  Object.keys(selectedFilters).forEach((key) => {
    delete selectedFilters[key];
  });
  selectedMinPrice.value = minumPrice.value;
  selectedMaxPrice.value = maxPrice.value;
  selectedFilters["Prezzo"] = { min: minumPrice.value, max: maxPrice.value };
  inputKey.value++; //force rerender
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
