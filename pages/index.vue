<template>
  <div class="flex flex-col gap-y-6">
    <div class="mx-[4vw] mt-7">
      <MoleculesHeroBanner
        :slides="setHeroBanner"
        :loading="heroBannerLoading"
      />
    </div>

    <OrganismsProductCarouselWeb
      v-if="isDesktopView"
      :title="t('home.sections.highlights')"
      :products="evidenza"
      colorScheme="lightHome"
      :loading="highlightsLoading"
    />
    <OrganismsProductCarousel
      v-if="isMobileView"
      :title="t('home.sections.highlights')"
      :products="evidenza"
      colorScheme="lightHome"
      :loading="highlightsLoading"
    />
    <OrganismsNewsCarouselDesktop
      v-if="isDesktopView"
      :products="novita"
      :loading="whatsNewLoading"
    ></OrganismsNewsCarouselDesktop>

    <OrganismsProductCarousel
      v-if="isMobileView"
      :title="t('home.sections.whatsNew')"
      :products="novita"
      colorScheme="primaryHome"
      :loading="whatsNewLoading"
    />

    <OrganismsProductCarousel
      v-if="isMobileView"
      :title="t('home.sections.deals')"
      :products="offerte"
      colorScheme="lightHome"
      :loading="dealsLoading"
    />

    <OrganismsProductCarouselWeb
      v-if="isDesktopView"
      :title="t('home.sections.deals')"
      :products="offerte"
      colorScheme="lightHome"
      :loading="dealsLoading"
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
const highlightsLoading = ref(true);
const whatsNewLoading = ref(true);
const dealsLoading = ref(true);
const heroBannerLoading = ref(true);

onMounted(async () => {
  await fetchHomeData();
});

async function fetchHomeData() {
  evidenza.value = [];
  novita.value = [];
  offerte.value = [];
  setHeroBanner.value = [];

  try {
    const response = await client.search({
      requests: [
        {
          indexName: PRODUCTS_COLLECTION,
          query: HIGHLIGHTS_TAG,
          hitsPerPage: 5,
          filters: "available:true",
        },
        {
          indexName: PRODUCTS_COLLECTION,
          query: WHATSNEW_TAG,
          hitsPerPage: 5,
          filters: "available:true",
        },
        {
          indexName: PRODUCTS_COLLECTION,
          query: DEALS_TAG,
          hitsPerPage: 5,
          filters: "available:true",
        },
        {
          indexName: PRODUCTS_COLLECTION,
          query: HEROBANNER_TAG,
          hitsPerPage: 3,
          filters: "hasThumbnailImage:true",
        },
      ],
    });

    const [
      highlightsResult,
      whatsNewResult,
      dealsResult,
      heroResult,
    ] = response.results || [];

    evidenza.value = mapHitsToProducts(highlightsResult?.hits, 5);
    novita.value = mapHitsToProducts(whatsNewResult?.hits, 5);
    offerte.value = mapHitsToProducts(dealsResult?.hits, 5);
    setHeroBanner.value = mapHitsToProducts(heroResult?.hits, 3);
  } finally {
    highlightsLoading.value = false;
    whatsNewLoading.value = false;
    dealsLoading.value = false;
    heroBannerLoading.value = false;
  }
}

function mapHitsToProducts(
  hits: any[] | undefined,
  limit: number
): ProductType[] {
  if (!hits?.length) return [];
  return hits.slice(0, limit).map((hit) => mapProductItem(hit));
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
