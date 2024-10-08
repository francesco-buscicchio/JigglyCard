<template>
  <p>{{ `${startItem}-${endItem} ${$t("of")} ${totalItems}` }}</p>
</template>

<script lang="ts" setup>
import { ITEMS_FOR_PAGE } from "~/data/const";

const props = defineProps({
  page: {
    type: Number,
    default: 1,
  },
  totalItems: {
    type: Number,
    default: 1,
  },
});

const startItem = computed(() => {
  return (props.page - 1) * ITEMS_FOR_PAGE + 1;
});

const endItem = computed(() => {
  if (props.page * ITEMS_FOR_PAGE > props.totalItems) return props.totalItems;
  else return props.page * ITEMS_FOR_PAGE;
});
</script>
