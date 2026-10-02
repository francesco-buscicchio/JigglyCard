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

  <!-- Header desktop da 1280px: con tutte le categorie in riga, sotto quella
       misura andava a capo. Fra 1024 e 1280 resta quello compatto. -->
  <div v-if="!isLandingPage" class="hidden w-full xl:block fixed-header">
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

  <div v-else class="w-full bg-accent-5 border-b border-neutrals-200 px-18 py-5 fixed-header">
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
  <!-- Toast unico per i messaggi all'utente (useErrorHandler). -->
  <MoleculesToastMessage
    :text="appToast.text"
    :type="appToast.type"
    :trigger-key="appToast.key || undefined"
  />
  <slot />

  <footer v-if="!isLandingPage">
    <OrganismsFooter :policyLinks="policyLinks" />
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { Hit } from "~/interface/hit.interface";
import logoNew from "~/assets/logo/logo_new.png";
const { getProducts } = useShop();
const { toast: appToast } = useErrorHandler();
const isSearchOpen = ref(false);
const { t, locale } = useI18n();
const { host } = useRequestURL();
const isProductionSite = host === "jigglycard.com";
const route = useRoute();
const isHomePage = route.path === "/";
// Computed: il layout resta montato fra una pagina e l'altra, un valore letto
// una volta sola resterebbe quello della prima pagina visitata.
const isLandingPage = computed(() => route.path === "/landing");
const productSearch = ref<Hit[]>([]);
const searchValue = ref<string>("");

const noResults = computed(
  () => !(productSearch.value.length > 0 || searchValue.value.length < 3),
);

const policyLinks = [
  { label: t("common.links.privacy"), link: "/privacy-policy" },
  { label: t("common.links.cookies"), link: "/cookies" },
  { label: t("common.links.terms"), link: "/condizioni-di-vendita" },
];

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
};

const onClickItem = () => {
  closeSearch();
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

// Qualunque cambio pagina chiude la ricerca: un risultato, un link, il tasto
// indietro. Prima l'overlay restava aperto sopra la scheda prodotto.
watch(
  () => route.fullPath,
  () => {
    if (isSearchOpen.value) closeSearch();
  },
);

const searchProducts = async (data: string) => {
  searchValue.value = data;

  if (data.length <= 2) {
    productSearch.value = [];
    return;
  }

  const results = await getProducts({ search: data, perPage: 6 });

  // I due header consumano ancora la forma `Hit`: qui si adattano i prodotti
  // del CMS a quel contratto, così i componenti restano invariati.
  productSearch.value = results.items.map((product) => ({
    name:
      locale.value.startsWith("it") && product.nameIt
        ? product.nameIt
        : product.name,
    thumbnailImage: product.images?.[0] ?? "",
    salePrice: product.minPriceCents / 100,
    tcg: product.gameSlug,
    type: product.categorySlug,
    expansion:
      locale.value.startsWith("it") && product.expansionIt
        ? product.expansionIt
        : product.expansion,
    objectID: product.slug,
  }));
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
