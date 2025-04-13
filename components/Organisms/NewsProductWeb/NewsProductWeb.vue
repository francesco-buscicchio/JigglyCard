<template>
  <div
    class="w-full h-full flex justify-center flex-col items-center relative"
    :class="containerClass"
  >
    <img
      :src="product.imageUrl"
      :alt="product.productName"
      class="rounded-2xl w-full h-full min-w-47"
    />
    <div
      class="absolute min-w-47 layer w-full h-full top-0 flex flex-col lg:gap-[2%] xl:gap-[5%] justify-end items-center border-[3px] border-white rounded-2xl group px-4 pb-4"
      :class="layerClass"
    >
      <h5
        class="overflow-hidden whitespace-nowrap text-ellipsis w-full text-center"
      >
        {{ product.productName }}
      </h5>
      <p class="xl:text-lg lg:text-base">{{ product.code }}</p>
      <p class="xl:text-lg lg:text-base">{{ product.expansion }}</p>
      <label class="lg:text-xs xl:text-sm"
        >{{ t("startingFrom") }}
        <p class="ml-5 font-bold inline lg:text-2xl xl:text-3xl">
          {{ product.price }} €
        </p></label
      >
      <div
        class="absolute hidden group-hover:block text-accent-500 bg-white text-[2wv] rounded p-1 bottom-1/2 transform max-w-xs whitespace-no-wrap"
      >
        {{ product.productName }}
      </div>
    </div>

    <AtomsButtonCTA
      type="secondary"
      :text="t('showDetails')"
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

const { t } = useI18n();
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
  "w-full": props.isMiddle,
  "w-5/6": !props.isMiddle,
  "h-5/6": !props.isMiddle,
}));
const layerClass = computed(() => ({
  "pb-[20%]": props.isMiddle,
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
