<template>
  <div class="flex flex-row items-start flex-wrap gap-2">
    <AtomsFilterTag
      v-for="item of filterList"
      :text="item"
      @remove-filter="removeFilter"
    ></AtomsFilterTag>
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

const removeFilter = (item: string) => {
  filterList.value = filterList.value.filter((val) => val !== item);
};
</script>
