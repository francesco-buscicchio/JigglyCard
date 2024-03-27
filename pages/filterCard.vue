<template>
  <div
    class="flex flex-col items-start justify-center min-h-screen p-4 w-full max-w-[30vw]"
  >
    <FilterCard
      :filters="checkboxFilters"
      class="w-full mb-8"
      title="Conditions"
      type="checkboxList"
      @update:filters="handleFiltersUpdate"
    />

    <FilterCard
      title="Price Range"
      type="rangeSelector"
      :range="priceRange"
      class="w-full"
      rangeLabel="Select a price range"
      @update:range="handleRangeUpdate"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

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

function handleFiltersUpdate(filterName) {
  // const filter = checkboxFilters.value.find((f) => f.name === filterName);
  // if (filter) {
  //   filter.enabled = !filter.enabled;
  // }
}

function handleRangeUpdate(newValue) {
  priceRange.value.value = newValue;
}
</script>
