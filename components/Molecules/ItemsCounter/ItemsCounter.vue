<template>
  <p>{{ `${startItem}-${endItem} ${$t("of")} ${totalItems}` }}</p>
</template>

<script lang="ts" setup>
const props = defineProps({
  page: {
    type: Number,
    default: 1,
  },
  itemForPage: {
    type: Number,
    default: 1,
  },
  totalItems: {
    type: Number,
    default: 1,
  },
});

const startItem = computed(() => {
  return (props.page - 1) * props.itemForPage + 1;
});

const endItem = computed(() => {
  if (props.page * props.itemForPage > props.totalItems)
    return props.totalItems;
  else return props.page * props.itemForPage;
});
</script>
