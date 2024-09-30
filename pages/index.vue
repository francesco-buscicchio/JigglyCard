<template>
  <div class="flex flex-col gap-y-6">
    <div class="px-4 pt-4">
      <MoleculesHeroBanner :slides="setHeroBanner" />
    </div>

    <OrganismsProductCarousel :title="$t('highlights')" :products="evidenza" colorScheme="lightHome" />

    <OrganismsProductCarousel :title="$t('whatsnew')" :products="novita" colorScheme="primaryHome" />

    <OrganismsProductCarousel :title="$t('deals')" :products="offerte" colorScheme="lightHome" />

    <div class="px-4 pb-4">
      <OrganismsServiceBanner :sections="sectionsDataService" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Ossidiana from "~/assets/img/Ossidiana.jpg";
import { type ProductType } from "~/components/Organisms/ProductCarousel/ProductCarousel.vue";
import { algoliasearch } from "algoliasearch";
import {
  PRODUCTS_COLLECTION,
  HIGHLIGHTS_TAG,
  WHATSNEW_TAG,
  DEALS_TAG,
  HEROBANNER_TAG
} from "~/data/const";

const { t } = useI18n();

const config = useRuntimeConfig();
const offerte: Ref<ProductType[]> = ref([]);
const novita: Ref<ProductType[]> = ref([]);
const evidenza: Ref<ProductType[]> = ref([]);
const setHeroBanner: Ref<ProductType[]> = ref([]);
const client = algoliasearch(
  config.public.ALGOLIA_APPLICATION_ID,
  config.public.ALGOLIA_API_KEY
);

onMounted(async () => {
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

const sectionsDataService = [
  {
    title: t("serviceHomepage.FastShipping"),
    sections: [{ value: t("serviceHomepage.FastShippingDescription") }],
    imgUrl: "jig:truck",
  },
  {
    title: t("serviceHomepage.Support"),
    sections: [t("serviceHomepage.SupportDescription")],
    imgUrl: "jig:support",
  },
  {
    title: t("serviceHomepage.Prices"),
    sections: [t("serviceHomepage.PricesDescription")],
    imgUrl: "jig:prices",
  },
  {
    title: t("serviceHomepage.Security"),
    sections: [t("serviceHomepage.SecurityDescription")],
    imgUrl: "jig:security",
  },
];
</script>
