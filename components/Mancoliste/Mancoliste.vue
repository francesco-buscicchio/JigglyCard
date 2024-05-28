<template>
  <div class="py-10 px-6">
    <div class="text-xl font-bold pb-4">Set Fossil - Carte singole</div>
    <div class="grid grid-cols-12 gap-x-4 gap-y-4">
      <div
        class="lg:col-span-3 col-span-12 shadow-lg rounded-lg border p-4"
        v-for="(item, index) of productsToDisplay"
        :key="index"
      >
        <div
          class="flex flex-row items-center justify-between cursor-pointer"
          @click="navigateTo('/card')"
        >
          <img
            :src="item.thumbnail ?? ''"
            :alt="item.title"
            class="max-h-20 h-20"
          />
          <h3 class="font-bold">{{ item.title }}</h3>
          <div class="font-bold">{{ item.finalPrice }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import mancolisteData from "~/data/mancolisteData";
type MancolistePropsType = {
  collectionID: string[];
  typeID: string[];
};

const props = defineProps<{ set: MancolistePropsType }>();

const client = useMedusaClient();
/*const { products } = await client.products.list({
  collection_id: props.set.collectionID,
  type_id: props.set.typeID,
});*/

const products = mancolisteData.products;

const productsToDisplay: any[] = filterArrayMultiplesOfFour(products);

for (let product of productsToDisplay) {
  let maxPrice = 0;
  for (const variant of product.variants) {
    for (const price of variant.prices) {
      if (maxPrice < price.amount) {
        maxPrice = price.amount;
      }
    }
  }
  let priceInEuros = maxPrice / 100;
  product.finalPrice = priceInEuros.toLocaleString("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function filterArrayMultiplesOfFour(arr: any[]): any[] {
  let maxLen = 16;
  if (isMobile()) {
    maxLen = 8;
  }
  const newArr = arr.slice(0, maxLen);
  const remainder = newArr.length % 4;
  return remainder === 0 ? newArr : newArr.slice(0, newArr.length - remainder);
}
</script>
