<template>
  <h3 class="text-accent-500 text-center w-full pb-4">{{ title }}</h3>
  <MoleculesProductCard
    :productName="productList[currentIndex].productName"
    :code="productList[currentIndex].code"
    :expansion="productList[currentIndex].expansion"
    :price="productList[currentIndex].price"
    :imageUrl="productList[currentIndex].imageUrl"
  />
  <MoleculesCardCarousel
    :items="productList"
    @update:index="updateIndex"
    class="pt-6"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

export type ProductType = {
  productName: string;
  code: string;
  expansion: string;
  price: string;
  imageUrl: string;
};

const props = defineProps({
  products: {
    type: Array<ProductType>,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const currentIndex = ref(0);
const productList = ref(props.products);

function updateIndex(index: number) {
  currentIndex.value = index;
}
</script>

<style scoped>
/* Aggiungi stili specifici qui se necessario */
</style>
