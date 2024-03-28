<template>
  <div class="relative min-h-screen">
    <HeaderMobile class="w-full lg:hidden" :header="{ cartCount: 9 }" />
    <HeaderDesktop class="hidden w-full lg:block" :header="{ cartCount: 9 }" />
    <div class="flex">
      <div
        class="filters-section sticky top-0 pt-[var(--header-height)] h-screen bg-gray-100 p-4 w-full max-w-[30vw] overflow-auto"
      >
        <FilterCard
          :filters="checkboxFilters"
          class="w-full mb-8"
          title="Conditions"
          type="checkboxList"
          @update:filters="handleFiltersUpdate"
        />
        <FilterCard
          title="Price Range"
          type="rangeSelector"
          :range="priceRange"
          class="w-full"
          rangeLabel="Select a price range"
          @update:range="handleRangeUpdate"
        />
      </div>

      <div class="content-section flex-grow">
        <div class="container mx-auto p-4 bg-white-400">
          <h1 class="text-xl font-bold mb-8">Prodotti in Evidenza</h1>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ProductCard from "../components/ProductCard/ProductCard.vue";
import FilterCard from "../components/FilterCard/FilterCard.vue";
import HeaderMobile from "../components/HeaderMobile/HeaderMobile.vue";
import HeaderDesktop from "../components/HeaderDesktop/HeaderDesktop.vue";

const checkboxFilters = ref([
  { label: "Near Mint", enabled: false },
  { label: "Excellent", enabled: false },
  { label: "Good", enabled: false },
  { label: "Light Played", enabled: false },
  { label: "Played", enabled: false },
  { label: "Poor", enabled: false },
]);

const priceRange = ref({
  min: 0,
  max: 100,
  value: 20,
});

function handleFiltersUpdate(filterName) {
  const filter = checkboxFilters.value.find((f) => f.label === filterName);
  if (filter) {
    filter.enabled = !filter.enabled;
  }
}

function handleRangeUpdate(newValue) {
  priceRange.value.value = newValue;
}

const products = ref([
  {
    id: 1,
    name: "Pikachu (CRZ 160)",
    description: "Questa è una descrizione del Prodotto 1.",
    price: "29,99",
    image: "../public/img/SWSH12pt5_IT_160.png",
    logo: "../public/img/crown-zenith.jpg",
    language: [
      {
        id: 1,
        description: "Italiano",
        options: [
          { id: 1, description: "Poor", price: "2" },
          { id: 2, description: "Played", price: "3" },
          { id: 3, description: "Light Played", price: "4" },
        ],
      },
      {
        id: 2,
        description: "Inglese",
        options: [
          { id: 1, description: "Poor", price: "2,5" },
          { id: 2, description: "Played", price: "3,5" },
          { id: 3, description: "Light Played", price: "4,5" },
        ],
      },
    ],
  },
  {
    id: 1,
    name: "Pikachu (CRZ 160)",
    description: "Questa è una descrizione del Prodotto 1.",
    price: "29,99",
    image: "../public/img/SWSH12pt5_IT_160.png",
    logo: "../public/img/crown-zenith.jpg",
    language: [
      {
        id: 1,
        description: "Italiano",
        options: [
          { id: 1, description: "Poor", price: "2" },
          { id: 2, description: "Played", price: "3" },
          { id: 3, description: "Light Played", price: "4" },
        ],
      },
      {
        id: 2,
        description: "Inglese",
        options: [
          { id: 1, description: "Poor", price: "2,5" },
          { id: 2, description: "Played", price: "3,5" },
          { id: 3, description: "Light Played", price: "4,5" },
        ],
      },
    ],
  },
  {
    id: 1,
    name: "Pikachu (CRZ 160)",
    description: "Questa è una descrizione del Prodotto 1.",
    price: "29,99",
    image: "../public/img/SWSH12pt5_IT_160.png",
    logo: "../public/img/crown-zenith.jpg",
    language: [
      {
        id: 1,
        description: "Italiano",
        options: [
          { id: 1, description: "Poor", price: "2" },
          { id: 2, description: "Played", price: "3" },
          { id: 3, description: "Light Played", price: "4" },
        ],
      },
      {
        id: 2,
        description: "Inglese",
        options: [
          { id: 1, description: "Poor", price: "2,5" },
          { id: 2, description: "Played", price: "3,5" },
          { id: 3, description: "Light Played", price: "4,5" },
        ],
      },
    ],
  },
  {
    id: 1,
    name: "Pikachu (CRZ 160)",
    description: "Questa è una descrizione del Prodotto 1.",
    price: "29,99",
    image: "../public/img/SWSH12pt5_IT_160.png",
    logo: "../public/img/crown-zenith.jpg",
    language: [
      {
        id: 1,
        description: "Italiano",
        options: [
          { id: 1, description: "Poor", price: "2" },
          { id: 2, description: "Played", price: "3" },
          { id: 3, description: "Light Played", price: "4" },
        ],
      },
      {
        id: 2,
        description: "Inglese",
        options: [
          { id: 1, description: "Poor", price: "2,5" },
          { id: 2, description: "Played", price: "3,5" },
          { id: 3, description: "Light Played", price: "4,5" },
        ],
      },
    ],
  },
  {
    id: 1,
    name: "Pikachu (CRZ 160)",
    description: "Questa è una descrizione del Prodotto 1.",
    price: "29,99",
    image: "../public/img/SWSH12pt5_IT_160.png",
    logo: "../public/img/crown-zenith.jpg",
    language: [
      {
        id: 1,
        description: "Italiano",
        options: [
          { id: 1, description: "Poor", price: "2" },
          { id: 2, description: "Played", price: "3" },
          { id: 3, description: "Light Played", price: "4" },
        ],
      },
      {
        id: 2,
        description: "Inglese",
        options: [
          { id: 1, description: "Poor", price: "2,5" },
          { id: 2, description: "Played", price: "3,5" },
          { id: 3, description: "Light Played", price: "4,5" },
        ],
      },
    ],
  },
  // Aggiungi altri prodotti secondo necessità
]);
</script>

<style>
.filters-section {
  width: 240px; /* Or your preferred width */
  z-index: 10;
}

@media (min-width: 1024px) {
  :root {
    --header-height: 80px; /* Adjust based on your desktop header's actual height */
  }
}

/* Additional styles */
</style>
