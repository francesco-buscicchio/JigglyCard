<template>
  <div
    class="filters-section sticky top-0 h-screen bg-gray-100 p-4 w-full max-w-[30vw] overflow-auto hidden lg:block"
  >
    <FilterCardDesktop
      :filters="checkboxFilters"
      class="w-full mb-8 mt-20"
      title="Condizioni"
      type="checkboxList"
      @update:filters="handleFiltersUpdate"
    />
    <FilterCardDesktop
      title="Prezzo"
      type="rangeSelector"
      :range="priceRange"
      class="w-full"
      rangeLabel="Seleziona il range di prezzo"
      @update:range="handleRangeUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import conditions from "~/data/conditions";

const checkboxFilters = ref(conditions);

const priceRange = ref([0, 100]);

function handleFiltersUpdate(filterName: string) {
  const filter = checkboxFilters.value.find((f) => f.label === filterName);
  if (filter) {
    filter.enabled = !filter.enabled;
  }
}

function handleRangeUpdate(newValue: number) {
  //priceRange.value.value = newValue;
}
</script>
