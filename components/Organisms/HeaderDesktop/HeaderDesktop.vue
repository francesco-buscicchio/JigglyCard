<template>
  <div
    :class="{ 'fixed-header': !isSearchOpen, 'overlay-header': isSearchOpen }"
    class="lg:block hidden"
    @click="closeSearch($event)"
  >
    <header class="flex flex-col p-5 bg-white shadow-md px-18">
      <div class="flex justify-between items-center">
        <h2 @click="navigation(PATH.HOME)" class="text-accent-950">
          Jigglycard
        </h2>
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
          <button
            class="focus:outline-none"
            @click="toggleSearch"
            v-if="!isSearchOpen"
          >
            <Icon name="jig:search-header-desktop" size="18" />
          </button>
          <button class="focus:outline-none">
            <Icon name="jig:cart-header-desktop" size="18"></Icon>
          </button>
          <button class="focus:outline-none">
            <Icon name="jig:user-accent" size="18" />
          </button>
        </div>
      </div>

      <div v-if="isSearchOpen" class="mt-4">
        <div class="relative">
          <input
            type="text"
            class="w-full h-12 pl-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-blue-50"
            :placeholder="$t('search') + '...'"
            @input="
              ($event:Event) => {
                const target = $event.target as HTMLInputElement;
                emit('search', target.value)
              }
            "
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
            <div v-for="item of productSearch">
              <MoleculesSearchItemResult
                :thumbnailImage="item.thumbnailImage"
                :name="item.name"
                :objectID="item.objectID"
                :expansion="item.expansion"
                :price="item.salePrice"
              />
            </div>
          </div>
        </div>

        <div v-if="noResults" class="w-full py-6 flex flex-col items-center">
          <p
            class="xl:max-w-2xl text-m xl:text-l leading-s xl:leading-m text-center text-neutral-dark"
          >
            {{ $t("no_results") }}
          </p>
        </div>
      </div>
    </header>
  </div>
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
