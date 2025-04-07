<template>
  <div>
    <div class="flex relative flex-col">
      <img
        :src="imageUrl"
        :alt="productName"
        class="max-h-[20vw] w-[13vw] object-cover rounded-2xl"
      />

      <!-- da correggere -->
      <div class="w-[13vw] h-[20vw] px-2 pt-[10vw] absolute layer">
        <div
          class="relative group flex flex-col gap-y-2 items-center cursor-default pt-2"
        >
          <h5
            ref="productNameRef"
            class="overflow-hidden whitespace-nowrap text-ellipsis w-full text-center"
          >
            {{ formatProductName(productName) }}
          </h5>
          <p class="text-lg">{{ code }}</p>
          <p class="text-lg">{{ expansion }}</p>
          <label class="text-xs"
            >{{ $t("startingFrom") }}
            <p
              class="ml-1 xl:ml-4 lg:ml-2 font-bold inline text-base xl:text-2xl"
            >
              {{ price }} €
            </p></label
          >
          <div
            v-if="isProductNameOverflowing"
            class="absolute hidden group-hover:block bg-accent-500 text-white text-[10px] rounded p-1 bottom-full transform max-w-xs whitespace-no-wrap"
          >
            {{ formatProductName(productName) }}
          </div>
        </div>
      </div>

      <div class="mt-12">
        <AtomsButtonCTA
          :type="buttonCtaType"
          :text="$t('showDetails')"
          v-on:button-clicked="navigateTo(`/${tcg}/${category}/${id}`)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ProductCard } from "~/types/product.type";
import { formatProductName } from "~/utils/productUtils";
// TODO: separare le props in un file separato
const props = defineProps<ProductCard>();

const productNameRef = ref<HTMLElement | null>(null);
const isProductNameOverflowing = ref(false);

const checkTruncation = () => {
  if (productNameRef.value) {
    isProductNameOverflowing.value =
      productNameRef.value.scrollWidth > productNameRef.value.clientWidth;
  }
};

onMounted(() => {
  nextTick(() => {
    checkTruncation();
  });
  window.addEventListener("resize", checkTruncation);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkTruncation);
});

const buttonCtaType = computed(() => {
  switch (props.colorScheme) {
    case "primaryHome":
      return "secondary";
    case "lightHome":
      return "primary";
    default:
      return "primary";
  }
});
</script>

<style scoped>
.layer {
  background-image: -webkit-linear-gradient(
    0deg,
    #ffffff 10%,
    rgba(0, 0, 0, 0) 50%
  );
  background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 10%, #fff 50%);
}
</style>
