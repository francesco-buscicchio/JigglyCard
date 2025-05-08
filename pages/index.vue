<template>
  <div class="flex flex-col gap-y-6">
    <div class="mx-[4vw] mt-7">
      <MoleculesHeroBanner :slides="setHeroBanner" />
    </div>

    <OrganismsProductCarouselWeb
      v-if="isDesktopView"
      :title="t('highlights')"
      :products="evidenza"
      colorScheme="lightHome"
    />
    <OrganismsProductCarousel
      v-if="isMobileView"
      :title="t('highlights')"
      :products="evidenza"
      colorScheme="lightHome"
    />
    <OrganismsNewsCarouselDesktop
      v-if="isDesktopView"
      :products="novita"
    ></OrganismsNewsCarouselDesktop>

    <OrganismsProductCarousel
      v-if="isMobileView"
      :title="t('whatsnew')"
      :products="novita"
      colorScheme="primaryHome"
    />

    <OrganismsProductCarousel
      v-if="isMobileView"
      :title="t('deals')"
      :products="offerte"
      colorScheme="lightHome"
    />

    <OrganismsProductCarouselWeb
      v-if="isDesktopView"
      :title="t('deals')"
      :products="offerte"
      colorScheme="lightHome"
    />

    <div class="px-4 pb-4">
      <OrganismsServiceBanner />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PRODUCTS_COLLECTION,
  HIGHLIGHTS_TAG,
  WHATSNEW_TAG,
  DEALS_TAG,
  HEROBANNER_TAG,
} from "~/data/const";
import type { ProductType } from "../types/product.type";

const { t } = useI18n();
const config = useRuntimeConfig();
const offerte: Ref<ProductType[]> = ref([]);
const novita: Ref<ProductType[]> = ref([]);
const evidenza: Ref<ProductType[]> = ref([]);
const setHeroBanner: Ref<ProductType[]> = ref([]);
const client = useAlgolia();
const isMobileView = isMobile();
const isDesktopView = isDesktop();

onMounted(async () => {
  //todo: cercare una soluzione per un'unica query
  let results = await client.searchSingleIndex({
    indexName: PRODUCTS_COLLECTION,
    searchParams: { query: HIGHLIGHTS_TAG, hitsPerPage: 5 },
  });
  setProducts(results);
  results = await client.searchSingleIndex({
    indexName: "ecommerce",
    searchParams: { query: WHATSNEW_TAG, hitsPerPage: 5 },
  });
  setProducts(results);
  results = await client.searchSingleIndex({
    indexName: "ecommerce",
    searchParams: { query: DEALS_TAG, hitsPerPage: 5 },
  });
  setProducts(results);
  results = await client.searchSingleIndex({
    indexName: "ecommerce",
    searchParams: { query: HEROBANNER_TAG, hitsPerPage: 5 },
  });
  setProducts(results);
});

function setProducts(queryResult: any) {
  const heroBannerTemp: ProductType[] = [];

  for (let hit of queryResult.hits) {
    const product = createProductObj(hit);
    processTags(hit.tags, product, heroBannerTemp);
  }

  setHeroBanner.value = heroBannerTemp.slice(-3);
}

function createProductObj(hit: any): ProductType {
  return {
    id: hit.objectID,
    productName: hit.name,
    code: hit.code ? `(${hit.code})` : "",
    expansion: hit.expansion || "N.A.",
    price: hit.salePrice ? hit.salePrice.toFixed(2) : "0.00",
    imageUrl:
      hit.thumbnailImage ||
      (hit.images && hit.images.length > 0 ? hit.images[0] : null),
    tcg: hit.tcg,
    category: hit.type,
  };
}

function processTags(
  tags: string[],
  product: ProductType,
  heroBannerTemp: ProductType[]
) {
  for (let tag of tags) {
    switch (tag) {
      case HIGHLIGHTS_TAG:
        addToEvidenza(product);
        break;
      case WHATSNEW_TAG:
        addToNovita(product);
        break;
      case DEALS_TAG:
        addToOfferte(product);
        break;
      case HEROBANNER_TAG:
        heroBannerTemp.push(product);
        break;
    }
  }
}

function addToEvidenza(product: ProductType) {
  if (evidenza.value.length < 5) {
    evidenza.value.push(product);
  }
}

function addToNovita(product: ProductType) {
  if (novita.value.length < 5) {
    novita.value.push(product);
  }
}

function addToOfferte(product: ProductType) {
  if (offerte.value.length < 5) {
    offerte.value.push(product);
  }
}

useHead({
  title: "Jigglycard",
  meta: [
    {
      name: "Jigglycard",
      content:
        "Entra nel magico mondo Pokemon, carte singole, prodotti sealed, permuta collezioni...",
    },
  ],
});
</script>
