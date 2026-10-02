<template>
  <div class="carousel-section" :class="containerClass">
    <!-- Titolo fra due fili di luce, come i divisori della home. -->
    <div class="carousel-section__head">
      <span class="carousel-section__line" aria-hidden="true"></span>
      <h3 :class="titleClass">{{ title }}</h3>
      <span class="carousel-section__line carousel-section__line--end" aria-hidden="true"></span>
    </div>
    <!-- Le card hanno una larghezza propria e la riga è centrata: con una
         griglia a colonne fisse, quando i prodotti sono meno delle colonne
         restava metà schermo vuoto. -->
    <div
      class="m-4 flex flex-wrap items-stretch justify-center gap-5 px-6 lg:px-20 [&>*]:w-[calc(50%-0.625rem)] [&>*]:md:w-[calc(33.333%-0.834rem)] [&>*]:xl:w-56"
    >
      <template v-if="loading || !productList.length">
        <div
          v-for="item in skeletonItems"
          :key="item"
          class="aspect-[63/88] bg-neutrals-100 rounded-2xl animate-pulse"
        ></div>
      </template>
      <template v-else>
        <!-- `flex` e non `h-full`: un'altezza in percentuale impedisce lo
             stretch della riga, e le card restavano alte quanto il contenuto. -->
        <div v-for="product in productList" :key="product.id" class="flex">
          <MoleculesProductCardWeb
            :productName="product.productName"
            :code="product.code"
            :expansion="product.expansion"
            :price="product.price"
            :imageUrl="product.imageUrl"
            :color-scheme="colorScheme"
            :tcgSlug="product.tcgSlug"
            :categorySlug="product.categorySlug"
            :id="product.id"
            :available="product.available"
            :languages="product.languages"
            :conditions="product.conditions"
            :quantity="product.quantity"
            :product="product"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductType } from "~/types/productType.type";

const props = defineProps({
  products: {
    type: Array<ProductType>,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  colorScheme: {
    type: String,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
const productList = computed(() => props.products ?? []);
const skeletonItems = [0, 1, 2, 3, 4];
// Niente più fasce piene colorate: la sezione sta sul fondo notte del sito,
// e la variante "primary" diventa un pannello di vetro rosato.
const containerClass = computed(() => {
  switch (props.colorScheme) {
    case "primaryHome":
      return "carousel-section--primary";
    case "lightHome":
      return "carousel-section--light";
    default:
      return "";
  }
});

const titleClass = computed(() => "carousel-section__title");
</script>

<style scoped>
.carousel-section {
  position: relative;
}

.carousel-section--light,
.carousel-section--primary {
  padding: 56px 0 24px;
}

.carousel-section--primary {
  border-radius: 32px;
  border: 1px solid var(--im-line);
  background:
    radial-gradient(80% 120% at 100% 0%, rgba(92, 200, 224, 0.18), transparent 60%),
    radial-gradient(80% 120% at 0% 100%, rgba(236, 145, 160, 0.24), transparent 60%),
    linear-gradient(135deg, #1a1650 0%, #0e1238 100%);
}

.carousel-section__head {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 0 16px 20px;
}

.carousel-section__line {
  flex: 1 1 24px;
  min-width: 16px;
  max-width: 180px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(247, 210, 216, 0.55));
}

.carousel-section__line--end {
  background: linear-gradient(90deg, rgba(92, 200, 224, 0.55), transparent);
}

.carousel-section__title {
  flex: 0 1 auto;
  min-width: 0;
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-weight: 700;
  font-size: clamp(22px, 2.6vw, 32px);
  line-height: 1.15;
  letter-spacing: -0.02em;
  text-align: center;
  text-wrap: balance;
  color: var(--im-ink);
}
</style>
