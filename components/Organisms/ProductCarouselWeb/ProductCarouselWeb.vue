<template>
  <div :class="containerClass">
    <h3 :class="titleClass">{{ title }}</h3>
    <div class="flex flex-row m-4 justify-center gap-x-18">
      <div v-for="product in productList">
        <MoleculesProductCardWeb
          :productName="product.productName"
          :code="product.code"
          :expansion="product.expansion"
          :price="product.price"
          :imageUrl="product.imageUrl"
          :color-scheme="colorScheme"
          :tcg="product.tcg"
          :category="product.category"
          :id="product.id"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductType } from "~/types/product.type";

const props = defineProps({
  products: {
    type: Array<ProductType>,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  colorScheme: {
    type: String,
  },
});
const productList = ref(props.products);
const containerClass = computed(() => {
  switch (props.colorScheme) {
    case "primaryHome":
      return "bg-accent-500 pt-10 pb-6";
    case "lightHome":
      return "bg-white pt-10 pb-6";
    default:
      return "";
  }
});

const titleClass = computed(() => {
  switch (props.colorScheme) {
    case "primaryHome":
      return "text-white text-center w-full pb-4";
    default:
      return "text-accent-500 text-center w-full pb-4";
  }
});
</script>
