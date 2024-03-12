<template>
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
</template>

<script setup>
import ProductCard from "../components/ProductCard/ProductCard.vue";

// Esempio di lista prodotti mock
const products = [
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
    id: 2,
    name: "Pikachu (CRZ 160)",
    description: "Questa è una descrizione del Prodotto 2.",
    price: "39,99",
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
    ],
  },
  // Aggiungi altri prodotti secondo necessità
];
</script>
