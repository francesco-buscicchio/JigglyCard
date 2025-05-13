<template>
  <div class="flex justify-center">
    <p>
      {{
        `${$t("listingCounter.youHaveViewed")} ${startItem}-${endItem} ${$t(
          "listingCounter.of"
        )} ${totalItems} ${$t("listingCounter.products")}`
      }}
    </p>
  </div>
</template>

<script setup>
import { ITEMS_FOR_PAGE_MOBILE, ITEMS_FOR_PAGE_DESKTOP } from "~/data/const";

const isDesktopView = isDesktop();

const itemsForPage = computed(() => {
  return isDesktopView ? ITEMS_FOR_PAGE_DESKTOP : ITEMS_FOR_PAGE_MOBILE;
});

const props = defineProps({
  totalItems: {
    type: Number,
    required: true,
    validator: (value) => value > 0,
  },
  currentPage: {
    type: Number,
    required: true,
    validator: (value) => value > 0,
  },
});

const startItem = computed(() => {
  return (props.currentPage - 1) * itemsForPage.value + 1;
});

const endItem = computed(() => {
  if (props.currentPage * itemsForPage.value > props.totalItems)
    return props.totalItems;
  else return props.currentPage * itemsForPage.value;
});
</script>
