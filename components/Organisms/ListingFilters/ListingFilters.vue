<template>
  <div
    class="flex flex-row items-start flex-wrap max-w-[95%] gap-2 py-4"
    v-if="filterList.length"
  >
    <AtomsFilterTag
      v-for="item of filterList"
      :text="item"
      @remove-filter="removeFilter"
    />

    <AtomsButtonCTA
      type="text"
      :text="$t('clearFilters')"
      @button-clicked="removeAllFilter"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const filterList = ref([
  "inglese",
  "disponibile",
  "carte singole",
  "prima edizione",
]);

const removeAllFilter = () => {
  filterList.value = [];
};

const removeFilter = (item: string) => {
  filterList.value = filterList.value.filter((val) => val !== item);
};
</script>
