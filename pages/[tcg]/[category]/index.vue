<template>
  <div class="mx-4 lg:mx-8">
    <MoleculesBreadcrumb />
    <MoleculesListingTitle
      :title="`${route.params.tcg}/${route.params.category}`"
    />
  </div>
  <div class="gap-b-4 flex flex-col">
    <div class="mx-4 lg:mx-8">
      <!-- Una sola barra sopra la griglia: conteggio e filtri attivi a
           sinistra, ordinamento a destra. Prima erano tre fasce separate. -->
      <div class="listing-toolbar lg:ml-[20rem]">
        <div class="listing-toolbar__info">
          <div v-show="!isDesktopView">
            <OrganismsFilter
              @filterUpdate="filterUpdate"
              :filters="filtersAppliedOrganismFilter"
              :facets="facets"
              :facetLabels="facetLabels"
              :priceStats="priceStats"
            />
          </div>
          <MoleculesItemsCounter
            class="listing-toolbar__count"
            :totalItems="totalItems"
            :page="currentPage"
            :perPage="perPage"
          />
          <OrganismsListingFilters
            :filters="filtersAppliedOrganismsListingFilters"
            :filterLabels="facetLabels"
            @update-filters="updateFiltersApplied"
          />
        </div>

        <div class="listing-toolbar__sort">
          <span class="hidden sm:inline">{{ t("catalog.sorting.sortBy") }}</span>
          <MoleculesPageSorter
            :sortingItems="sortingItems"
            @handleSorting="handleSorting"
          />
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
        <!-- Stessa forma delle righe vere, così il caricamento non salta. -->
        <div v-else class="flex flex-col gap-3">
          <div
            v-for="item in skeletonItems"
            :key="`mobile-skeleton-${item}`"
            class="h-[9.5rem] rounded-[20px] bg-neutrals-100 animate-pulse"
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
        <!-- Le colonne le decide `useListingGrid` dalla larghezza reale, e i
             prodotti per pagina sono sempre righe intere di quelle colonne. -->
        <div ref="gridArea" class="min-w-0 flex-1">
          <div
            v-if="isLoading || products.length"
            class="grid gap-5"
            :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }"
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
      </div>
      <div v-if="products.length" class="pt-12 pb-16">
        <MoleculesListingPagination
          :total-items="totalItems"
          :current-page="currentPage"
          :per-page="perPage"
          @current-page="($e: number) => changePage($e)"
        />
      </div>
      <OrganismsServiceBanner />
    </div>
  </div>
</template>

<script setup lang="ts">
// Il primo segmento è il gioco: si vende solo Pokémon (vedi SHOP_GAME), più
// la ricerca. Il resto (/one-piece/..., indirizzi sbagliati) è un 404 invece
// di un catalogo vuoto.
definePageMeta({
  validate: (route) => ["pokemon", "search"].includes(String(route.params.tcg)),
});

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
import { translateCategory } from "~/data/menu";
import { truncateDescription } from "~/utils/seo";

const { t, te, locale } = useI18n();
const { getProducts, getMenu } = useShop();
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
const gridArea = ref<HTMLElement | null>(null);
const { columns, perPage } = useListingGrid(gridArea, isDesktopView);
const skeletonItems = computed(() =>
  Array.from({ length: perPage.value }, (_, index) => index),
);

const isSearchRoute = computed(() => route.params.tcg === "search");

/**
 * Il CMS accetta un oggetto di filtri, non la stringa in sintassi Algolia che
 * si costruiva prima: i valori dei filtri arrivano già come slug dalle faccette.
 */
const activeFilters = ref<ShopCatalogFilters>({});
/** Prodotti per pagina usati nell'ultima richiesta al catalogo. */
let fetchedPerPage = 0;

