<template>
  <p>
    {{ `${startItem}-${endItem} ${t("catalog.listing.of")} ${totalItems}` }}
  </p>
</template>

<script lang="ts" setup>
const { t } = useI18n();

const props = defineProps({
  page: {
    type: Number,
    default: 1,
  },
  totalItems: {
    type: Number,
    default: 1,
  },
  /** Prodotti per pagina: li decide la griglia (vedi `useListingGrid`). */
  perPage: {
    type: Number,
    default: 12,
  },
});

const startItem = computed(() =>
  props.totalItems ? (props.page - 1) * props.perPage + 1 : 0,
);

const endItem = computed(() =>
  Math.min(props.page * props.perPage, props.totalItems),
);
</script>
