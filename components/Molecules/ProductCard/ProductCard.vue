<template>
  <!-- Link vero e non un div cliccabile: serve ai motori di ricerca, al
       cmd+click e alla navigazione da tastiera. -->
  <NuxtLink :to="productUrl" :class="containerClass">
    <h5 class="ellipsis w-full leading-tight">
      {{ formatProductName(productName) }}
    </h5>
    <div class="flex gap-x-4">
      <!-- Riquadro a proporzioni fisse: le immagini CardTrader vanno dalla
           carta verticale alla scatola orizzontale. -->
      <div
        class="flex aspect-[63/88] h-36 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutrals-100 p-1"
      >
        <img
          :src="imageUrl || defaultCardImage"
          :alt="productName"
          loading="lazy"
          class="max-h-full max-w-full object-contain"
        />
      </div>
      <div class="flex min-w-0 flex-col gap-y-1">
        <p class="ellipsis text-sm opacity-80">{{ code }}</p>
        <p class="ellipsis text-sm opacity-80">{{ expansion }}</p>
        <MoleculesVariantSummary
          :languages="languages"
          :conditions="conditions"
          :max="2"
          class="pt-1"
        />

        <div v-if="!available" class="pt-2">
          <p class="price-tag text-xl">{{ t("product.card.soldOut") }}</p>
        </div>
        <div v-else class="pt-2">
          <label class="text-xs opacity-80" for="price">
            {{ t("product.card.startingFrom") }}
          </label>
          <p class="price-tag whitespace-nowrap text-2xl">{{ price }} €</p>
          <p v-if="lowStock" class="text-xs font-semibold">
            {{ t("product.card.lastUnits", quantity, { count: quantity }) }}
          </p>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
import { computed, type PropType } from "vue";
import defaultCardImage from "@/assets/img/default-card-image.png";
import { formatProductName } from "~/utils/productUtils";
const { t } = useI18n();
const props = defineProps({
  colorScheme: {
    type: String,
  },
  id: {
    type: String,
  },
  tcgSlug: {
    type: String,
    required: true,
  },
  categorySlug: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  expansion: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  languages: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  conditions: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  quantity: {
    type: Number,
    default: 0,
  },
});

// Slug e non nomi: "Pokémon Singles" produrrebbe una URL con spazi e accenti.
const productUrl = computed(
  () => `/${props.tcgSlug}/${props.categorySlug}/${props.id}`,
);

const lowStock = computed(
  () => props.available && props.quantity > 0 && props.quantity <= 3,
);

const containerClass = computed(() => {
  switch (props.colorScheme) {
    case "primaryHome":
      return "bg-accent-500 text-white border-white border-[1px] mx-4 min-h-80 flex flex-col justify-between p-4 rounded-lg";
    case "lightHome":
      return "bg-white text-neutrals-950 border-[1px] mx-4 border-accent-950 min-h-80 flex flex-col justify-between p-4  rounded-lg";
    case "noBorder":
      return "bg-white text-neutrals-950 mx-4 min-h-80 flex flex-col justify-between p-4";
    default:
      return "rounded-lg shadow-md overflow-hidden w-full min-h-80 flex flex-col justify-between p-4";
  }
});

</script>
