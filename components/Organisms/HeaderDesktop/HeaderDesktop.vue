<template>
  <header
    class="flex justify-between items-center p-5 bg-white shadow-md px-18"
  >
    <h2 @click="navigation(PATH.HOME)" class="text-accent-950">Jigglycard</h2>
    <div class="flex flex-row gap-x-4">
      <button
        v-for="(item, index) of headerMenu"
        @click="navigation(item.to)"
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
import { PATH } from "~/data/const";
import type { Hit } from "~/types/product.type";

type HeaderPropsType = {
  cartCount: number;
};

const props = defineProps<{
  header: HeaderPropsType;
  productSearch: Hit[];
  isSearchOpen: boolean;
  noResults: boolean;
}>();

const headerMenu = ref([
  { name: "Pokemon", to: "/pokemon/all" },
  { name: "One Piece", to: "/one-piece/all" },
  { name: "Final Fantasy", to: "/final-fantasy/all" },
  { name: "Dragon Ball", to: "/dragon-ball/all" },
  { name: "Lorcana", to: "/lorcana/all" },
]);
const emit = defineEmits([
  "search",
  "toggleSearch",
  "closeSearch",
  "updateSearch",
]);

const navigation = (path: string) => {
  navigateTo(path);
};

const handleMenuItemClick = (item: string) => {
  navigateTo(item);
};

const toggleSearch = () => {
  emit("toggleSearch");
};

const closeSearch = (event: MouseEvent) => {
  emit("closeSearch", event);
};

// TODO: serve?
const searchResults = ref(["Prodotto 1", "Prodotto 2", "Prodotto 3"]);
const filteredResults = ref([] as string[]);
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
