<template>
  <div
    class="w-[100%] h-[100%] flex justify-center flex-col items-center relative"
    :class="containerClass"
  >
    <img
      :src="product.imageUrl"
      :alt="product.productName"
      class="rounded-[16px] w-full h-full"
    />
    <div
      class="absolute layer w-full h-full top-0 flex flex-col gap-2 justify-end items-center border-[3px] border-white rounded-[16px] group px-4 pb-2"
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

    <AtomsButtonCTA
      type="secondary"
      :text="$t('showDetails')"
      v-on:button-clicked="
        navigateTo(`/${product.tcg}/${product.category}/${product.id}`)
      "
      class="relative"
      :class="{ hidden: !isMiddle }"
    />
  </div>
</template>

<script setup lang="ts">
import type { ProductType } from "~/types/product.type";

const props = defineProps({
  product: {
    type: Object as () => ProductType,
    required: true,
  },
  isMiddle: {
    type: Boolean,
    required: true,
  },
});

const containerClass = computed(() => ({
  "w-[100%]": props.isMiddle,
  "w-[80%]": !props.isMiddle,
  "h-[80%]": !props.isMiddle,
  //   "mt-[20%]": !props.isMiddle,
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