const buildFilters = (): ShopCatalogFilters => {
  const base: ShopCatalogFilters = {
    ...activeFilters.value,
    page: currentPage.value,
    perPage: (fetchedPerPage = perPage.value),
    sort: SORT_MAP[currentSorting.value] ?? "newest",
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

/**
 * Cambiano le colonne (finestra ridimensionata, rotazione del telefono):
 * si ricalcola la pagina per restare sugli stessi prodotti e si ricarica,
 * con un attimo d'attesa perché il ridimensionamento emette molti eventi.
 */
let resizeTimer: ReturnType<typeof setTimeout> | null = null;
watch(perPage, (next) => {
  // Si confronta con la misura dell'ultima richiesta, non col valore
  // precedente: al primo assestamento della griglia (12 → 15) la pagina
  // dell'indirizzo è già stata caricata con la misura giusta.
  const previous = fetchedPerPage;
  if (!previous || next === previous) return;
  const firstIndex = (currentPage.value - 1) * previous;
  currentPage.value = Math.floor(firstIndex / next) + 1;
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(fetchData, 250);
});
onBeforeUnmount(() => {
  if (resizeTimer) clearTimeout(resizeTimer);
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
  // In cima alla griglia: prima si restava in fondo alla pagina nuova.
  window.scrollTo({ top: 0, behavior: "smooth" });
  fetchData();
}

/**
 * La pagina sta nell'indirizzo (`?page=3`), come già lo legge `onMounted`:
 * indietro, ricarica e link condivisi riportano alla stessa pagina. Un filtro
 * o un ordinamento nuovo riportano a 1 e la tolgono.
 */
watch(currentPage, (page) => {
  const query = { ...route.query, page: page > 1 ? String(page) : undefined };
  router.replace({ query });
});

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

/* ---- SEO ---- */

/*
 * Titolo e descrizione si ricavano dal menu, che si carica durante il
 * rendering sul server (lato server è già in cache) così i meta arrivano
 * nell'HTML. I prodotti invece restano caricati al montaggio: quanti per
 * pagina lo decide la larghezza reale della griglia (useListingGrid), che sul
 * server non si conosce. Tutte le schede sono comunque nella sitemap.
 *
 * Sul client il menu già scaricato si riusa fra un catalogo e l'altro: cambia
 * solo dopo un sync del catalogo.
 */
const { data: seoMenu } = await useAsyncData("shop-menu", () => getMenu(), {
  getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
});

const seoGame = computed(
  () =>
    seoMenu.value?.tree?.find((game) => game.slug === route.params.tcg) ??
    seoMenu.value?.tree?.[0],
);
const seoCategory = computed(() =>
  seoGame.value?.categories.find((category) => category.slug === route.params.category),
);

/** Set scelto dalla vetrina o dal menu (`?expansion=slug`). */
const expansionSlug = computed(() =>
  typeof route.query.expansion === "string" ? route.query.expansion : "",
);
const seoExpansion = computed(() => {
  if (!expansionSlug.value) return null;
  const categories = seoCategory.value
    ? [seoCategory.value]
    : (seoGame.value?.categories ?? []);
  for (const category of categories) {
    const found = category.expansions.find((item) => item.slug === expansionSlug.value);
    if (found) return found;
  }
  return null;
});

const categoryLabel = computed(() => {
  const slug = String(route.params.category ?? "");
  if (seoCategory.value) {
    return translateCategory(
      slug,
      seoCategory.value.name,
      seoGame.value?.name ?? "",
      t,
      te,
    );
  }
  // Menu non disponibile: lo stesso ripiego del breadcrumb.
  if (te(`category.${slug}`)) return t(`category.${slug}`);
  const words = slug.replace(/^pokemon-/, "").replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
});

const seoTitle = computed(() => {
  if (isSearchRoute.value) {
    return t("layout.breadcrumb.search", { term: String(route.params.category ?? "") });
  }
  if (route.params.category === "all") return "Tutte le carte e i prodotti Pokémon";
  const base = `${categoryLabel.value} Pokémon`;
  return seoExpansion.value ? `${seoExpansion.value.name} – ${base}` : base;
});

const seoDescription = computed(() => {
  const closing = "Ordini spediti in 3 giorni lavorativi.";
  if (route.params.category === "all" || isSearchRoute.value) {
    return truncateDescription(
      `Carte Pokémon singole, buste, box e prodotti sigillati su Jigglycard, con filtri per set, lingua, condizione e prezzo. ${closing}`,
    );
  }
  const label = categoryLabel.value;
  if (seoExpansion.value) {
    const code = seoExpansion.value.code ? ` (${seoExpansion.value.code.toUpperCase()})` : "";
    return truncateDescription(
      `${label} Pokémon del set ${seoExpansion.value.name}${code} su Jigglycard, con filtri per lingua, condizione e prezzo. ${closing}`,
    );
  }
  return truncateDescription(
    `${label} Pokémon su Jigglycard, divise per set, con filtri per lingua, condizione e prezzo. ${closing}`,
  );
});

/*
 * Canonical: il percorso più il solo `?expansion=`, che cambia davvero il
 * contenuto (un set è una pagina a sé). `?page=` resta fuori di proposito:
 * i prodotti per pagina dipendono dalla larghezza dello schermo, quindi
 * "pagina 3" non è un contenuto stabile da indicizzare; le schede arrivano
 * ai motori dalla sitemap, non dalla paginazione. I filtri non stanno
 * nell'indirizzo, e altri parametri (es. utm_) non devono creare copie.
 *
 * La ricerca non va indicizzata (risultati potenzialmente infiniti e
 * sottili): noindex, ma i link alle schede si seguono.
 */
usePageSeo({
  title: seoTitle,
  description: seoDescription,
  // La copertina della categoria (la stessa del menu) non rappresenta un set
  // preciso: sulle pagine di un set resta l'immagine del sito.
  image: () => (seoExpansion.value ? undefined : seoCategory.value?.coverImage),
  canonical: () =>
    isSearchRoute.value
      ? null
      : expansionSlug.value
        ? `${route.path}?expansion=${encodeURIComponent(expansionSlug.value)}`
        : route.path,
  robots: () => (isSearchRoute.value ? "noindex, follow" : undefined),
});
</script>

<style scoped>
.listing-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 20px;
  margin-bottom: 20px;
}

.listing-toolbar__info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 16px;
  min-width: 0;
}

.listing-toolbar__count {
  font-size: 14px;
  color: var(--im-muted);
}

.listing-toolbar__sort {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
  font-size: 14px;
  color: var(--im-muted);
}
</style>
