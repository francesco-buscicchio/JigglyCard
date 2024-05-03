<template>
  <div class="bg-ultralitePink">
    <div class="relative flex justify-between items-center px-4 py-2 mt-2">
      <img
        src="~/assets/img/logo.png"
        alt="Logo"
        class="w-10 cursor-pointer"
        @click="handleLogoClick"
      />
      <button @click="toggleMenu" class="z-20">
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16m-7 6h7"
          ></path>
        </svg>
      </button>
      <div
        v-if="isMenuVisible"
        class="absolute top-full right-0 left-0 shadow-md z-10 bg-ultralitePink"
      >
        <div class="px-4 py-2">
          <input
            type="text"
            placeholder="Cerca..."
            class="w-full px-4 py-2 border-2 border-pink-300 bg-white rounded outline-none focus:border-pink-500"
            @input="filterResults"
          />
          <div
            v-show="filteredResults.length"
            class="relative z-10 shadow-md max-h-60 overflow-y-auto mt-1 rounded-md"
          >
            <div
              v-for="(result, index) in filteredResults"
              :key="index"
              class="p-2 hover:bg-pink-100 opacity-2 flex items-center gap-4"
              style="background-color: #ffffff"
            >
              <!-- <img
                src="../../assets/img/product-placeholder.png"
                alt="Prodotto"
                class="w-10 h-10 object-cover rounded-full bg-white-400"
              /> -->
              <!-- Example Product Image -->
              <span v-html="highlightResult(result)"></span>
            </div>
          </div>
        </div>
        <div class="px-4 py-4 flex flex-col">
          <button class="py-2 flex items-center gap-x-6 font-semibold relative">
            <img :src="cart" alt="Carrello" class="w-6 h-6 relative" />
            <span
              v-if="header.cartCount > 0"
              class="absolute left-4 -top-2 rounded-full bg-red-500 text-white px-2 py-1 text-xs"
            >
              {{ header.cartCount }}
            </span>
            Carrello
          </button>
          <button class="py-2 flex items-center gap-x-6 mt-4 font-semibold">
            <img :src="user" alt="Utente" class="w-6 h-6" />
            Utente
          </button>
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

const isMenuVisible = ref(false);
const searchResults = ref(["Prodotto 1", "Prodotto 2", "Prodotto 3"]);
const filteredResults = ref([] as string[]);
const searchQuery = ref("");

const handleLogoClick = () => {
  navigateTo("/");
};

function toggleMenu() {
  isMenuVisible.value = !isMenuVisible.value;
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
