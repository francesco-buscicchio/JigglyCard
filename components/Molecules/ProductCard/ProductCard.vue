<template>
  <!-- Link vero e non un div cliccabile: serve ai motori di ricerca, al
       cmd+click e alla navigazione da tastiera. Il carrello sta fuori dal
       link, in basso a destra: un bottone dentro un <a> non è valido. -->
  <div class="relative" :class="spacingClass">
    <NuxtLink :to="productUrl" class="pcard">
      <!-- Riquadro a proporzioni fisse: le immagini CardTrader vanno dalla
           carta verticale alla scatola orizzontale. -->
      <div class="pcard__media">
        <img
          :src="imageUrl || defaultCardImage"
          :alt="productName"
          loading="lazy"
          class="max-h-full max-w-full object-contain"
        />
      </div>
      <div class="pcard__body">
        <h5 class="pcard__name">{{ formatProductName(productName) }}</h5>
        <p class="pcard__meta">
          <span v-if="code">{{ code }}</span>
          <span v-if="code && expansion" aria-hidden="true"> · </span>
          <span>{{ expansion }}</span>
        </p>
        <MoleculesVariantSummary
          :languages="languages"
          :conditions="conditions"
          :max="2"
          single-line
          class="pt-1"
        />

        <div class="pcard__price">
          <p v-if="!available" class="pcard__soldout">{{ t("product.card.soldOut") }}</p>
          <template v-else>
            <span class="pcard__from">{{ t("product.card.startingFrom") }}</span>
            <span class="pcard__amount">{{ price }} €</span>
            <span v-if="lowStock" class="pcard__low">
              {{ t("product.card.lastUnits", quantity, { count: quantity }) }}
            </span>
          </template>
        </div>
      </div>
    </NuxtLink>
    <!-- Contenitore a parte: il componente ha già `position: relative`, che
         vincerebbe su una classe `absolute` messa direttamente su di lui. -->
    <div v-if="product && available" class="absolute bottom-3 right-3">
      <MoleculesQuickAdd :product="product" compact />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, type PropType } from "vue";
import defaultCardImage from "@/assets/img/default-card-image.png";
import { formatProductName } from "~/utils/productUtils";
import type { ProductType } from "~/types/productType.type";
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

const lowStock = computed(
  () => props.available && props.quantity > 0 && props.quantity <= 3,
);

/**
 * Le varianti di colore di una volta (rosa pieno, bordo petrolio) sono
 * diventate un'unica card di vetro; resta solo il margine laterale, che ai
 * caroselli serve per distanziare le slide e alla lista no.
 */
const spacingClass = computed(() =>
  props.colorScheme === "noBorder" ? "" : "mx-4",
);

</script>

<style scoped>
.pcard {
  display: flex;
  gap: 14px;
  min-height: 9.5rem;
  padding: 12px;
  border-radius: 20px;
  border: 1px solid var(--im-line);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02));
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.pcard:active,
.pcard:hover {
  border-color: rgba(247, 210, 216, 0.45);
}

.pcard:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
}

.pcard__media {
  display: flex;
  height: 8rem;
  aspect-ratio: 63 / 88;
  flex: none;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px;
}

.pcard__body {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  /* Spazio per il pulsante del carrello in basso a destra. */
  padding-right: 44px;
}

.pcard__name {
  overflow: hidden;
  font-size: 16px;
  line-height: 1.2;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.pcard__meta {
  overflow: hidden;
  font-size: 13px;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--im-muted);
}

.pcard__meta span {
  color: inherit;
}

.pcard__price {
  display: flex;
  flex-direction: column;
  margin-top: auto;
}

.pcard__from {
  font-size: 11px;
  color: var(--im-muted);
}

.pcard__amount {
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-size: 20px;
  font-weight: 700;
  white-space: nowrap;
}

.pcard__low {
  font-size: 11px;
  font-weight: 600;
  color: var(--im-pink-strong);
}

.pcard__soldout {
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-size: 16px;
  color: var(--im-muted);
}
</style>
