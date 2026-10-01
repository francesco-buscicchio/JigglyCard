<template>
  <!-- Link vero e non un div cliccabile: serve ai motori di ricerca per
       raggiungere le schede prodotto, al cmd+click e alla navigazione da
       tastiera. -->
  <NuxtLink
    :to="productUrl"
    class="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutrals-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-accent-500 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-500"
  >
    <!-- Le immagini CardTrader hanno proporzioni diverse fra loro (carte,
         bustine, box): un riquadro a proporzioni fisse con `object-contain`
         tiene le righe della griglia allineate senza deformare nulla. -->
    <div
      class="relative flex aspect-[63/88] items-center justify-center overflow-hidden bg-neutrals-100 p-3"
    >
      <img
        :src="imageUrl || defaultCardImage"
        :alt="productName"
        loading="lazy"
        class="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
      />
      <span
        v-if="!available"
        class="absolute right-2 top-2 rounded-full bg-neutrals-900/80 px-2 py-1 text-xs font-semibold text-white"
      >
        {{ t("product.card.soldOut") }}
      </span>
    </div>

    <div class="flex flex-1 flex-col gap-y-1 p-3 text-center">
      <h5 ref="productNameRef" class="ellipsis w-full text-base leading-tight">
        {{ formatProductName(productName) }}
      </h5>
      <p class="ellipsis w-full text-sm text-neutrals-500">{{ code }}</p>
      <p class="ellipsis w-full text-sm text-neutrals-500">{{ expansion }}</p>

      <!-- Lingua e condizione sono il dato che determina il prezzo: senza,
           il "a partire da" non dice a cosa si riferisce. -->
      <MoleculesVariantSummary
        :languages="languages"
        :conditions="conditions"
        class="justify-center pt-2"
      />

      <div class="mt-auto pt-3">
        <p v-if="!available" class="price-tag text-lg">
          {{ t("product.card.soldOut") }}
        </p>
        <template v-else>
          <span class="block text-xs text-neutrals-500">
            {{ t("product.card.startingFrom") }}
          </span>
          <span class="price-tag whitespace-nowrap text-xl">{{ price }} €</span>
          <span
            v-if="lowStock"
            class="block text-xs font-semibold text-main-800"
          >
            {{ t("product.card.lastUnits", quantity, { count: quantity }) }}
          </span>
        </template>
      </div>
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
import { computed, type PropType } from "vue";
import { formatProductName } from "~/utils/productUtils";
import defaultCardImage from "@/assets/img/default-card-image.png";

// TODO: separare le props in un file separato
const props = defineProps({
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

/** Sotto le 3 copie vale la pena dirlo: spinge alla decisione. */
const lowStock = computed(
  () => props.available && props.quantity > 0 && props.quantity <= 3,
);

const { t } = useI18n();
const productNameRef = ref<HTMLElement | null>(null);
</script>

