<template>
  <div v-for="product of products" :key="product.id" class="h-full">
    <MoleculesProductCardWeb
      :productName="product.productName"
      :code="product.code"
      :expansion="product.expansion"
      :price="product.price"
      :imageUrl="product.imageUrl"
      color-scheme="lightHome"
      :tcgSlug="product.tcgSlug"
      :categorySlug="product.categorySlug"
      :id="product.id"
      :available="product.available"
      :languages="product.languages"
      :conditions="product.conditions"
      :quantity="product.quantity"
      :product="product"
    />
  </div>
</template>

<script setup lang="ts">
import type { ProductType } from "~/types/productType.type";

const props = defineProps({
  products: Array as () => ProductType[],
});
</script>
