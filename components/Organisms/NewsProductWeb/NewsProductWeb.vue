<template>
  <img
    :src="product.imageUrl"
    :alt="product.productName"
    class="rounded-[16px]"
    :class="imgClass"
  />
  <div
    class="absolute layer w-[100%] h-[100%] top-0 flex flex-col gap-2 justify-end items-center border-[3px] border-white rounded-[16px] group px-4 pb-2"
    :class="layerClass"
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
      <p class="ml-5 font-bold inline text-2xl">{{ product.price }} €</p></label
    >
    <div
      class="absolute hidden group-hover:block text-accent-500 bg-white text-[10px] rounded p-1 bottom-[50%] transform max-w-xs whitespace-no-wrap"
    >
      {{ product.productName }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductType } from "~/types/product.type";

const props = defineProps({
  product: {
    type: Object as () => ProductType,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

const layerClass = computed(() => ({
  "w-[100%]": props.index === 1,
  "w-[80%]": props.index !== 1,
  "h-[80%]": props.index !== 1,
  "mt-10": props.index !== 1,
}));

const imgClass = computed(() => ({
  "w-[100%]": props.index === 1,
  "w-[80%]": props.index !== 1,
  "mt-10": props.index !== 1,
}));
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

