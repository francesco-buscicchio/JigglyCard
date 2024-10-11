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
import { ITEMS_FOR_PAGE } from "~/data/const";

const props = defineProps({
  totalItems: Number,
  currentPage: Number,
});

const startItem = computed(() => {
  return (props.currentPage - 1) * ITEMS_FOR_PAGE + 1;
});

const endItem = computed(() => {
  if (props.currentPage * ITEMS_FOR_PAGE > props.totalItems)
    return props.totalItems;
  else return props.currentPage * ITEMS_FOR_PAGE;
});
</script>
