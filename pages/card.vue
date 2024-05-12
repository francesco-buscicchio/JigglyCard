<template>
  <div class="relative min-h-screen">
    <HeaderMobile class="w-full lg:hidden" :header="{ cartCount: 9 }" />
    <HeaderDesktop class="hidden w-full lg:block" :header="{ cartCount: 9 }" />
    <FilterMobile />
    <div class="flex">
      <FilterDesktop />

      <div class="content-section flex-grow">
        <div class="container mx-auto p-4 bg-white-400">
          <h1 class="text-xl font-bold mb-8">{{ $t("FeaturedProducts") }}</h1>
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
import HeaderMobile from "../components/HeaderMobile/HeaderMobile.vue";
import HeaderDesktop from "../components/HeaderDesktop/HeaderDesktop.vue";
import productsData from "../data/products";

const products = ref(productsData);
</script>

<style>
.filters-section {
  width: 300px;
  z-index: 10;
}
</style>
