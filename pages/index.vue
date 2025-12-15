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

    <OrganismsServiceBanner />
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
import { mapProductItem } from "~/mapper/products.mapper";
import type { ProductType } from "~/types/productType.type";

const { t } = useI18n();
const offerte: Ref<ProductType[]> = ref([]);
const novita: Ref<ProductType[]> = ref([]);
const evidenza: Ref<ProductType[]> = ref([]);
const setHeroBanner: Ref<ProductType[]> = ref([]);
const client = useAlgolia();
const isMobileView = isMobile();
const isDesktopView = isDesktop();

onMounted(async () => {
  await fetchHomeSections();
});

async function fetchHomeSections() {
  try {
    const tagRequests = [
      {
        tag: HIGHLIGHTS_TAG,
        hitsPerPage: 5,
        filters: "available:true",
        indexName: PRODUCTS_COLLECTION,
      },
      {
        tag: WHATSNEW_TAG,
        hitsPerPage: 5,
        filters: "available:true",
      },
      {
        tag: DEALS_TAG,
        hitsPerPage: 5,
        filters: "available:true",
      },
      {
        tag: HEROBANNER_TAG,
        hitsPerPage: 3,
        filters: "hasThumbnailImage:true",
      },
    ];

    const { results } = await client.search({
      requests: tagRequests.map(
        ({ tag, hitsPerPage, filters, indexName = "ecommerce" }) => ({
          indexName,
          query: tag,
          hitsPerPage,
          filters,
        })
      ),
    });

    results.forEach((result: any) => setProducts(result));
  } catch (error) {
    console.error("Failed to fetch home sections", error);
  }
}

function setProducts(queryResult: any) {
  let heroBannerTemp: ProductType[] = [];

  for (let hit of queryResult.hits) {
    const product = mapProductItem(hit);
    processTags(hit.tags, product, heroBannerTemp);
  }

  setHeroBanner.value = heroBannerTemp;
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
