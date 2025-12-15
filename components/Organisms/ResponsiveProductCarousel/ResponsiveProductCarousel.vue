<template>
  <OrganismsProductCarouselWeb
    v-if="isDesktopView && products.length"
    :title="title"
    :products="products"
    :colorScheme="colorSchemeDesktop"
  />
  <OrganismsProductCarousel
    v-if="isMobileView && products.length"
    :title="title"
    :products="products"
    :colorScheme="colorSchemeMobile"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ProductType } from "~/types/productType.type";

const props = defineProps<{
  title: string;
  products: ProductType[];
  colorSchemeDesktop?: string;
  colorSchemeMobile?: string;
}>();

const isDesktopView = isDesktop();
const isMobileView = isMobile();

const colorSchemeDesktop = computed(() => props.colorSchemeDesktop ?? "lightHome");
const colorSchemeMobile = computed(() => props.colorSchemeMobile ?? "lightHome");
</script>
