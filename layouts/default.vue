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
  />

  <div class="hidden w-full lg:block sticky-header">
    <OrganismsHeaderDesktop
      class="w-full"
      :header="{ cartCount: 9 }"
      :productSearch="productSearch"
      :isSearchOpen="isSearchOpen"
      :noResults="noResults"
      @toggleSearch="toggleSearch"
      @closeSearch="closeSearch"
      @search="searchProducts"
    />
  </div>
  <slot />

  <footer>
    <OrganismsPreFooter />
    <OrganismsFooter :footer="footerData" :policyLinks="policyLinks" />
  </footer>
</template>

<script setup lang="ts">
import facebookLogo from "~/assets/icons/facebook.svg";
import instagramLogo from "~/assets/icons/instagram.svg";
import youtubeLogo from "~/assets/icons/youtube.svg";
import tiktokLogo from "~/assets/icons/tiktok.png";
import { useI18n } from "vue-i18n";
import type { Hit, SearchProductResult } from "~/types/product.type";
const client = useAlgolia();
const isSearchOpen = ref(false);
const { t } = useI18n();
const productSearch = ref<Hit[]>([]);
const searchValue = ref<string>("");

const noResults = computed(
  () => !(productSearch.value.length > 0 || searchValue.value.length < 3)
);

const footerData = {
  imgs: [
    {
      img: instagramLogo,
      url: "https://www.instagram.com/jigglycard/",
    },
    {
      img: tiktokLogo,
      url: "https://www.tiktok.com/@jigglycard",
    },
    {
      img: facebookLogo,
      url: "#",
    },
    {
      img: youtubeLogo,
      url: "#",
    },
  ],
};

const policyLinks = [
  { label: t("privacy"), link: "/privacy-policy" },
  { label: t("cookies"), link: "/cookies" },
  { label: t("terminiDiUtilizzo"), link: "/terms-of-use" },
];

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
};

const closeSearch = (event: MouseEvent) => {
  if (
    event.target instanceof HTMLElement &&
    event.target.classList.contains("overlay-header")
  ) {
    isSearchOpen.value = !isSearchOpen.value;
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
      searchParams: { query: data, hitsPerPage: 4 },
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
