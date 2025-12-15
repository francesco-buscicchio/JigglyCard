<template>
  <div :class="containerClass">
    <h3 :class="titleClass">{{ title }}</h3>
    <div class="flex flex-row m-4 justify-between px-20 gap-x-[4vw]">
      <template v-if="loading || !productList.length">
        <div
          v-for="item in skeletonItems"
          :key="item"
          class="w-64 h-96 bg-neutral-100 rounded-2xl animate-pulse"
        ></div>
      </template>
      <template v-else>
        <div v-for="product in productList" :key="product.id">
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
            :available="product.available"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductType } from "~/types/productType.type";

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
  loading: {
    type: Boolean,
    default: false,
  },
});
const productList = computed(() => props.products ?? []);
const skeletonItems = [0, 1, 2, 3];
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
  if (props.colorScheme == "primaryHome")
    return "text-white text-center w-full pb-4";
  return "text-accent-500 text-center w-full pb-4";
});
</script>
