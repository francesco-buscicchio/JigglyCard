<template>
  <div
    class="relative"
    @mouseleave="activeIndex = null"
    @click="closeSearch($event)"
    :class="{ 'fixed-header': !isSearchOpen, 'overlay-header': isSearchOpen }"
  >
    <header class="bg-white shadow-md px-18 py-5">
      <div class="flex justify-between items-center">
        <h2
          @click="goToItem(PATH.HOME, $event)"
          class="text-accent-950 cursor-pointer"
        >
          {{ t("brand.name") }}
        </h2>

        <nav class="flex gap-x-6">
          <div
            v-for="(item, index) in headerMenu"
            :key="index"
            class="relative"
            @mouseenter="activeIndex = index"
          >
            <button @click="goToItem(item.to, $event)">
              <h5 class="text-accent-950 text-lg">{{ item.name }}</h5>
            </button>
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

      <div v-show="isSearchOpen" class="mt-4">
        <div class="relative">
          <input
            v-model="inputSearch"
            type="text"
            :placeholder="$t('catalog.controls.search') + '...'"
            @input="onSearchInput($event)"
            class="w-full h-12 pl-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-blue-50"
          />
          <span
            class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
          >
            <Icon name="jig:cerca-accent"></Icon>
          </span>
        </div>

        <div v-if="productSearch.length > 0" class="flex flex-col gap-4 pt-4">
          <div
            class="flex flex-col gap-4 xl:gap-6 w-full lg:grid lg:grid-cols-3"
          >
            <div v-for="item of productSearch" :key="item.objectID">
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
            </div>

            <div class="flex justify-center w-full lg:col-span-3">
              <AtomsButtonCTA
                :text="t('catalog.actions.showAll')"
                type="text"
                @click="goToSearch"
              />
            </div>
          </div>
        </div>

        <div v-if="noResults" class="w-full py-6 flex flex-col items-center">
          <p
            class="xl:max-w-2xl text-m xl:text-l leading-s xl:leading-m text-center text-neutral-dark"
          >
            {{ t("common.messages.noResults") }}
          </p>
        </div>
      </div>
    </header>

    <transition name="fade">
      <div
        v-if="activeIndex !== null && headerMenu[activeIndex].subMenu.length"
        class="absolute left-0 w-full bg-white shadow-lg z-50 py-6"
      >
        <div class="max-w-screen-xl mx-auto px-12">
          <div class="flex justify-center flex-wrap gap-[2.5vw]">
            <div
              v-for="(sub, i) in headerMenu[activeIndex].subMenu"
              :key="i"
              class="w-min-[10vw] h-min-[10vw]"
            >
              <MoleculesSubMenuItem
                :label="sub.label"
                :imgUrl="sub.image"
                @click="(e: MouseEvent) => goToItem(sub.to, e)"
              />
            </div>
          </div>
          <div
            class="mt-6 cursor-pointer hover:underline"
            @click="goToItem(headerMenu[activeIndex].to, $event)"
          >
            <p class="text-center text-accent-950">
              {{ t("layout.header.allProductsLink") }}
            </p>
          </div>
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

const activeIndex = ref<number | null>(null);
const headerMenu = ref(await useMenu());
</script>

<style scoped>
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
</style>
