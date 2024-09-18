<template>
  <div v-for="product of products" class="border-t-[2px] border-primary-950">
    <MoleculesProductCard
      :productName="product.productName"
      :code="product.code"
      :expansion="product.expansion"
      :price="product.price"
      :imageUrl="product.imageUrl"
      color-scheme="noBorder"
    />
  </div>
</template>

<script setup lang="ts">
import { PRODUCTS_COLLECTION } from "~/data/const";
import { type ProductType } from "~/components/Organisms/ProductCarousel/ProductCarousel.vue";
import { algoliasearch } from "algoliasearch";

const products: Ref<ProductType[]> = ref([]);
const config = useRuntimeConfig();
const client = algoliasearch(
  config.public.ALGOLIA_APPLICATION_ID,
  config.public.ALGOLIA_API_KEY
);

onMounted(async () => {
  let results = await client.search({
    requests: [{ indexName: PRODUCTS_COLLECTION, filters: 'type:"singole"' }],
  });
  setProducts(results.results[0]);
});

function setProducts(queryResult: any) {
  for (let hit of queryResult.hits) {
    const obj = {
      productName: hit.name,
      code: hit.code ? `(${hit.code})` : "",
      expansion: hit.expansion || "N.A.",
      price: hit.salePrice ? hit.salePrice.toFixed(2) : "0.00",
      imageUrl:
        hit.thumbnailImage ||
        (hit.images && hit.images.length > 0 ? hit.images[0] : null),
    };

    products.value.push(obj);
  }
}
</script>
