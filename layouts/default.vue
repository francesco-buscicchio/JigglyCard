<template>
  <OrganismsHeaderMobile
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

  <div class="hidden w-full lg:block fixed-header">
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

  <MoleculesCookieBanner />
  <slot />

  <footer>
    <OrganismsPreFooter />
    <OrganismsFooter :policyLinks="policyLinks" />
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { Hit } from "~/interface/hit.interface";
import type { SearchProductResult } from "~/interface/searchProductResult.interface";
const client = useAlgolia();
const isSearchOpen = ref(false);
const { t } = useI18n();
const productSearch = ref<Hit[]>([]);
const searchValue = ref<string>("");

const noResults = computed(
  () => !(productSearch.value.length > 0 || searchValue.value.length < 3)
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
