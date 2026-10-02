<template>
  <p class="hidden">
    {{ containerClass }}
  </p>
  <div
    class="flex flex-col items-center relative transition-transform duration-200 ease-in-out"
    :class="containerClass"
  >
    <!-- Riquadro a proporzioni fisse: le immagini vanno dalla carta verticale
         alla bustina orizzontale, e senza un'area prevedibile la scritta in
         sovrimpressione finiva sopra l'illustrazione. -->
    <div
      class="flex aspect-[63/88] w-full min-w-47 items-center justify-center overflow-hidden rounded-2xl bg-accent-950"
    >
      <img
        :src="product.imageUrl || defaultCardImage"
        :alt="product.productName"
        class="max-h-full max-w-full object-contain"
      />
    </div>
    <div
      class="absolute layer w-full aspect-[63/88] top-0 flex flex-col lg:gap-[2%] xl:gap-[5%] justify-end items-center border-[3px] border-white rounded-2xl group px-4 pb-4"
      :class="layerClass"
    >
      <h5
        class="overflow-hidden whitespace-nowrap text-ellipsis w-full text-center"
      >
        {{ product.productName }}
      </h5>
      <p class="xl:text-lg lg:text-base">{{ product.code }}</p>
      <p class="xl:text-lg lg:text-base">{{ product.expansion }}</p>
      <div v-if="!product.available">
        <p class="text-2xl price-tag">{{ t("product.card.soldOut") }}</p>
      </div>
      <div v-else>
        <label class="lg:text-xs xl:text-sm" for="product.price"
          >{{ t("product.card.startingFrom") }}
        </label>
        <p class="ml-5 font-bold inline lg:text-2xl xl:text-3xl">
          {{ product.price }} €
        </p>
      </div>
      <div
        class="absolute hidden group-hover:block text-accent-500 bg-accent-10 text-[2wv] rounded p-1 bottom-1/2 transform max-w-xs whitespace-no-wrap"
      >
        {{ product.productName }}
      </div>
    </div>

    <NuxtLink
      :to="`/${product.tcgSlug}/${product.categorySlug}/${product.id}`"
      class="relative"
      :class="{ hidden: !isMiddle }"
    >
      <AtomsButtonCTA
        type="secondary"
        :text="t('catalog.actions.showDetails')"
      />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { ProductType } from "~/types/productType.type";
import defaultCardImage from "@/assets/img/default-card-image.png";

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

// Scala proporzionale: isMiddle = 100%, altrimenti 75%
const containerClass = computed(() => {
  return props.isMiddle ? "scale-100 w-full" : "scale-75 w-full";
});

const layerClass = computed(() => ({
  "pb-[20%]": props.isMiddle,
}));
</script>

<style scoped>
/* Sfumatura più estesa e opaca: il testo va letto anche sopra le carte
   dall'illustrazione chiara. */
.layer {
  background-image: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 30%,
    rgba(0, 56, 73, 0.85) 55%,
    #003849 75%
  );
}
</style>
