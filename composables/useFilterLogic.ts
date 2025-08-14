// composables/useFilterLogic.ts
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { FILTERS_COLLECTION } from "~/data/const";
import { useAlgolia } from "#imports";

export function useFilterLogic(initialFilters = []) {
  const client = useAlgolia();

  const filterList = ref<string[]>(initialFilters);
  const filterCategories = ref<any[]>([]);
  const selectedFilters = reactive<{ [key: string]: any }>({});
  const minumPrice = ref(0);
  const maxPrice = ref(0);
  const selectedMinPrice = ref(0);
  const selectedMaxPrice = ref(0);
  const inputKey = ref(0);

  const areFiltersSelected = computed(() => {
    const hasCheckedFilter = filterCategories.value?.some((category) =>
      category.value.some((filter: any) => filter.checked)
    );
    const isPriceRangeSelected =
      selectedMaxPrice.value !== maxPrice.value ||
      selectedMinPrice.value !== minumPrice.value;
    return hasCheckedFilter || isPriceRangeSelected;
  });

  async function fetchFilters() {
    const results = await client.searchSingleIndex({
      indexName: FILTERS_COLLECTION,
    });

    const excludeMinMaxFilter = results.hits.filter(
      (filter: any) => !filter.massimo && !filter.minimo
    );

    filterCategories.value = excludeMinMaxFilter.map((filter: any) => ({
      ...filter,
      value: filter.value.map((val: string) => ({
        name: val,
        checked: false,
      })),
    }));

    const minMaxItem: any = results.hits.find(
      (filter: any) => filter.massimo && filter.minimo
    );

    if (minMaxItem) {
      minumPrice.value = minMaxItem.minimo;
      maxPrice.value = minMaxItem.massimo < 100 ? 100 : minMaxItem.massimo;
      selectedMinPrice.value = minumPrice.value;
      selectedMaxPrice.value = maxPrice.value;
    }
  }

  function updateCheckboxValue(
    categoryID: string,
    filterIndex: number,
    value: boolean
  ) {
    const index = filterCategories.value.findIndex(
      (val: any) => val.objectID === categoryID
    );
    const category = filterCategories.value[index];
    const filter = category.value[filterIndex];
    filter.checked = value;
  }

  function applyFilters(emitFn: (val: any) => void) {
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
    emitFn(result);
  }

  function resetAllFilters() {
    filterCategories.value.forEach((category) => {
      category.value.forEach((filter: any) => {
        filter.checked = false;
      });
    });
    selectedMinPrice.value = minumPrice.value;
    selectedMaxPrice.value = maxPrice.value;
    inputKey.value++;
  }

  return {
    t,
    filterCategories,
    selectedMinPrice,
    selectedMaxPrice,
    minumPrice,
    maxPrice,
    areFiltersSelected,
    inputKey,
    fetchFilters,
    updateCheckboxValue,
    applyFilters,
    resetAllFilters,
  };
}
