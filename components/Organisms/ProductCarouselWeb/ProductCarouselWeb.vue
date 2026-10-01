<template>
  <div :class="containerClass">
    <h3 :class="titleClass">{{ title }}</h3>
    <!-- Le card hanno una larghezza propria e la riga è centrata: con una
         griglia a colonne fisse, quando i prodotti sono meno delle colonne
         restava metà schermo vuoto. -->
    <div
      class="m-4 flex flex-wrap items-stretch justify-center gap-5 px-6 lg:px-20 [&>*]:w-[calc(50%-0.625rem)] [&>*]:md:w-[calc(33.333%-0.834rem)] [&>*]:xl:w-56"
    >
      <template v-if="loading || !productList.length">
        <div
          v-for="item in skeletonItems"
          :key="item"
          class="aspect-[63/88] bg-neutrals-100 rounded-2xl animate-pulse"
        ></div>
      </template>
      <template v-else>
        <div v-for="product in productList" :key="product.id" class="h-full">
          <MoleculesProductCardWeb
            :productName="product.productName"
            :code="product.code"
            :expansion="product.expansion"
            :price="product.price"
            :imageUrl="product.imageUrl"
            :color-scheme="colorScheme"
            :tcgSlug="product.tcgSlug"
            :categorySlug="product.categorySlug"
            :id="product.id"
            :available="product.available"
            :languages="product.languages"
            :conditions="product.conditions"
            :quantity="product.quantity"
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
const skeletonItems = [0, 1, 2, 3, 4];
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
