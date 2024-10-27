<template>
  <div class="flex flex-col items-center bg-accent-500 text-white py-30">
    <h2 class="mb-18">{{ $t("whatsnew") }}</h2>
    <div class="flex w-[100vw] justify-center">
      <button
        @click="prev"
        class="cursor-pointer mx-10"
        :disabled="currentIndex === 0"
      >
        <Icon name="jig:arrow-left" size="50" />
      </button>
      <div class="flex w-[80vw] justify-center gap-[10%]">
        <div
          v-for="(product, index) in visibleProducts"
          :key="index"
          class="relative cursor-pointer"
        >
          <img
            :src="product.imageUrl"
            :alt="product.productName"
            class="w-[100%] rounded-[16px]"
          />
          <div
            class="absolute layer w-[100%] h-[100%] top-0 flex flex-col gap-2 justify-end items-center border-[3px] border-white rounded-[16px] group px-4 pb-2"
          >
            <h5
              class="overflow-hidden whitespace-nowrap text-ellipsis w-full text-center"
            >
              {{ product.productName }}
            </h5>
            <p class="text-lg">{{ product.code }}</p>
            <p class="text-lg">{{ product.expansion }}</p>
            <label class="text-xs"
              >{{ $t("startingFrom") }}
              <p class="ml-5 font-bold inline text-2xl">
                {{ product.price }} €
              </p></label
            >
            <div
              class="absolute hidden group-hover:block text-accent-500 bg-white text-[10px] rounded p-1 bottom-[50%] transform max-w-xs whitespace-no-wrap"
            >
              {{ product.productName }}
            </div>
          </div>
        </div>
      </div>

      <button
        @click="next"
        class="cursor-pointer mx-10"
        :disabled="currentIndex + 3 >= props.products.length"
      >
        <Icon name="jig:arrow-right" size="50"/>
      </button>
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
});
console.log("props", props.products);
const currentIndex = ref(0);
const productList = computed(() => props.products.slice(0, 9));

const visibleProducts = computed(() => {
  return productList.value.slice(currentIndex.value, currentIndex.value + 3);
});

const next = () => {
  if (currentIndex.value + 3 < productList.value.length) {
    currentIndex.value++;
  }
};

const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};
</script>

<style scoped>
.layer {
  background-image: -webkit-linear-gradient(
    0deg,
    #006482 40%,
    rgba(0, 0, 0, 0) 60%
  );
  background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 40%, #006482 60%);
}
</style>
