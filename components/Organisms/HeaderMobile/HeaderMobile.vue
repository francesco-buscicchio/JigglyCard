<template>
  <div
    :class="{ 'fixed-header': !isSearchOpen, 'overlay-header': isSearchOpen }"
    class="lg:hidden"
    @click="closeSearch($event)"
  >
    <nav class="bg-white shadow-md p-4">
      <div class="container mx-auto flex justify-between items-center">
        <div class="lg:hidden">
          <button @click="toggleMenu" class="text-gray-700 focus:outline-none">
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
            class="focus:outline-none"
          >
            <Icon name="jig:cerca-accent" size="25" />
          </button>
          <button class="focus:outline-none" @click="goTo(PATH.CART)">
            <span class="relative inline-flex">
              <Icon name="jig:cart-accent" size="25" />
              <span v-if="cartCount > 0" class="cart-badge">
                {{ cartCount }}
              </span>
            </span>
          </button>
        </div>
      </div>

      <div v-if="isSearchOpen" class="mt-4">
        <div class="relative">
          <input
            v-model="inputSearch"
            type="text"
            class="w-full h-12 pl-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-blue-50"
            :placeholder="t('catalog.controls.search') + '...'"
            @input="onSearchInput($event)"
          />
          <span
            class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
          >
            <Icon name="jig:cerca-accent"></Icon>
          </span>
        </div>

        <div v-if="productSearch.length > 0" class="flex flex-col gap-4 pt-4">
          <div class="flex flex-col gap-4 xl:gap-6 w-full">
            <div v-for="item of productSearch">
              <MoleculesSearchItemResult
                :thumbnailImage="item.thumbnailImage"
                :name="item.name"
                :objectID="item.objectID"
                :expansion="item.expansion"
                :tcg="item.tcg"
                :type="item.type"
                @itemClick="onItemClick"
              />
            </div>

            <div class="flex justify-center w-full">
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
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 transform scale-95"
        enter-to-class="opacity-100 transform scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 transform scale-100"
        leave-to-class="opacity-0 transform scale-95"
      >
        <div v-if="isMenuOpen" class="lg:hidden">
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

const onItemClick = (event: Event) => {
  emit("itemClick");
};
</script>

<style scoped>
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
