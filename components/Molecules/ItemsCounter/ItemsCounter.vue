<template>
  <p>{{ `${startItem}-${endItem} ${$t("of")} ${totalItems}` }}</p>
</template>

<script lang="ts" setup>
import { ITEMS_FOR_PAGE_MOBILE, ITEMS_FOR_PAGE_DESKTOP } from "~/data/const";

const isDesktopView = isDesktop();

const itemsForPage = computed(() => {
  return isDesktopView ? ITEMS_FOR_PAGE_DESKTOP : ITEMS_FOR_PAGE_MOBILE;
});

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
  return (props.page - 1) * itemsForPage.value + 1;
});

const endItem = computed(() => {
  if (props.page * itemsForPage.value > props.totalItems)
    return props.totalItems;
  else return props.page * itemsForPage.value;
});
</script>
