<template>
  <div class="gap-b-4 flex flex-col px-4">
    <MoleculesBreadcrumb />
  </div>
  <h1 class="text-accent-500 text-center pb-8">{{ $t("cart") }}</h1>
  <div
    v-for="(item, index) of products"
    :key="index"
    class="border-t-[2px] border-neutral-200 mx-5 pt-4 pb-2"
  >
    <MoleculesCartCard
      :image="item.image"
      :selectedQuantity="item.selectedQuantity"
      :availableQuantity="item.availableQuantity"
      :price="item.price"
    >
      <div>
        <h5 class="pb-2">{{ item.title }}</h5>
        <p class="pb-2">{{ item.language }}</p>
        <p class="pb-2">{{ item.condition }}</p>
      </div>
    </MoleculesCartCard>
  </div>
  
    <OrganismsShippingMode :total-cart="totalCart" />

  <OrganismsProductCarouselWeb
    v-if="isDesktopView"
    :title="$t('suggested')"
    :products="suggested"
    colorScheme="lightHome"
  />
  <OrganismsProductCarousel
    v-if="isMobileView"
    :title="$t('suggested')"
    :products="suggested"
    colorScheme="lightHome"
  />
</template>

<script lang="ts" setup>
import type { SearchResponse } from "algoliasearch";
import blastoise from "~/assets/blastoise_ex_mew_009.png";
import { HIGHLIGHTS_TAG, PRODUCTS_COLLECTION, SUGGESTED } from "~/data/const";
import {
  type SearchProductResult,
  type ProductType,
} from "~/types/product.type";
const isMobileView = isMobile();
const isDesktopView = isDesktop();
const suggested: Ref<ProductType[]> = ref([]);
const client = useAlgolia();
const products = [
  {
    image: blastoise,
    selectedQuantity: 1,
    availableQuantity: 4,
    price: 8,
    title: "Blastoise ex (MEW 009)",
    language: "Italiano",
    condition: "Near Mint",
  },
  {
    image: blastoise,
    selectedQuantity: 1,
    availableQuantity: 4,
    price: 8,
    title: "Blastoise ex (MEW 009)",
    language: "Italiano",
    condition: "Near Mint",
  },
  {
    image: blastoise,
    selectedQuantity: 1,
    availableQuantity: 4,
    price: 8,
    title: "Blastoise ex (MEW 009)",
    language: "Italiano",
    condition: "Near Mint",
  },
  {
    image: blastoise,
    selectedQuantity: 1,
    availableQuantity: 4,
    price: 8,
    title: "Blastoise ex (MEW 009)",
    language: "Italiano",
    condition: "Near Mint",
  },
];

onMounted(async () => {
  let results = await client.searchSingleIndex<SearchProductResult>({
    indexName: PRODUCTS_COLLECTION,
    // TODO: change to SUGGESTED after create query params
    // searchParams: { query: SUGGESTED, hitsPerPage: 5 },
    searchParams: { query: HIGHLIGHTS_TAG, hitsPerPage: 5 },
  });
  setProduct(results);
});

const totalCart = computed(() => {
  return products
    .reduce((acc, item) => acc + item.price * item.selectedQuantity, 0)
    .toFixed(2);
});

const setProduct = (queryResult: SearchResponse<SearchProductResult>) => {
  queryResult.hits.forEach((hit: any) => {
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

    suggested.value.push(obj);
  });
};
</script>
