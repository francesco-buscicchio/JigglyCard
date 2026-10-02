<template>
  <div
    :class="{ 'fixed-header': !isSearchOpen, 'overlay-header': isSearchOpen }"
    class="xl:hidden"
    @click="closeSearch($event)"
  >
    <nav class="p-4 nav--dark header-glow-line">
      <div class="container mx-auto flex justify-between items-center">
        <div class="xl:hidden">
          <button @click="toggleMenu" class="nav-icon text-neutrals-800 focus:outline-none">
            <Icon name="jig:menu" v-if="!isMenuOpen" size="20"></Icon>
            <Icon name="jig:close-accent" v-else size="20"></Icon>
          </button>
        </div>

        <div class="relative w-[70%]">
          <div
            class="flex items-center justify-center gap-2 cursor-pointer"
            @click="goTo(PATH.HOME)"
          >
            <img
              :src="logoNew"
              alt="Jigglycard logo"
              class="w-7 h-7 object-contain"
            />
            <h2 class="text-accent-950 text-center">
              {{ t("brand.name") }}
            </h2>
          </div>
        </div>

        <div class="items-center space-x-4">
          <button
            @click="toggleSearch"
            :style="{ visibility: isSearchOpen ? 'hidden' : 'visible' }"
            class="nav-icon focus:outline-none"
          >
            <Icon name="jig:cerca-accent" size="25" />
          </button>
          <button class="nav-icon focus:outline-none" @click="goTo(PATH.CART)">
            <span class="relative inline-flex">
              <Icon name="jig:cart-accent" size="25" />
              <span v-if="cartCount > 0" class="cart-badge">
                {{ cartCount }}
              </span>
            </span>
          </button>
        </div>
      </div>

      <div v-if="isSearchOpen" class="search-panel">
        <label class="search-field">
          <Icon
            name="heroicons:magnifying-glass-20-solid"
            size="20"
            class="search-field__icon"
          />
          <input
            v-model="inputSearch"
            type="text"
            class="search-field__input"
            :placeholder="t('catalog.controls.search') + '...'"
            :aria-label="t('catalog.controls.search')"
            autocomplete="off"
            @input="onSearchInput($event)"
          />
        </label>

        <div v-if="productSearch.length > 0" class="search-results">
          <ul class="search-results__list">
            <li v-for="item of productSearch" :key="item.objectID">
              <MoleculesSearchItemResult
                :thumbnailImage="item.thumbnailImage"
                :name="item.name"
                :objectID="item.objectID"
                :expansion="item.expansion"
                :tcg="item.tcg"
                :type="item.type"
                @itemClick="onItemClick"
              />
            </li>
          </ul>

          <button type="button" class="search-all" @click="goToSearch">
            {{ t("catalog.actions.showAll") }}
            <Icon name="heroicons:arrow-right-20-solid" size="18" />
          </button>
        </div>

        <div v-if="noResults" class="search-empty">
          <Icon name="heroicons:magnifying-glass-minus-20-solid" size="22" />
          <p>{{ t("common.messages.noResults") }}</p>
        </div>
      </div>
      <transition
        enter-active-class="transition duration-300 ease-out motion-reduce:transition-none"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in motion-reduce:transition-none"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="isMenuOpen" class="mobile-drawer xl:hidden">
          <MoleculesMobileMenu @closeMenu="toggleMenu" />
        </div>
      </transition>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { PATH } from "~/data/const";
import type { Hit } from "~/types/product.type";
import { goTo } from "@/utils/navigationUtils";
import { useCartCount } from "~/composables/useCartCount";
import logoNew from "~/assets/logo/logo_new.png";

const isMenuOpen = ref(false);
const inputSearch = ref("");
const { t } = useI18n();
const { cartCount } = useCartCount();

const props = defineProps<{
  productSearch: Hit[];
  isSearchOpen: boolean;
  noResults: boolean;
}>();

const emit = defineEmits([
  "search",
  "toggleSearch",
  "closeSearch",
  "updateSearch",
  "itemClick",
]);

