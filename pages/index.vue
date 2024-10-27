<template>
  <div class="flex flex-col gap-y-6">
    <div class="mx-[4%] mt-7">
      <MoleculesHeroBanner :slides="setHeroBanner" />
    </div>

    <OrganismsProductCarouselWeb
      v-if="isDesktopView"
      :title="$t('highlights')"
      :products="evidenza"
      colorScheme="lightHome"
    />
    <OrganismsProductCarousel
      v-if="isMobileView"
      :title="$t('highlights')"
      :products="evidenza"
      colorScheme="lightHome"
    />

    <OrganismsProductCarousel
      :title="$t('whatsnew')"
      :products="novita"
      colorScheme="primaryHome"
    />

    <OrganismsProductCarousel
      :title="$t('deals')"
      :products="offerte"
      colorScheme="lightHome"
    />

    <div class="px-4 pb-4">
      <OrganismsServiceBanner />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type ProductType } from "~/components/Organisms/ProductCarousel/ProductCarousel.vue";
import {
  PRODUCTS_COLLECTION,
  HIGHLIGHTS_TAG,
  WHATSNEW_TAG,
  DEALS_TAG,
  HEROBANNER_TAG,
} from "~/data/const";
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
    searchParams: { query: HIGHLIGHTS_TAG },
  });
  setProducts(results);
  results = await client.searchSingleIndex({
    indexName: "ecommerce",
    searchParams: { query: WHATSNEW_TAG },
  });
  setProducts(results);
  results = await client.searchSingleIndex({
    indexName: "ecommerce",
    searchParams: { query: DEALS_TAG },
  });
  setProducts(results);
  results = await client.searchSingleIndex({
    indexName: "ecommerce",
    searchParams: { query: HEROBANNER_TAG },
  });
  setProducts(results);
});

function setProducts(queryResult: any) {
  const heroBannerTemp: ProductType[] = [];
  for (let hit of queryResult.hits) {
    const obj = {
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

    for (let tag of hit.tags) {
      switch (tag) {
        case HIGHLIGHTS_TAG:
          evidenza.value.push(obj);
          break;
        case WHATSNEW_TAG:
          novita.value.push(obj);
          break;
        case DEALS_TAG:
          offerte.value.push(obj);
          break;
        case HEROBANNER_TAG:
          heroBannerTemp.push(obj);
          break;
      }
    }
  }
  setHeroBanner.value = heroBannerTemp.slice(-3);
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
