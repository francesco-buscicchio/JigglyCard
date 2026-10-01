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
          :facets="facets"
          :facetLabels="facetLabels"
          :priceStats="priceStats"
        />
      </div>

      <!-- Anche su desktop: prima era `v-show="!isDesktopView"`, quindi da
           desktop non c'era modo di vedere quali filtri fossero attivi. -->
      <OrganismsListingFilters
        :filters="filtersAppliedOrganismsListingFilters"
        :filterLabels="facetLabels"
        @update-filters="updateFiltersApplied"
      />

      <div
        class="pb-6 flex flex-row justify-between items-center lg:ml-[19rem]"
      >
        <MoleculesItemsCounter :totalItems="totalItems" :page="currentPage" />

        <div class="flex flex-row items-center gap-x-2 lg:mr-27">
          <p>{{ t("catalog.sorting.sortBy") }}</p>
          <div class="max-w-40">
            <MoleculesPageSorter
              :sortingItems="sortingItems"
              @handleSorting="handleSorting"
            />
          </div>
        </div>
      </div>
      <MoleculesEmptyResults
        v-if="!isLoading && !products.length"
        :hasFilters="hasActiveFilters"
        @clearFilters="clearAllFilters"
        class="my-10"
      />

      <template v-if="!isDesktopView && (isLoading || products.length)">
        <OrganismsListingProducts
          v-if="!isLoading"
          :products="products"
        />
        <div v-else class="grid grid-cols-2 gap-4">
          <div
            v-for="item in skeletonItems"
            :key="`mobile-skeleton-${item}`"
            class="h-60 rounded-2xl bg-neutral-200 animate-pulse"
          ></div>
        </div>
      </template>
      <!-- Larghezze fluide invece dei vecchi 30vw/70vw fissi: la barra filtri
           resta leggibile e la griglia guadagna una colonna sugli schermi
           grandi invece di comprimere le card. -->
      <div class="flex gap-8" v-show="isDesktopView">
        <aside v-if="isLoading || products.length" class="w-72 shrink-0">
          <div class="sticky top-24">
            <OrganismsFilterWeb
              @filterUpdate="filterUpdate"
              :filters="filtersAppliedOrganismFilter"
              :facets="facets"
              :facetLabels="facetLabels"
              :priceStats="priceStats"
            />
          </div>
        </aside>
        <div
          v-if="isLoading || products.length"
          class="grid flex-1 grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
        >
          <OrganismsListingProductsWeb
            v-if="!isLoading"
            :products="products"
          />
          <template v-else>
            <div
              v-for="item in skeletonItems"
              :key="`desktop-skeleton-${item}`"
              class="aspect-[63/88] rounded-2xl bg-neutrals-200 animate-pulse"
            ></div>
          </template>
        </div>
      </div>
      <div v-if="products.length" class="pt-10">
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
  ITEMS_FOR_PAGE_MOBILE,
  ITEMS_FOR_PAGE_DESKTOP,
} from "~/data/const";
import sortingItems from "~/data/sorting";
import {
  SORT_MAP,
  mapStorefrontFacetLabels,
  mapStorefrontFacets,
  mapStorefrontPriceStats,
  mapStorefrontProducts,
} from "~/mapper/storefront.mapper";
import type { ShopCatalogFilters } from "~/composables/useShop";
import type { ProductType } from "~/types/productType.type";

const { t, locale } = useI18n();
const { getProducts } = useShop();
const products: Ref<ProductType[]> = ref([]);
const route = useRoute();
const totalItems = ref(0);
const currentPage = ref(1);
const currentSorting = ref("");
const filtersAppliedOrganismsListingFilters = ref<string[]>([]);
const filtersAppliedOrganismFilter = ref<string[]>([]);
const expansion = computed(() => route.query.expansion);
const isDesktopView = isDesktop();
const facets = ref<Record<string, Record<string, number>> | null>(null);
const priceStats = ref<{ min: number; max: number } | null>(null);
const facetLabels = ref<Record<string, Record<string, string>>>({});
const isLoading = ref(true);
const skeletonItems = computed(() => {
  const count = isDesktopView.value
    ? ITEMS_FOR_PAGE_DESKTOP
    : ITEMS_FOR_PAGE_MOBILE;
  return Array.from({ length: count }, (_, index) => index);
});

