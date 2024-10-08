<template>
  <div class="w-full mx-4" v-if="product">
    <MoleculesBreadcrumb />

    <MoleculesProductPageHero
      :image="product.imageUrl"
      :title="formatTitle(product.productName)"
      :code="extractCardCode(product.productName)"
      :expansion="product.expansion"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { algoliasearch } from "algoliasearch";
import { PRODUCTS_COLLECTION } from "~/data/const";

const product = ref();
const config = useRuntimeConfig();
const route = useRoute();
const client = algoliasearch(
  config.public.ALGOLIA_APPLICATION_ID,
  config.public.ALGOLIA_API_KEY
);

onMounted(async () => {
  fetchData();
});

async function fetchData() {
  let results = await client.search({
    requests: [
      {
        indexName: PRODUCTS_COLLECTION,
        filters: `objectID:"${route.params.product}"`,
      },
    ],
  });
  setProduct(results.results[0]);
}

function setProduct(queryResult: any) {
  if (queryResult.hits) {
    const item = queryResult.hits[0];
    product.value = {
      productName: item.name,
      code: item.code ? `(${item.code})` : "",
      expansion: item.expansion || "N.A.",
      price: item.salePrice ? item.salePrice.toFixed(2) : "0.00",
      imageUrl:
        item.thumbnailImage ||
        (item.images && item.images.length > 0 ? item.images[0] : null),
      tcg: item.tcg,
      category: item.type,
      id: item.objectID,
      variants: item.variantsDetails,
    };
  }
}

function extractCardCode(input: string): string | undefined {
  const match = input.match(/\(([^)]+)\)/);
  return match ? match[1] : undefined;
}

function formatTitle(title: string): string {
  return title.replace(/\s*\([^)]*\)/, "");
}
</script>
