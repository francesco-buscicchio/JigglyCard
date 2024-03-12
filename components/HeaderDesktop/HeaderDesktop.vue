<template>
  <div class="bg-ultralitePink">
    <div class="flex justify-between items-center bg-ultralitePink px-4">
      <img src="../../public/img/logo.png" alt="Logo" style="width: 40px" />

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
        <button class="mr-4">
          <img
            src="../../public/img/cart.png"
            alt="Carrello"
            class="min-h-6 min-w-6 max-h-6 max-w-6"
          />
        </button>
        <button>
          <img
            src="../../public/img/user.png"
            alt="Utente"
            class="min-h-6 min-w-6 max-h-6 max-w-6"
          />
        </button>
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const searchQuery = ref("");
    const searchResults = ref(["Prodotto 1", "Prodotto 2", "Prodotto 3"]); // Mocked search results
    const filteredResults = ref([]);

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

    return { searchQuery, filteredResults, filterResults };
  },
});
</script>
  
  <style scoped>
.input {
  @apply w-full px-4 py-2 border-2 border-mediumPink bg-white rounded outline-none focus:border-darkPink;
}
.results-container {
  @apply absolute z-10 bg-white shadow-md max-h-60 overflow-y-auto mt-1 rounded-md;
}
</style>
  