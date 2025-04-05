<template>
  <p>{{ `${startItem}-${endItem} ${$t("of")} ${totalItems}` }}</p>
</template>

<script lang="ts" setup>
import { ITEMS_FOR_PAGE_MOBILE } from "~/data/const";

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
  return (props.page - 1) * ITEMS_FOR_PAGE_MOBILE + 1;
});

const endItem = computed(() => {
  if (props.page * ITEMS_FOR_PAGE_MOBILE > props.totalItems) return props.totalItems;
  else return props.page * ITEMS_FOR_PAGE_MOBILE;
});
</script>
