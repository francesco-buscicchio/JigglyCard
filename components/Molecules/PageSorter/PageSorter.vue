<template>
  <div class="relative max-w-40">
    <select @change="handleSortingValue" :class="className">
      <option
        v-for="item in sortingItems"
        :key="item.value"
        :value="item.value"
        :selected="item.value === selectedValue"
      >
        {{ t(item.name) }}
      </option>
    </select>

    <div
      class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700"
    >
      <Icon name="jig:arrow-down" size="8"></Icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from "vue";

const { t } = useI18n();
const props = defineProps({
  sortingItems: {
    type: Array as () => Array<{ value: string | number; name: string }>,
    required: true,
  },
  selected: {
    type: [String, Number],
    default: "",
  },
  type: {
    type: String,
    default: "page-sorter",
    validator: (value: string) => ["page-sorter", "slim"].includes(value),
  },
});

const emit = defineEmits(["handleSorting"]);

const selectedValue = ref(props.selected || props.sortingItems[0]?.value);

const handleSortingValue = (e: Event) => {
  const selectElement = e.target as HTMLSelectElement;
  selectedValue.value = selectElement.value;
  emit("handleSorting", selectElement.value);
};

const className = computed(() => {
  return props.type === "page-sorter"
    ? "bg-white border-[1px] border-accent-950 rounded-md shadow-sm w-full py-3 pl-4 pr-8 appearance-none"
    : "bg-white border-[1px] border-accent-950 rounded-md shadow-sm w-full py-1 pl-6 pr-10 appearance-none";
});
watch(
  () => props.selected,
  (newSelected) => {
    selectedValue.value = newSelected;
  }
);
</script>
