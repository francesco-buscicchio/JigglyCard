<template>
  <div>
    <div class="flex relative flex-col cursor-pointer w-[13vw]">
      <!-- Immagine -->
      <img
        :src="imageUrl ?? defaultCardImage"
        :alt="productName"
        class="w-full object-cover rounded-2xl"
        :style="{ maxHeight: '20vw' }"
      />

      <!-- Overlay sfumato sopra l’immagine -->
      <div
        class="absolute top-0 w-full h-full layer pointer-events-none rounded-2xl"
      ></div>

      <!-- Contenuto -->
      <div
        class="flex flex-col items-center gap-y-2 pt-2 px-2 bg-white -mt-40 relative z-10 rounded-b-2xl"
      >
        <h5 ref="productNameRef" class="ellipsis text-center w-full">
          {{ formatProductName(productName) }}
        </h5>
        <p class="text-lg ellipsis w-full text-center">{{ code }}</p>
        <p class="text-lg ellipsis w-full text-center">{{ expansion }}</p>

        <div v-if="price === '100000.00'">
          <p class="text-2xl price-tag">{{ t("soldOut") }}</p>
        </div>
        <div v-else>
          <label class="text-xs text-center" for="price">
            {{ t("startingFrom") }}
            <p class="ml-1 price-tag inline text-base xl:text-2xl">
              {{ price }} €
            </p>
          </label>
        </div>

        <AtomsButtonCTA
          :type="buttonCtaType"
          :text="t('showDetails')"
          class="mt-2"
          v-on:button-clicked="goTo(`/${tcg}/${category}/${id}`)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ProductCard } from "~/types/productCard.type";
import { formatProductName } from "~/utils/productUtils";
import { goTo } from "@/utils/navigationUtils";
import defaultCardImage from "@/assets/img/default-card-image.png";

// TODO: separare le props in un file separato
const props = defineProps<ProductCard>();

const { t } = useI18n();
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
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    #fff 40%
  );
}
</style>
