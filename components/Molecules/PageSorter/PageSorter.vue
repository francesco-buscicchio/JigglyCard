<template>
  <div class="relative max-w-40">
    <select @change="handleSortingValue"
      class="bg-white border-[1px] border-accent-950 rounded-md shadow-sm w-full py-3 pl-4 pr-8 appearance-none">
      <option v-for="item in sortingItems" :key="item.value" :value="item.value">
        {{ $t(item.name) }}
      </option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
      <Icon name="jig:arrow-down" size="8"></Icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  sortingItems: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["handleSorting"]);

const handleSortingValue = (e: Event) => {
  const selectElement = e.target as HTMLSelectElement;
  emit("handleSorting", selectElement.value);
};
</script>
