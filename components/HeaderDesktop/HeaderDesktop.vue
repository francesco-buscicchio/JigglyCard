<template>
  <div class="bg-ultralitePink">
    <div class="flex justify-between items-center bg-ultralitePink px-4">
      <NuxtImg
        src="/img/logo.png"
        alt="Logo"
        style="width: 40px"
        @click="handleLogoClick"
        class="cursor-pointer"
      />

      <div class="flex-grow mx-4 w-full px-4 py-2">
        <div class="relative">
          <input
            type="text"
            placeholder="Cerca..."
            class="input"
            @input="filterResults"
          />
          <div
            class="results-container absolute z-10 top-full left-0 right-0 bg-white shadow-md max-h-60 overflow-y-auto w-full"
            v-show="filteredResults.length"
          >
            <div
              class="p-2 hover:bg-ultralitePink"
              v-for="(result, index) in filteredResults"
              :key="index"
            >
              {{ result }}
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-x-4">
        <button class="mr-4 relative" aria-label="Carrello">
          <NuxtImg
            src="/img/cart.png"
            alt="Carrello"
            class="min-h-6 min-w-6 max-h-6 max-w-6"
          />
          <span
            class="absolute left-4 -top-4 rounded-full bg-red-500 text-white text-xs px-2 py-1"
          >
            {{ header.cartCount }}
          </span>
        </button>
        <button>
          <NuxtImg
            src="/img/user.png"
            alt="Utente"
            class="min-h-6 min-w-6 max-h-6 max-w-6"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

type HeaderPropsType = {
  cartCount: number;
};

const props = defineProps<{ header: HeaderPropsType }>();

const searchQuery = ref("");
const searchResults = ref(["Prodotto 1", "Prodotto 2", "Prodotto 3"]);
const filteredResults = ref([] as string[]);

const handleLogoClick = () => {
  navigateTo("/");
};

function filterResults(event: Event) {
  const query = (event.target as HTMLInputElement).value;
  if (query) {
    filteredResults.value = searchResults.value.filter((result) =>
      result.toLowerCase().includes(query.toLowerCase())
    );
  } else {
    filteredResults.value = [];
  }
}
</script>

<style scoped>
.input {
  @apply w-full px-4 py-2 border-2 border-mediumPink bg-white rounded outline-none focus:border-darkPink;
}
.results-container {
  @apply absolute z-10 bg-white shadow-md max-h-60 overflow-y-auto mt-1 rounded-md;
}
</style>
