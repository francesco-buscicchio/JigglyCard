<template>
  <div class="rounded-3xl overflow-hidden shadow-lg bg-white">
    <!-- I feel like hugging you -->
    <NuxtImg
      class="h-auto w-full object-cover"
      :src="product.image"
      alt="Sunset in the mountains"
    />
    <!-- You are so cute -->
    <div class="px-6 py-4 flex items-center">
      <NuxtImg :src="product.logo" alt="Crown Zenith" class="w-6 mr-4" />
      <p class="font-bold text-xl">{{ product.name }}</p>
    </div>

    <div class="px-4 pb-4">
      <div class="mb-2">Lingua</div>
      <select
        v-model="selectedOptionLanguage"
        class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-mediumPink focus:border-mediumPink sm:text-sm rounded-md"
        @change="selectedOptionLanguageChanged"
      >
        <option
          v-for="option in product.language"
          :key="option.id"
          :value="option"
        >
          {{ option.description }}
        </option>
      </select>
    </div>
    <div class="px-4">
      <div class="mb-2">Condizioni</div>
      <select
        v-model="selectedOptionCondition"
        class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-mediumPink focus:border-mediumPink sm:text-sm rounded-md"
      >
        <option
          v-for="option in selectedOptionLanguage.options"
          :key="option.id"
          :value="option"
        >
          {{ option.description }} - {{ option.price }}€
        </option>
      </select>
    </div>
    <div class="m-4">
      <button
        @click="addToCart(product)"
        class="bg-mediumPink hover:bg-darkPink text-white font-bold py-2 px-4 rounded w-full flex items-center justify-center rounded-lg"
      >
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 11-4 0 2 2 0 014 0z"
          ></path>
        </svg>
        Aggiungi al carrello - {{ price }}€
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{ product: ProductCardType }>();

type ProductCardType = {
  id: number;
  name: string;
  description: string;
  image: string;
  logo: string;
  language: Array<{
    id: number;
    description: string;
    options: Array<{ id: number; description: string; price: string }>;
  }>;
};

const selectedOptionCondition = ref(
  props.product.language[0].options[
    props.product.language[0].options.length - 1
  ]
);

const selectedOptionLanguage = ref(props.product.language[0]);

const selectedOptionLanguageChanged = () => {
  const arrayFiltered = selectedOptionLanguage.value.options.filter((val) => {
    return val.id === selectedOptionCondition.value.id;
  });
  if (arrayFiltered.length) selectedOptionCondition.value = arrayFiltered[0];
};

const price = computed(() => {
  if (!selectedOptionCondition.value) return "0";
  return selectedOptionCondition.value.price;
});

const addToCart = (product: { name: string }) => {
  alert(
    `Aggiunto al carrello: ${product.name} - Opzione: ${
      selectedOptionCondition.value?.description || "Nessuna"
    }`
  );
};
</script>
