<template>
    <div v-if="firstProduct" class="xl:flex justify-center m-4 l:m-0">
      <div v-if="firstProduct.images && firstProduct.images.length > 0" class="images-container">
        <div class="thumbnails vertical-align">
          <div v-for="(image, index) in firstProduct.images" :key="image.id">
            <img 
              :src="image.url" 
              :alt="'error'" 
              @click="showImg(image.url)"
              :class="{ 'selected-thumbnail': selectedImage === image.url }"
            />
          </div>
        </div>
        <div class="main-image px-10">
          <img :src="selectedImage || firstProduct.images[0].url" :alt="'error'" />
        </div>
      </div>
      <div class="vertical-align">      
        <h1 class="text-xl"><strong>{{ firstProduct.title }}</strong></h1>
        <div v-for="variant in firstProduct.variants" :key="variant.id">
          <p><strong>€ {{ variant.prices[0].amount }}</strong></p>
          <p class="text-xs">Tasse incluse. Spedizione calcolata al momento del pagamento</p>
          <p class="text-xs"><strong>Lingua:</strong></p>
          <button class="h-10 px-2 border border-gray hover:mediumPink focus:mediumPink active:mediumPink">
            <p>{{ variant.title }}</p>
          </button>
          <p class="text-xs mt-2 l:mt-0"><strong>Quantità:</strong></p>
          <div class="flex justify-between py-2">
            <select class="h-10 px-8 border border-gray" v-model="selectedQuantity">
                <option v-for="n in variant.inventory_quantity" :key="n" :value="n">{{ n }}</option>
            </select>
            <button class="h-10 px-10 border border-gray">Aggiungi al carrello</button>
          </div>
          <button class="mt-2 h-10 w-full bg-mediumPink">Acquista con PayPal</button>
        </div>
        <button @click="toggleDescription">{{ showDescription ? 'Mostra meno' : 'Mostra di più' }}</button>
        <p v-if="showDescription"><strong>Descrizione:</strong> {{ firstProduct.description }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  const client = useMedusaClient();
  
  const firstProduct = ref(null);
  const selectedImage = ref(null);
  const showDescription = ref(false);
  const selectedQuantity = ref(1);
  
  const { products } = await client.products.list();
  if (products.length > 0) {
      firstProduct.value = products[0];
      // Set initial selectedQuantity to 1 or the first variant's available quantity if necessary
      if (firstProduct.value.variants.length > 0) {
        selectedQuantity.value = Math.min(1, firstProduct.value.variants[0].inventory_quantity);
      }
  }
  
  function showImg(value) {
      console.log("Image clicked:", value);
      selectedImage.value = value;
  }
  
  function toggleDescription() {
      showDescription.value = !showDescription.value;
  }
  </script>
  
  <style>
  .images-container {
    display: flex;
  }
  
  .thumbnails {
    display: flex;
    flex-direction: column;
    margin-right: 10px;
  }
  
  .thumbnails img {
    cursor: pointer;
    margin-bottom: 10px;
    max-width: 100px; 
    border: 2px solid transparent;
  }
  
  .thumbnails img.selected-thumbnail {
    border: 2px solid #007bff;
  }
  
  .main-image img {
    max-width: 500px;
    height: auto;
  }
  
  .vertical-align {
    display: flex;
    flex-direction: column;
    justify-content: center; 
  }

@media (max-width: 640px) { 
  .thumbnails {
    display: none;
  }
  .main-image img {
    max-width: 250px;
    height: auto;
  }
}
  </style>
  