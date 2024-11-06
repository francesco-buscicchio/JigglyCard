<template>
  <div class="gap-b-4 flex flex-col px-4">
    <MoleculesBreadcrumb />
  </div>
  <div class="p-10">
    <MoleculesListingTitle
      :title="$t(`routes./${route.params.tcg}/${route.params.category}`)"
    />
  </div>
  <div class="gap-b-4 flex flex-col">
    <div class="mx-8">
      <div class="pb-6">
        <OrganismsFilter
          @filterUpdate="filterUpdate"
          :filters="filtersAppliedOrganismFilter"
        />
      </div>

      <OrganismsListingFilters
        :filters="filtersAppliedOrganismsListingFilters"
        @update-filters="updateFiltersApplied"
      />

      <div class="pb-6 flex flex-row justify-between items-center">
        <MoleculesItemsCounter :totalItems="totalItems" :page="currentPage" />

        <div class="flex flex-row items-center gap-x-2">
          <p>{{ $t("pageSorting.sortBy") }}</p>
          <div class="max-w-40">
            <MoleculesPageSorter
              :sortingItems="sortingItems"
              :@handle-sorting="handleSorting"
            />
          </div>
        </div>
      </div>
      <OrganismsListingProducts :products="products" />
      <div class="pt-10">
        <MoleculesListingPagination
          :total-items="totalItems"
          :current-page="currentPage"
          @current-page="($e) => changePage($e)"
        />
        <div class="pt-2 pb-10">
          <MoleculesListingCounter
            :totalItems="totalItems"
            :currentPage="currentPage"
          />
        </div>
      </div>
      <div class="pb-10">
        <OrganismsServiceBanner />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PRODUCTS_COLLECTION, ITEMS_FOR_PAGE } from "~/data/const";
import sortingItems from "~/data/sorting";

import type { ProductType } from "~/components/Organisms/ProductCarousel/ProductCarousel.vue";
import ListingTitle from "~/components/Molecules/ListingTitle/ListingTitle.vue";
const products: Ref<ProductType[]> = ref([]);

const config = useRuntimeConfig();
const client = useAlgolia();
const route = useRoute();
const totalItems = ref(0);
const currentPage = ref(1);
const currentSorting = ref("");
const filtersAppliedOrganismsListingFilters = ref<string[]>([]);
const filtersAppliedOrganismFilter = ref<string[]>([]);
const filtersStringQuery = ref(`type:"${route.params.category}"`);

onMounted(async () => {
  if (route.query.page) currentPage.value = Number(route.query.page);
  fetchData();
});

function calculateFilterString(e: any) {
  let languageFilters = e.language
    ? e.language.map((lang: string) => `languages:"${lang}"`).join(" OR ")
    : "";
  let conditionFilters = e.condition
    ? e.condition.map((cond: string) => `conditions:"${cond}"`).join(" OR ")
    : "";
  let brandFilter = e.brand
    ? e.brand.map((brand: string) => `tcg:"${brand}"`).join(" OR ")
    : "";
  let availableFilter = e.available
    ? e.available
        .map((available: string) => `available:"${available}"`)
        .join(" OR ")
    : "";

  let filter = `type:"${route.params.category}"`;
  if (languageFilters.length > 0) filter += ` AND (${languageFilters})`;
  if (conditionFilters.length > 0) filter += ` AND (${conditionFilters})`;
  if (brandFilter.length > 0) filter += ` AND (${brandFilter})`;
  if (availableFilter.length > 0) filter += ` AND (${availableFilter})`;

  filtersStringQuery.value = filter;
  fetchData();
}

function filterUpdate(e: any) {
  filtersAppliedOrganismsListingFilters.value = e;
  calculateFilterString(e);
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

const updateFiltersApplied = (newFilters: any) => {
  let allValues: string[] = [];

  for (const key in newFilters) {
    if (Array.isArray(newFilters[key])) {
      allValues.push(...newFilters[key]);
    }
  }
  filtersAppliedOrganismFilter.value = allValues;
  calculateFilterString(newFilters);
};

async function fetchData() {
  let results = await client.search({
    requests: [
      {
        indexName: calculateCollection(),
        filters: filtersStringQuery.value,
        hitsPerPage: ITEMS_FOR_PAGE,
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
  }

  totalItems.value = queryResult.nbHits;
}
</script>
