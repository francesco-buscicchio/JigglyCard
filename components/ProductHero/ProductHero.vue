<template>
  <div v-if="firstProduct" class="xl:flex justify-center m-4 l:m-0">
    <div
      v-if="firstProduct.images && firstProduct.images.length > 0"
      class="flex justify-center"
    >
      <div class="thumbnails flex flex-col justify-center">
        <div v-for="(image, index) in firstProduct.images" :key="image.id">
          <img
            :src="image.url"
            :alt="'error'"
            @click="showImg(image.url)"
            class="cursor-pointer mb-10 max-w-[100px] border-2 border-transparent"
            :class="{ 'border-2': selectedImage === image.url }"
          />
        </div>
      </div>
      <div class="px-10">
        <img
          :src="selectedImage || firstProduct.images[0].url"
          :alt="'error'"
          class="max-w-[250px] md:max-w-[500px] h-auto"
        />
      </div>
    </div>
    <div class="flex flex-col justify-center gap-y-2">
      <h5 class="mt-4 l:mt-0">
        <strong>{{ firstProduct.title }}</strong>
      </h5>
      <p>
        <strong>€ {{ firstProduct.variants[0].prices[0].amount }}</strong>
      </p>
      <p class="text-xs">{{ t("productHero.TasseESpedizione") }}</p>
      <p class="text-xs mt-2 l:mt-0">
        <strong> {{ t("productHero.Lingua") }} :</strong>
      </p>
      <div class="flex flex-row gap-x-4">
        <div v-for="variant in firstProduct.variants" :key="variant.id">
          <button
            class="h-10 px-2 border border-gray hover:mediumPink focus:mediumPink active:mediumPink"
          >
            <p>{{ variant.title }}</p>
          </button>
        </div>
      </div>
      <p class="text-xs mt-2 l:mt-0">
        <strong>{{ t("productHero.Quantita") }} :</strong>
      </p>
      <div class="flex justify-between">
        <select class="h-10 px-8 border border-gray" v-model="selectedQuantity">
          <option
            v-for="n in firstProduct.variants[0].inventory_quantity"
            :key="n"
            :value="n"
          >
            {{ n }}
          </option>
        </select>
        <button class="h-10 px-10 border border-gray">
          {{ t("productHero.AggiungiCarrello") }}
        </button>
      </div>
      <button class="mt-2 h-10 w-full bg-mediumPink text-white">
        {{ t("productHero.AcquistaPaypal") }}
      </button>
      <button class="text-s" @click="toggleDescription">
        {{ showDescription ? "Mostra meno" : "Mostra di più" }}
      </button>
      <p v-if="showDescription">
        <strong>{{ t("productHero.Descrizione") }}:</strong>
        {{ firstProduct.description }}
      </p>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
import { ref } from "vue";
const client = useMedusaClient();
const { t } = useI18n();

const firstProduct = ref(null);
const selectedImage = ref(null);
const showDescription = ref(false);
const selectedQuantity = ref(1);

const { products } = await client.products.list();
if (products.length > 0) {
  firstProduct.value = products[0];
  if (firstProduct.value.variants.length > 0) {
    selectedQuantity.value = Math.min(
      1,
      firstProduct.value.variants[0].inventory_quantity
    );
  }
}

function showImg(value) {
  selectedImage.value = value;
}

function toggleDescription() {
  showDescription.value = !showDescription.value;
}
</script>
  
  <style>
.thumbnails {
  display: flex;
  flex-direction: column;
  margin-right: 10px;
}

@media (max-width: 640px) {
  .thumbnails {
    display: none;
  }
}
</style>
  