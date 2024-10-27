<template>
  <div v-for="product of products" class="border-t-[2px] border-primary-950">
    <MoleculesProductCard
      :productName="product.productName"
      :code="product.code"
      :expansion="product.expansion"
      :price="product.price"
      :imageUrl="product.imageUrl"
      :tcg="product.tcg"
      :category="product.category"
      :id="product.id"
      color-scheme="noBorder"
    />
  </div>
</template>

<script setup lang="ts">
import type { ProductType } from '~/pages/[tcg]/[category]/[subcategory]/product.type';

const props = defineProps({
  products: Array as () => ProductType[],
});
</script>
