<template>
  <article
    class="pcw group relative flex h-full w-full flex-col rounded-2xl transition duration-200 hover:-translate-y-1"
  >
    <!-- Link vero e non un div cliccabile: serve ai motori di ricerca per
         raggiungere le schede prodotto, al cmd+click e alla navigazione da
         tastiera. Il pulsante del carrello sta fuori dal link: un bottone
         dentro un <a> non è valido e il click aprirebbe la scheda. -->
    <NuxtLink
      :to="productUrl"
      class="flex flex-1 flex-col rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-500"
    >
      <!-- Le immagini CardTrader hanno proporzioni diverse fra loro (carte,
           bustine, box): un riquadro a proporzioni fisse con `object-contain`
           tiene le righe della griglia allineate senza deformare nulla. -->
      <div
        class="pcw__media relative flex aspect-[63/88] items-center justify-center overflow-hidden rounded-t-2xl p-3"
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

      <div class="flex flex-1 flex-col gap-y-1 p-3 pb-2 text-center">
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
          :max="2"
          single-line
          class="h-7 justify-center pt-2"
        />
      </div>
    </NuxtLink>

    <!-- Altezza fissa: con o senza "Ultimo pezzo" ed "Esaurito" tutte le card
         della riga restano alte uguali. -->
    <div class="mt-auto flex min-h-[64px] items-end justify-between gap-2 px-3 pb-3">
      <p v-if="!available" class="price-tag text-lg">
        {{ t("product.card.soldOut") }}
      </p>
      <div v-else class="min-w-0">
        <span class="block text-xs text-neutrals-500">
          {{ t("product.card.startingFrom") }}
        </span>
        <span class="price-tag block whitespace-nowrap text-xl leading-tight">{{ price }} €</span>
        <span class="block h-4 truncate text-xs font-semibold leading-4 text-main-800">
          <template v-if="lowStock">
            {{ t("product.card.lastUnits", quantity, { count: quantity }) }}
          </template>
        </span>
      </div>
      <MoleculesQuickAdd
        v-if="product && available"
        :product="product"
        compact
        class="shrink-0"
      />
    </div>
  </article>
</template>

<script lang="ts" setup>
import { computed, type PropType } from "vue";
import { formatProductName } from "~/utils/productUtils";
import defaultCardImage from "@/assets/img/default-card-image.png";
import type { ProductType } from "~/types/productType.type";

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
  /** Prodotto completo, con le varianti: abilita l'aggiunta al carrello. */
  product: {
    type: Object as PropType<ProductType>,
    default: null,
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

<style scoped>
/* Vetro sfumato con un alone rosa al passaggio: le card della griglia
   parlano la stessa lingua della home. */
.pcw {
  border: 1px solid var(--im-line);
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.015));
}

.pcw:hover,
.pcw:focus-within {
  border-color: rgba(247, 210, 216, 0.5);
  box-shadow:
    0 24px 50px -24px rgba(0, 0, 0, 0.8),
    0 0 0 1px rgba(247, 210, 216, 0.08),
    0 0 40px -12px rgba(236, 145, 160, 0.35);
}

.pcw__media {
  background:
    radial-gradient(70% 60% at 50% 40%, rgba(167, 139, 250, 0.12), transparent 70%),
    rgba(255, 255, 255, 0.03);
}
</style>
