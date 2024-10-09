<template>
  <div class="gap-b-4 flex flex-col px-4">
    <MoleculesBreadcrumb />
  </div>
  <div class="gap-b-4 flex flex-col">
    <div class="mx-8">
      <div class="pb-6">
        <OrganismsFilter @filterUpdate="filterUpdate" />
      </div>

      <OrganismsListingFilters />

      <div class="pb-6 flex flex-row justify-between items-center">
        <MoleculesItemsCounter
          :totalItems="totalItems"
          :itemForPage="itemsPerPage"
          :page="currentPage"
        />

        <div class="flex flex-row items-center gap-x-2">
          <p>{{ $t("pageSorting.sortBy") }}</p>
          <div class="max-w-40">
            <MoleculesPageSorter @handle-sorting="handleSorting" />
          </div>
        </div>
      </div>
      <OrganismsListingProducts :products="products" />
      <MoleculesListingPagination
        :total-items="totalItems"
        :items-per-page="itemsPerPage"
        :current-page="currentPage"
        @current-page="($e) => changePage($e)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { algoliasearch } from "algoliasearch";
import { PRODUCTS_COLLECTION } from "~/data/const";

import type { ProductType } from "~/components/Organisms/ProductCarousel/ProductCarousel.vue";
const products: Ref<ProductType[]> = ref([]);

const config = useRuntimeConfig();
const client = algoliasearch(
  config.public.ALGOLIA_APPLICATION_ID,
  config.public.ALGOLIA_API_KEY
);
const route = useRoute();
const totalItems = ref(0);
const itemsPerPage = ref(9);
const currentPage = ref(1);
const currentSorting = ref("");

onMounted(async () => {
  if (route.query.page) currentPage.value = Number(route.query.page);
  fetchData();
});

function filterUpdate(e: any) {
  console.log(e);
}

function changePage(event: number) {
  currentPage.value = event;
  fetchData();
}

function handleSorting(event: string) {
  currentSorting.value = event;
  fetchData();
}

function calculateCollection() {
  return `${PRODUCTS_COLLECTION}${currentSorting.value}`;
}

async function fetchData() {
  let results = await client.search({
    requests: [
      {
        indexName: calculateCollection(),
        filters: `type:"${route.params.category}"`,
        hitsPerPage: itemsPerPage.value,
        page: currentPage.value - 1,
      },
    ],
  });
  setProducts(results.results[0]);
}

function setProducts(queryResult: any) {
  products.value = [];
  for (let hit of queryResult.hits) {
    const obj = {
      productName: hit.name,
      code: hit.code ? `(${hit.code})` : "",
      expansion: hit.expansion || "N.A.",
      price: hit.salePrice ? hit.salePrice.toFixed(2) : "0.00",
      imageUrl:
        hit.thumbnailImage ||
        (hit.images && hit.images.length > 0 ? hit.images[0] : null),
      tcg: hit.tcg,
      category: hit.type,
      id: hit.objectID,
    };

    products.value.push(obj);
    totalItems.value = queryResult.nbHits;
  }
}
</script>
