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
          <OrganismsNewsProductWeb :product="product" :index="index" />

          <AtomsButtonCTA
            type="secondary"
            :text="$t('showDetails')"
            v-on:button-clicked="
              navigateTo(`/${product.tcg}/${product.category}/${product.id}`)
            "
            class="relative"
            :class="{ hidden: index != 1 }"
          />
        </div>
      </div>

      <button
        @click="next"
        class="cursor-pointer mx-10"
        :disabled="currentIndex + 3 >= props.products.length"
      >
        <Icon name="jig:arrow-right" size="50" />
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
