<template>
  <div v-for="product of products" :key="product.id" class="pb-3">
    <MoleculesProductCard
      :productName="product.productName"
      :code="product.code"
      :expansion="product.expansion"
      :price="product.price"
      :imageUrl="product.imageUrl"
      :tcgSlug="product.tcgSlug"
      :categorySlug="product.categorySlug"
      :id="product.id"
      color-scheme="noBorder"
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

defineProps({
  products: Array as () => ProductType[],
});
</script>
