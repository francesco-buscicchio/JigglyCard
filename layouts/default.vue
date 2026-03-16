<template>
  <OrganismsHeaderMobile
    v-if="!isLandingPage"
    class="w-full"
    :header="{ cartCount: 9 }"
    :productSearch="productSearch"
    :isSearchOpen="isSearchOpen"
    :noResults="noResults"
    @toggleSearch="toggleSearch"
    @closeSearch="closeSearch"
    @search="searchProducts"
    @itemClick="onClickItem"
  />

  <div v-if="!isLandingPage" class="hidden w-full lg:block fixed-header">
    <OrganismsHeaderDesktop
      class="w-full"
      :header="{ cartCount: 9 }"
      :productSearch="productSearch"
      :isSearchOpen="isSearchOpen"
      :noResults="noResults"
      @toggleSearch="toggleSearch"
      @closeSearch="closeSearch"
      @search="searchProducts"
      @itemClick="onClickItem"
    />
  </div>

  <div v-else class="w-full bg-white shadow-md px-18 py-5 fixed-header">
    <div class="flex justify-between items-center">
      <div
        class="flex items-center gap-2 cursor-pointer"
        @click="navigateTo('/')"
      >
        <img
          :src="logoNew"
          alt="Jigglycard logo"
          class="w-12 h-12 object-contain"
        />
        <h2 class="text-accent-950">Jigglycard</h2>
      </div>
    </div>
  </div>

  <MoleculesCookieBanner />
  <slot />

  <footer v-if="!isLandingPage">
    <OrganismsPreFooter />
    <OrganismsFooter :policyLinks="policyLinks" />
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { Hit } from "~/interface/hit.interface";
import type { SearchProductResult } from "~/interface/searchProductResult.interface";
import logoNew from "~/assets/logo/logo_new.png";
const client = useAlgolia();
const isSearchOpen = ref(false);
const { t } = useI18n();
const { host } = useRequestURL();
const isProductionSite = host === "jigglycard.com";
const route = useRoute();
const isHomePage = route.path === "/";
const isLandingPage = route.path === "/landing";
const productSearch = ref<Hit[]>([]);
const searchValue = ref<string>("");

const noResults = computed(
  () => !(productSearch.value.length > 0 || searchValue.value.length < 3),
);

const policyLinks = [
  { label: t("common.links.privacy"), link: "/privacy-policy" },
  { label: t("common.links.cookies"), link: "/cookies" },
  { label: t("common.links.terms"), link: "/terms-of-use" },
];

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
};

const onClickItem = () => {
  isSearchOpen.value = false;
};

const closeSearch = (event?: MouseEvent) => {
  if (
    !event ||
    (event.target instanceof HTMLElement &&
      event.target.classList.contains("overlay-header"))
  ) {
    isSearchOpen.value = false;
  }
  // Reset research
  productSearch.value = [];
  searchValue.value = "";
};

const searchProducts = async (data: string) => {
  searchValue.value = data;
  if (data.length > 2) {
    const results = await client.searchSingleIndex<SearchProductResult>({
      indexName: "ecommerce",
      searchParams: { query: data, hitsPerPage: 6 },
    });
    productSearch.value = results.hits as unknown as Hit[];
  } else productSearch.value = [];
};
</script>

<style scoped>
.fixed-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
}

.overlay-header {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh; /* Copre l'intera altezza dello schermo */
  width: 100%; /* Copre tutta la larghezza */
  background-color: rgba(
    0,
    0,
    0,
    0.8
  ); /* Sfondo semitrasparente per l'effetto overlay */
  z-index: 1050; /* Più alto per stare sopra tutto */
}
</style>
