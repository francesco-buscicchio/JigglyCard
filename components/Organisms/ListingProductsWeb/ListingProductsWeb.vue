<template>
  <div v-for="product of products" class="flex justify-center">
    <MoleculesProductCardWeb
      :productName="product.productName"
      :code="product.code"
      :expansion="product.expansion"
      :price="product.price"
      :imageUrl="product.imageUrl"
      color-scheme="lightHome"
      :tcg="product.tcg"
      :category="product.category"
      :id="product.id"
    />
  </div>
</template>

<script setup lang="ts">
import type { ProductType } from "~/types/product.type";

const props = defineProps({
  products: Array as () => ProductType[],
});
</script>
