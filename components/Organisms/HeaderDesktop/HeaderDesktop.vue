<template>
  <header
    class="flex justify-between items-center p-5 bg-white shadow-md px-18"
  >
    <h2 @click="handleLogoClick()" class="text-accent-950">Jigglycard</h2>
    <div class="flex flex-row gap-x-4">
      <button
        v-for="(item, index) of headerMenu"
        @click="handleMenuItemClick(item.to)"
      >
        <h5 class="text-accent-950 text-lg">
          {{ item.name }}
        </h5>
      </button>
    </div>
    <div class="flex flex-row gap-x-4">
      <button class="focus:outline-none">
        <Icon name="jig:search-header-desktop" size="18" />
      </button>
      <button class="focus:outline-none">
        <Icon name="jig:cart-header-desktop" size="18"></Icon>
      </button>
      <button class="focus:outline-none">
        <Icon name="jig:user-accent" size="18" />
      </button>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref } from "vue";

type HeaderPropsType = {
  cartCount: number;
};

const props = defineProps<{ header: HeaderPropsType }>();

const searchQuery = ref("");
const searchResults = ref(["Prodotto 1", "Prodotto 2", "Prodotto 3"]);
const headerMenu = ref([
  { name: "Pokemon", to: "/pokemon/all" },
  { name: "One Piece", to: "/one-piece/all" },
  { name: "Final Fantasy", to: "/final-fantasy/all" },
  { name: "Dragon Ball", to: "/dragon-ball/all" },
  { name: "Lorcana", to: "/lorcana/all" },
]);
const filteredResults = ref([] as string[]);

const handleLogoClick = () => {
  navigateTo("/");
};

const handleMenuItemClick = (item: string) => {
  navigateTo(item);
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
/* .input {
  @apply w-full px-4 py-2 border-2 border-mediumPink bg-white rounded outline-none focus:border-darkPink;
}
.results-container {
  @apply absolute z-10 bg-white shadow-md max-h-60 overflow-y-auto mt-1 rounded-md;
} */
</style>
