<template>
  <div
    class="relative"
    @mouseleave="activeIndex = null"
    @click="closeSearch($event)"
    :class="{ 'fixed-header': !isSearchOpen, 'overlay-header': isSearchOpen }"
  >
    <header class="header--dark header-glow-line px-8 py-5 xl:px-18">
      <div class="flex justify-between items-center">
        <div
          @click="goToItem(PATH.HOME, $event)"
          class="flex items-center gap-2 cursor-pointer"
        >
          <img
            :src="logoNew"
            alt="Jigglycard logo"
            class="w-12 h-12 object-contain"
          />
          <h2 class="text-accent-950">
            {{ t("brand.name") }}
          </h2>
        </div>

        <nav class="header-nav">
          <div
            v-for="(item, index) in headerMenu"
            :key="index"
            class="relative"
            @mouseenter="activeIndex = index"
          >
            <NuxtLink :to="item.to" @click="closeMenu">
              <span class="header-link">{{ item.name }}</span>
            </NuxtLink>
          </div>
        </nav>

        <div class="flex gap-x-4">
          <button
            class="header-btn"
            @click="$emit('toggleSearch')"
            v-show="!isSearchOpen"
          >
            <Icon name="jig:search-header-desktop" size="18" />
          </button>
          <button
            v-for="(button, index) in headerButtons"
            :key="index"
            class="header-btn"
            @click="goToItem(button.to, $event)"
            :aria-label="button.arialabel"
          >
            <span class="relative inline-flex">
              <Icon :name="button.icon" size="18" />
              <span
                v-if="button.to === PATH.CART && cartCount > 0"
                class="cart-badge"
              >
                {{ cartCount }}
              </span>
            </span>
          </button>
        </div>
      </div>

      <div v-show="isSearchOpen" class="search-panel">
        <label class="search-field">
          <Icon
            name="heroicons:magnifying-glass-20-solid"
            size="20"
            class="search-field__icon"
          />
          <input
            v-model="inputSearch"
            type="text"
            :placeholder="$t('catalog.controls.search') + '...'"
            :aria-label="$t('catalog.controls.search')"
            autocomplete="off"
            @input="onSearchInput($event)"
            class="search-field__input"
          />
        </label>

        <div v-if="productSearch.length > 0" class="search-results">
          <ul class="search-results__grid">
            <li v-for="item of productSearch" :key="item.objectID">
              <MoleculesSearchItemResult
                :thumbnailImage="item.thumbnailImage"
                :name="item.name"
                :objectID="item.objectID"
                :expansion="item.expansion"
                :price="item.salePrice"
                :tcg="item.tcg"
                :type="item.type"
                @itemClick="onItemClick"
              />
            </li>
          </ul>

          <div class="search-results__footer">
            <button type="button" class="search-all" @click="goToSearch">
              {{ t("catalog.actions.showAll") }}
              <Icon name="heroicons:arrow-right-20-solid" size="18" />
            </button>
          </div>
        </div>

        <div v-if="noResults" class="search-empty">
          <Icon name="heroicons:magnifying-glass-minus-20-solid" size="22" />
          <p>{{ t("common.messages.noResults") }}</p>
        </div>
      </div>
    </header>

    <transition name="fade">
      <div
        v-if="activeIndex !== null && headerMenu[activeIndex].subMenu.length"
        class="absolute left-0 w-full bg-accent-10 border-b border-neutrals-200 shadow-lg z-50 py-6"
      >
        <div class="max-w-screen-xl mx-auto px-12">
          <!-- `items-end`: non tutte le categorie hanno un'anteprima, così le
               etichette restano comunque allineate sulla stessa linea. -->
          <div class="flex flex-wrap items-end justify-center gap-8">
            <div v-for="(sub, i) in headerMenu[activeIndex].subMenu" :key="i">
              <MoleculesSubMenuItem
                :label="sub.label"
                :to="sub.to"
                :imgUrl="sub.image"
                @click="closeMenu"
              />
            </div>
          </div>
          <NuxtLink
            :to="headerMenu[activeIndex].to"
            class="mt-6 block hover:underline"
            @click="closeMenu"
          >
            <p class="text-center text-accent-950">
              {{ t("layout.header.allProductsLink") }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { PATH } from "~/data/const";
import { goTo } from "@/utils/navigationUtils";
import useMenu from "~/data/menu";
import { headerButtons } from "~/data/headerButtons";
import logoNew from "~/assets/logo/logo_new.png";
import type { Hit } from "~/interface/hit.interface";
import type { HeaderProps } from "~/types/headerPropsType.type";
import { useCartCount } from "~/composables/useCartCount";

const { t } = useI18n();
const inputSearch = ref("");
const { cartCount } = useCartCount();

const props = defineProps<{
  header: HeaderProps;
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
  activeIndex.value = null;
  navigateTo(`/search/${searchTerm}`);
  resetSearch();
};

const goToItem = (route: string, event: MouseEvent) => {
  closeSearch(event);
  activeIndex.value = null;
  navigateTo(route);
};

/** Click su un risultato: il link naviga da solo, qui si chiude la ricerca. */
const onItemClick = () => {
  resetSearch();
  emit("itemClick");
};

/** Il NuxtLink naviga da solo: qui basta richiudere la tendina. */
const closeMenu = () => {
  activeIndex.value = null;
};

const activeIndex = ref<number | null>(null);
const headerMenu = ref(await useMenu());
</script>

<style scoped>
.header--dark {
  background: rgba(7, 10, 31, 0.82);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.header--dark h2 {
  font-size: 26px;
  line-height: 1;
  white-space: nowrap;
  color: var(--im-ink);
}

/* Sei categorie su una riga: testo compatto, il display largo resta al logo. */
.header-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px 18px;
  margin: 0 20px;
}

@media (min-width: 1440px) {
  .header-nav {
    gap: 6px 22px;
  }
}

.header-link {
  font-family: "Roboto Flex", sans-serif;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  color: var(--im-muted);
  transition: color 0.2s ease;
}

@media (min-width: 1440px) {
  .header-link {
    font-size: 15px;
  }
}

.header-nav a:hover .header-link,
.header-nav a.router-link-active .header-link {
  color: var(--im-pink);
}

/* Le icone del set `jig` hanno il colore scritto nell'SVG: sul fondo scuro
   si portano a bianco con un filtro, senza duplicare i file. */
.header--dark .header-btn .iconify,
.header--dark .header-btn :deep(svg) {
  filter: brightness(0) invert(1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
/* Tendina di vetro sotto la barra, centrata e non più larga del contenuto:
   su schermi grandi un campo a tutta pagina sembrava un modulo d'ufficio. */
.search-panel {
  max-width: 1080px;
  margin: 18px auto 0;
  animation: search-in 0.3s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.search-field {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 56px;
  padding: 0 22px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.06);
  color: var(--im-muted);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.search-field:hover {
  border-color: rgba(255, 255, 255, 0.28);
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
  font-size: 17px;
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
  margin-top: 14px;
  padding: 12px;
  border-radius: 28px;
  border: 1px solid var(--im-line);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
  box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.8);
}

.search-results__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  max-height: min(60vh, 520px);
  overflow-y: auto;
}

/* Filo sfumato fra i risultati e il link "vedi tutti". */
.search-results__footer {
  display: flex;
  justify-content: center;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid transparent;
  border-image: linear-gradient(
      90deg,
      transparent,
      rgba(247, 210, 216, 0.35) 30%,
      rgba(92, 200, 224, 0.35) 70%,
      transparent
    )
    1;
}

.search-all {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 18px;
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
  background: rgba(247, 210, 216, 0.1);
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
  margin-top: 14px;
  padding: 22px;
  border-radius: 24px;
  border: 1px dashed rgba(255, 255, 255, 0.16);
  color: var(--im-muted);
}

.search-empty p {
  color: var(--im-muted);
}

@keyframes search-in {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .search-panel {
    animation: none;
  }

  .search-field,
  .search-all {
    transition: none;
  }
}
</style>
