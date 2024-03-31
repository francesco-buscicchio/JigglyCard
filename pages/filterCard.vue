<template>
  <div
    class="flex flex-col items-start justify-center min-h-screen p-4 w-full max-w-[30vw]"
  >
    <FilterCardDesktop
      :filters="checkboxFilters"
      class="w-full mb-8"
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

<script setup>
import { ref, computed } from "vue";
import conditions from "~/data/conditions";

const checkboxFilters = ref(conditions);

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
