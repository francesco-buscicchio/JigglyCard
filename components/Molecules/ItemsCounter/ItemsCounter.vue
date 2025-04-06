<template>
  <p>{{ `${startItem}-${endItem} ${$t("of")} ${totalItems}` }}</p>
</template>

<script lang="ts" setup>
import { ITEMS_FOR_PAGE_MOBILE, ITEMS_FOR_PAGE_WEB } from "~/data/const";
const isDesktopView = isDesktop();

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

const itemsPerPage = computed(() => {
  return isDesktopView.value ? ITEMS_FOR_PAGE_WEB : ITEMS_FOR_PAGE_MOBILE;
});

const startItem = computed(() => {
  return (props.page - 1) * itemsPerPage.value + 1;
});

const endItem = computed(() => {
  if (props.page * itemsPerPage.value > props.totalItems)
    return props.totalItems;
  else return props.page * itemsPerPage.value;
});
</script>
