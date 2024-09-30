<template>
  <div class="gap-y-4 flex flex-col">
    <div class="mx-8">
      <OrganismsListingFilters />
    </div>

    <OrganismsListingProducts :products="products" />
    <MoleculesListingPagination
      :total-items="totalItems"
      :items-per-page="itemsPerPage"
      :current-page="currentPage"
      @current-page="($e) => changePage($e)"
    />
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

onMounted(async () => {
  if (route.query.page) currentPage.value = Number(route.query.page);
  fetchData();
});

function changePage(event: number) {
  currentPage.value = event;
  fetchData();
}

async function fetchData() {
  let results = await client.search({
    requests: [
      {
        indexName: PRODUCTS_COLLECTION,
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
