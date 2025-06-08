<template>
  <div class="gap-b-4 flex flex-col px-4">
    <MoleculesBreadcrumb />
  </div>
  <h1 class="text-accent-500 text-center pb-8">{{ t("cart") }}</h1>
  <div class="lg:flex lg:gap-20 lg:mx-20">
    <div class="lg:flex-1">
      <div
        v-for="(item, index) of products"
        :key="index"
        :class="[
          'mx-5 py-4 border-t-[2px] border-neutral-200',
          { 'border-b-[2px]': index === products.length - 1 },
        ]"
      >
        <MoleculesCartCard
          :image="item.image"
          :selectedQuantity="item.selectedQuantity"
          :availableQuantity="item.availableQuantity"
          :price="item.price"
          :alt="item.title"
        >
          <div>
            <h5 class="pb-2 text-lg">{{ formatProductName(item.title) }}</h5>
            <p class="pb-2" v-show="isDesktopView">
              {{ extractProductCode(item.title) }}
            </p>
            <p class="pb-2">{{ item.language }}</p>
            <p class="pb-2">{{ item.condition }}</p>
          </div>
        </MoleculesCartCard>
      </div>
    </div>
      <div class="lg:bg-accent-50 lg:rounded-lg lg:w-[430px] lg:mb-20">
      <OrganismsShippingMode :total-cart="totalCart" />
    </div>
  </div>

  <OrganismsProductCarouselWeb
    v-if="isDesktopView"
    :title="t('suggested')"
    :products="suggested"
    colorScheme="lightHome"
  />
  <OrganismsProductCarousel
    v-if="isMobileView"
    :title="t('suggested')"
    :products="suggested"
    colorScheme="lightHome"
  />
</template>

<script lang="ts" setup>
import type { SearchResponse } from "algoliasearch";
import blastoise from "~/assets/blastoise_ex_mew_009.png";
import { HIGHLIGHTS_TAG, PRODUCTS_COLLECTION } from "~/data/const";
import type { SearchProductResult } from "~/interface/searchProductResult.interface";
import type { ProductType } from "~/types/productType.type";
import { formatProductName, extractProductCode } from "~/utils/productUtils";

const { t } = useI18n();
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

const totalCart = computed(() => {
  return products
    .reduce((acc, item) => acc + item.price * item.selectedQuantity, 0)
    .toFixed(2);
});
</script>