const isSearchRoute = computed(() => route.params.tcg === "search");

/**
 * Il CMS accetta un oggetto di filtri, non la stringa in sintassi Algolia che
 * si costruiva prima: i valori dei filtri arrivano già come slug dalle faccette.
 */
const activeFilters = ref<ShopCatalogFilters>({});

const buildFilters = (): ShopCatalogFilters => {
  const base: ShopCatalogFilters = {
    ...activeFilters.value,
    page: currentPage.value,
    perPage: isDesktopView.value ? ITEMS_FOR_PAGE_DESKTOP : ITEMS_FOR_PAGE_MOBILE,
    sort: SORT_MAP[currentSorting.value] ?? "relevance",
  };

  if (isSearchRoute.value) {
    base.search = String(route.params.category ?? "");
  } else {
    base.game = String(route.params.tcg ?? "");
    if (route.params.category !== "all") {
      base.category = String(route.params.category ?? "");
    }
  }

  if (expansion.value) base.expansion = String(expansion.value);

  return base;
};

onMounted(async () => {
  if (route.query.page) currentPage.value = Number(route.query.page);
  fetchData();
});

watch(() => route.query.expansion, () => {
  currentPage.value = 1;
  fetchData();
});

function applyFilters(e?: any) {
  activeFilters.value = e
    ? {
        language: e.language,
        condition: e.condition,
        game: e.brand?.[0],
        category: e.type?.[0],
        expansion: e.expansion?.[0],
        available: e.available?.length ? e.available.includes("true") : undefined,
        // Il pannello filtri ragiona in euro, il CMS in centesimi.
        minPriceCents:
          e.price?.min !== undefined ? Math.round(e.price.min * 100) : undefined,
        maxPriceCents:
          e.price?.max !== undefined ? Math.round(e.price.max * 100) : undefined,
      }
    : {};

  fetchData();
}

function filterUpdate(e: any) {
  currentPage.value = 1;
  updateFiltersApplied(e);
}

const hasActiveFilters = computed(
  () =>
    // L'espansione può arrivare dalla URL (link dalla vetrina), non solo dal
    // pannello filtri: va contata, altrimenti da un set senza risultati non
    // comparirebbe alcuna via d'uscita.
    Boolean(route.query.expansion) ||
    Object.values(activeFilters.value).some((value) =>
      Array.isArray(value) ? value.length > 0 : value !== undefined,
    ),
);

const router = useRouter();

function clearAllFilters() {
  filtersAppliedOrganismsListingFilters.value = [];
  filtersAppliedOrganismFilter.value = [];
  currentPage.value = 1;

  if (route.query.expansion) {
    router.replace({ query: {} });
    return;
  }
  applyFilters();
}

function changePage(event: number) {
  currentPage.value = event;
  fetchData();
}

function handleSorting(event: string) {
  currentSorting.value = event;
  fetchData();
}

const updateFiltersApplied = (newFilters: any) => {
  filtersAppliedOrganismsListingFilters.value = newFilters;
  let allValues: string[] = [];

  for (const key in newFilters) {
    if (Array.isArray(newFilters[key])) {
      allValues.push(...newFilters[key]);
    }
  }
  filtersAppliedOrganismFilter.value = allValues;
  applyFilters(newFilters);
};

async function fetchData() {
  isLoading.value = true;
  try {
    const result = await getProducts(buildFilters());

    products.value = mapStorefrontProducts(result.items, locale.value);
    totalItems.value = result.total;
    facets.value = mapStorefrontFacets(result.facets);
    facetLabels.value = mapStorefrontFacetLabels(result.facets);
    priceStats.value = mapStorefrontPriceStats(result.facets);
  } finally {
    isLoading.value = false;
  }
}
</script>
