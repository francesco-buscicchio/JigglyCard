<template>
  <div class="w-full px-4" v-if="product">
    <MoleculesBreadcrumb />

    <MoleculesProductPageHero :image="product.imageUrl" :title="formatTitle(product.productName)"
      :code="extractCardCode(product.productName)" :expansion="product.expansion" />

    <MoleculesTextViewer>
      <template v-slot:title>
        Il titolo del tuo testo
      </template>
      <template v-slot:content>
        Questo è un testo di esempio. Può essere lungo quanto vuoi e il componente si adatterà alle dimensioni dello
        schermo. Il layout è stato ottimizzato per essere leggibile e chiaro su dispositivi di varie dimensioni.
      </template>
    </MoleculesTextViewer>
  </div>

</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { algoliasearch } from "algoliasearch";
import { PRODUCTS_COLLECTION } from "~/data/const";

const product = ref();
const config = useRuntimeConfig();
const route = useRoute();
const client = useAlgolia();

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
