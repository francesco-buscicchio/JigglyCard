<template>
  <div
    class="filters-section sticky top-0 h-screen bg-gray-100 p-4 w-full max-w-[30vw] overflow-auto hidden lg:block"
  >
    <FilterCardDesktop
      class="w-full mb-8 mt-20"
      :data="{
        title: 'Condizioni',
        filters: checkboxFilters,
        type: 'checkboxList',
      }"
      @update:filters="handleFiltersUpdate"
    />
    <FilterCardDesktop
      :data="{
        title: 'Prezzo',
        type: 'rangeSelector',
        range: priceRange,
        rangeLabel: 'Seleziona il range di prezzo',
      }"
      class="w-full"
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
