<template>
  <div
    class="filters-section sticky top-0 h-screen bg-gray-100 p-4 w-full max-w-[30vw] overflow-auto pt-[80px] hidden lg:block"
  >
    <FilterCardDesktop
      :filters="checkboxFilters"
      class="w-full mb-8 mt-20"
      title="Conditions"
      type="checkboxList"
      @update:filters="handleFiltersUpdate"
    />
    <FilterCardDesktop
      title="Price Range"
      type="rangeSelector"
      :range="priceRange"
      class="w-full"
      rangeLabel="Select a price range"
      @update:range="handleRangeUpdate"
    />
  </div>
</template>

<script setup lang="ts">
const checkboxFilters = ref([
  { label: "Near Mint", enabled: false },
  { label: "Excellent", enabled: false },
  { label: "Good", enabled: false },
  { label: "Light Played", enabled: false },
  { label: "Played", enabled: false },
  { label: "Poor", enabled: false },
]);

const priceRange = ref({
  min: 0,
  max: 100,
  value: 20,
});

function handleFiltersUpdate(filterName: string) {
  const filter = checkboxFilters.value.find((f) => f.label === filterName);
  if (filter) {
    filter.enabled = !filter.enabled;
  }
}

function handleRangeUpdate(newValue: number) {
  priceRange.value.value = newValue;
}
</script>
