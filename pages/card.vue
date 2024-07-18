<template>
  <div class="relative min-h-screen">
    <p style="font-family: 'Roboto Serif'; font-size: 40; font-weight: 400">
      Jigglycard
    </p>
    <p style="font-family: 'Roboto Flex'; font-size: 25; font-weight: 400">
      testo paragrafo esempio
    </p>
    <FilterMobile />
    <div class="flex">
      <FilterDesktop />

      <div class="content-section flex-grow">
        <div class="container mx-auto p-4 bg-white-400">
          <h5 class="font-bold mb-8">{{ $t("FeaturedProducts") }}</h5>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ProductCard from "../components/ProductCard/ProductCard.vue";
import productsData from "../data/products";

const products = ref(productsData);
</script>

<style>
.filters-section {
  width: 300px;
  z-index: 10;
}
</style>
