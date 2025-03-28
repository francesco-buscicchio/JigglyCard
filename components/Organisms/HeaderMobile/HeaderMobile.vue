<template>
  <nav class="bg-white shadow-md p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="lg:hidden">
        <button @click="toggleMenu" class="text-gray-700 focus:outline-none">
          <Icon name="jig:menu" v-if="!isMenuOpen" size="20"></Icon>
          <Icon name="jig:close-accent" v-else size="20"></Icon>
        </button>
      </div>

      <div class="relative w-[70%]">
        <h2 class="text-accent-950 text-center" @click="navigateTo('/')">
          Jigglycard
        </h2>
      </div>

      <div class="items-center space-x-4">
        <button class="focus:outline-none">
          <Icon name="jig:cart-accent" size="25"></Icon>
        </button>
        <button @click="toggleSearch" class="focus:outline-none">
          <Icon name="jig:cerca-accent" size="25" />
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
            ($event) => {
              //@ts-ignore
              searchProducts($event.target.value);
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
        <div class="flex flex-col gap-4 xl:gap-6 w-full">
          <div v-for="item of productSearch">
            <MoleculesSearchItemResult
              :thumbnailImage="item.thumbnailImage"
              :name="item.name"
              :objectID="item.objectID"
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

    <div v-if="isMenuOpen" class="lg:hidden">
      <MoleculesMobileMenu />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useHead } from "#app";

const isMenuOpen = ref(false);
const isSearchOpen = ref(false);
const emit = defineEmits(["toggle-menu"]);
const searchValue = ref("");
const productSearch = ref([]);
const noResults = computed(
  () => !(productSearch.value.length > 0 || searchValue.value.length < 3)
);

const config = useRuntimeConfig();
const client = useAlgolia();

watch(isMenuOpen, (newValue) => {
  useHead({
    bodyAttrs: {
      class: newValue ? "hide" : "scrollable",
    },
  });
});

const searchProducts = async (data: any) => {
  searchValue.value = data;
  if (searchValue.value.length > 2) {
    const results = await client.searchSingleIndex({
      indexName: "ecommerce",
      searchParams: { query: searchValue.value, hitsPerPage: 4 },
    });
    productSearch.value = results.hits as any;
  } else productSearch.value = [];
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  emit("toggle-menu");
};

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
  emit("toggle-menu");
};

const navigateTo = (path: String) => {
  navigateTo(path);
};
</script>
