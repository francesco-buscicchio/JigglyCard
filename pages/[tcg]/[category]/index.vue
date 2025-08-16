<template>
  <div class="gap-b-4 flex flex-col px-4">
    <MoleculesBreadcrumb />
  </div>
  <div class="p-10">
    <MoleculesListingTitle
      :title="`${route.params.tcg}/${route.params.category}`"
    />
  </div>
  <div class="gap-b-4 flex flex-col">
    <div class="mx-8">
      <div class="pb-6" v-show="!isDesktopView">
        <OrganismsFilter
          @filterUpdate="filterUpdate"
          :filters="filtersAppliedOrganismFilter"
        />
      </div>

      <OrganismsListingFilters
        :filters="filtersAppliedOrganismsListingFilters"
        @update-filters="updateFiltersApplied"
        v-show="!isDesktopView"
      />

      <div
        class="pb-6 flex flex-row justify-between items-center lg:w-[70vw] lg:ml-[31vw]"
      >
        <MoleculesItemsCounter :totalItems="totalItems" :page="currentPage" />

        <div class="flex flex-row items-center gap-x-2 lg:mr-27">
          <p>{{ t("pageSorting.sortBy") }}</p>
          <div class="max-w-40">
            <MoleculesPageSorter
              :sortingItems="sortingItems"
              @handleSorting="handleSorting"
            />
          </div>
        </div>
      </div>
      <OrganismsListingProducts :products="products" v-if="!isDesktopView" />
      <div class="flex gap-x-4" v-show="isDesktopView">
        <div class="w-[30vw] flex justify-end">
          <!-- filters -->
          <div>
            <OrganismsFilterWeb
              @filterUpdate="filterUpdate"
              :filters="filtersAppliedOrganismFilter"
            />
          </div>
        </div>
        <div class="grid grid-cols-4 gap-4 w-[70vw]">
          <OrganismsListingProductsWeb :products="products" />
        </div>
      </div>
      <div class="pt-10">
        <MoleculesListingPagination
          :total-items="totalItems"
          :current-page="currentPage"
          @current-page="($e: Event) => changePage($e)"
        />
        <div class="pt-2 pb-10">
          <MoleculesListingCounter
            :totalItems="totalItems"
            :currentPage="currentPage"
          />
        </div>
      </div>
      <OrganismsServiceBanner />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PRODUCTS_COLLECTION,
  ITEMS_FOR_PAGE_MOBILE,
  ITEMS_FOR_PAGE_DESKTOP,
  TcgSlug,
} from "~/data/const";
import sortingItems from "~/data/sorting";
import type { SearchProductResult } from "~/interface/searchProductResult.interface";
import type { ProductType } from "~/types/productType.type";

const { t } = useI18n();
const products: Ref<ProductType[]> = ref([]);
const client = useAlgolia();
const route = useRoute();
const totalItems = ref(0);
const currentPage = ref(1);
const currentSorting = ref("");
const filtersAppliedOrganismsListingFilters = ref<string[]>([]);
const filtersAppliedOrganismFilter = ref<string[]>([]);
const expansion = route.query.expansion;
const isDesktopView = isDesktop();

const getBaseQuery = () => {
  if (route.params.tcg === "search") return "";
  return route.params.category === "all"
    ? `tcg:"${TcgSlug[route.params.tcg as keyof typeof TcgSlug]}"`
    : `tcg:"${TcgSlug[route.params.tcg as keyof typeof TcgSlug]}" AND type:"${
        route.params.category
      }"`;
};
const filtersStringQuery = ref(getBaseQuery());

onMounted(async () => {
  if (route.query.page) currentPage.value = Number(route.query.page);
  calculateFilterString();
});

function calculateFilterString(e?: any) {
  let filter = getBaseQuery();

  if (e) {
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
    let minPriceFilter = e.price?.min;
    let maxPriceFilter = e.price?.max;

    languageFilters.length && (filter += ` AND (${languageFilters})`);
    conditionFilters.length && (filter += ` AND (${conditionFilters})`);
    brandFilter.length && (filter += ` AND (${brandFilter})`);
    availableFilter.length && (filter += ` AND (${availableFilter})`);
    if (minPriceFilter !== undefined) {
      filter += ` AND salePrice >= ${minPriceFilter}`;
    }
    if (maxPriceFilter !== undefined) {
      filter += ` AND salePrice <= ${maxPriceFilter}`;
    }
  }

  if (expansion) filter += ` AND (setSlug:"${expansion}")`;

  filtersStringQuery.value = filter;
  fetchData();
}

function filterUpdate(e: any) {
  currentPage.value = 1;
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
  let results: any =
    route.params.tcg === "search"
      ? await client.searchSingleIndex({
          indexName: calculateCollection(),
          searchParams: { query: route.params.category as string },
        })
      : await client.search({
          requests: [
            {
              indexName: calculateCollection(),
              filters: filtersStringQuery.value,
              hitsPerPage: isDesktopView.value
                ? ITEMS_FOR_PAGE_DESKTOP
                : ITEMS_FOR_PAGE_MOBILE,
              page: currentPage.value - 1,
            },
          ],
        });
  console.log(results);
  if (route.params.tcg === "search") setProducts(results);
  else setProducts(results.results[0]);
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