watch(isMenuOpen, (newValue) => {
  useHead({
    bodyAttrs: {
      class: newValue ? "hide" : "scrollable",
    },
  });
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleSearch = () => {
  emit("toggleSearch");
};

const closeSearch = (event?: MouseEvent) => {
  emit("closeSearch", event);
};

const onSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  inputSearch.value = target.value;
  emit("search", target.value);
};

const resetSearch = () => {
  inputSearch.value = "";
  emit("search", "");
};

const goToSearch = () => {
  const searchTerm = inputSearch.value.trim();
  if (!searchTerm) {
    resetSearch();
    closeSearch();
    return;
  }
  closeSearch();
  navigateTo(`/search/${searchTerm}`);
  resetSearch();
};

const onItemClick = () => {
  resetSearch();
  emit("itemClick");
};
</script>

<style scoped>
.nav--dark {
  background: rgba(7, 10, 31, 0.88);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.nav--dark h2 {
  color: #f6f3ff;
}

/* Le icone del set `jig` hanno il colore scritto nell'SVG: sul fondo scuro
   si portano a bianco con un filtro, senza duplicare i file. */
.nav--dark .nav-icon .iconify,
.nav--dark .nav-icon :deep(svg) {
  filter: brightness(0) invert(1);
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -10px;
  min-width: 18px;
  padding: 2px 5px;
  border-radius: 9999px;
  background-color: #f04438;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  text-align: center;
}

/* ---------- Ricerca ---------- */
.search-panel {
  margin-top: 14px;
}

/* Campo a pillola di vetro, con la lente a sinistra e l'alone rosa al focus. */
.search-field {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 52px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.06);
  color: var(--im-muted);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.search-field:focus-within {
  border-color: var(--im-pink-strong);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 4px rgba(236, 145, 160, 0.16);
  color: var(--im-pink);
}

.search-field__icon {
  flex: none;
}

.search-field__input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: 0;
  padding: 0;
  background: none;
  font-size: 16px;
  color: var(--im-ink);
}

.search-field__input::placeholder {
  color: var(--im-muted);
  opacity: 0.8;
}

.search-field__input:focus {
  outline: none;
  box-shadow: none;
}

.search-results {
  margin-top: 12px;
  padding: 8px;
  border-radius: 24px;
  border: 1px solid var(--im-line);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
}

/* L'overlay della ricerca è fisso: senza un tetto i risultati in fondo
   finirebbero sotto il bordo dello schermo, senza modo di raggiungerli. */
.search-results__list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: calc(100vh - 230px);
  max-height: calc(100dvh - 230px);
  overflow-y: auto;
  overscroll-behavior: contain;
}

.search-all {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 48px;
  margin-top: 6px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 700;
  color: var(--im-pink);
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.search-all,
.search-all * {
  cursor: pointer;
}

.search-all:hover {
  background: rgba(247, 210, 216, 0.08);
  color: var(--im-ink);
}

.search-all:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
}

.search-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 12px;
  padding: 18px;
  border-radius: 20px;
  border: 1px dashed rgba(255, 255, 255, 0.16);
  color: var(--im-muted);
}

.search-empty p {
  color: var(--im-muted);
}

/* ---------- Menu ---------- */
/* Pannello a tutta altezza sotto la barra: `100%` qui è l'altezza della
   barra stessa (il blocco contenitore), quindi riempie il resto dello
   schermo senza conoscerne la misura. */
.mobile-drawer {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: calc(100vh - 100%);
  height: calc(100dvh - 100%);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 20px 16px calc(32px + env(safe-area-inset-bottom));
  border-top: 1px solid var(--im-line);
  /* Fondo pieno: con una minima trasparenza, dentro la barra con
     `backdrop-filter`, Chrome lasciava trasparire la pagina sotto. */
  background:
    radial-gradient(90% 50% at 100% 0%, rgba(236, 145, 160, 0.16), transparent 70%),
    radial-gradient(80% 40% at 0% 100%, rgba(92, 200, 224, 0.12), transparent 70%),
    var(--im-bg);
}

@media (prefers-reduced-motion: reduce) {
  .search-field,
  .search-all {
    transition: none;
  }
}
</style>
