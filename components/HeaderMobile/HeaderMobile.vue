<template>
  <div class="bg-ultralitePink">
    <div class="relative flex justify-between items-center px-4 py-2 mt-2">
      <div class="flex-row items-center h-full">
        <button class="z-20" aria-label="Menu">
          <Icon name="fluent-mdl2:list" class="w-6 h-6 mr-3"></Icon>
        </button>

        <Icon
          name="fluent-mdl2:search"
          class="w-5 h-5"
          @click="toggleSearch"
        ></Icon>
      </div>
      <NuxtImg
        src="/img/logo.png"
        alt="Logo"
        class="w-10 cursor-pointer"
        @click="handleLogoClick"
      />

      <div class="flex flex-row items-center">
        <Icon name="ep:user" class="w-6 h-6 mr-3"></Icon>
        <button class="mr-4 relative" aria-label="Carrello">
          <Icon name="clarity:shopping-cart-line" class="w-6 h-6" />
          <span
            class="absolute left-4 -top-4 rounded-full bg-red-500 text-white text-xs px-2 py-1"
          >
            {{ header.cartCount }}
          </span>
        </button>
      </div>
      <div
        v-if="isSearchVisible"
        class="absolute top-full right-0 left-0 shadow-md z-10 bg-ultralitePink"
      >
        <div class="px-4 py-2">
          <input
            type="text"
            placeholder="Cerca..."
            class="w-full px-4 py-2 border-2 border-pink-300 bg-white rounded outline-none focus:border-pink-500"
            @input="filterResults"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from "vue";
import cart from "~/assets/img/cart.png";
import user from "~/assets/img/user.png";

type HeaderPropsType = {
  cartCount: number;
};

const props = defineProps<{ header: HeaderPropsType }>();

const isSearchVisible = ref(false);
const searchResults = ref(["Prodotto 1", "Prodotto 2", "Prodotto 3"]);
const filteredResults = ref([] as string[]);
const searchQuery = ref("");

const handleLogoClick = () => {
  navigateTo("/");
};

function toggleSearch() {
  isSearchVisible.value = !isSearchVisible.value;
}

function filterResults(event: Event) {
  const query = (event.target as HTMLInputElement).value;
  filteredResults.value = query
    ? searchResults.value.filter((result) =>
        result.toLowerCase().includes(query.toLowerCase())
      )
    : [];
}

function highlightResult(result: string) {
  if (!searchQuery.value) return result;
  const re = new RegExp(searchQuery.value, "gi");
  return result.replace(re, (match) => `<mark>${match}</mark>`);
}
</script>
