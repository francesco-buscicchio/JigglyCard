<template>
  <div class="w-full px-4" v-if="product">
    <MoleculesBreadcrumb />

    <MoleculesProductPageHero
      :image="product.imageUrl"
      :title="formatTitle(product.productName)"
      :code="extractCardCode(product.productName)"
      :expansion="product.expansion"
    />

    <MoleculesTextViewer>
      <template v-slot:title> Il titolo del tuo testo </template>
      <template v-slot:content>
        Questo è un testo di esempio. Può essere lungo quanto vuoi e il
        componente si adatterà alle dimensioni dello schermo. Il layout è stato
        ottimizzato per essere leggibile e chiaro su dispositivi di varie
        dimensioni.
      </template>
    </MoleculesTextViewer>
    <MoleculesListingTag
      @handle-tag-click="handleTagClickLanguage"
      :tags="tagLanguage"
    />
    <MoleculesListingTag
      @handle-tag-click="handleTagClickCondition"
      :tags="tagsCondition"
    />

    <OrganismsQuantitySelect
      :price="product.price"
      :quantity="product.quantity"
      :isCart="false"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { algoliasearch } from "algoliasearch";
import { PRODUCTS_COLLECTION } from "~/data/const";
import type {
  ListingTagProps,
  TagCode,
  TagStructure,
} from "~/components/Molecules/ListingTag/ListingTag.types";
import { TagType } from "~/components/Atoms/Tag/tag.types";
import {
  activateLanguage,
  createTagCondition,
  createTagLanguage,
  createTagsStructure,
  findActiveLanguage,
} from "./product.utils";

const product = ref();
const config = useRuntimeConfig();
const route = useRoute();
const client = useAlgolia();

onMounted(async () => {
  fetchData();
});

const tagLanguage = ref<ListingTagProps[]>([]);
const tagsCondition = ref<ListingTagProps[]>([]);
let tagsStructure: TagStructure[];

async function fetchData() {
  let results = await client.search({
    requests: [
      {
        indexName: PRODUCTS_COLLECTION,
        filters: `objectID:"${route.params.product}"`,
      },
    ],
  });
  tagsStructure = createTagsStructure(results.results[0]);
  setTags(tagsStructure);
  setProduct(results.results[0]);
}

const setTags = (tagsStructure: TagStructure[]): void => {
  tagLanguage.value = createTagLanguage(tagsStructure);
  const activeLanguage = findActiveLanguage(tagLanguage.value, tagsStructure);
  const activeConditions = activeLanguage ? activeLanguage.conditions : [];
  tagsCondition.value = createTagCondition(tagsStructure, activeConditions);
};

const setProduct = (queryResult: any) => {
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
      quantity: item.quantity,
    };
  }
};

function extractCardCode(input: string): string | undefined {
  const match = input.match(/\(([^)]+)\)/);
  return match ? match[1] : undefined;
}

function formatTitle(title: string): string {
  return title.replace(/\s*\([^)]*\)/, "");
}

const handleTagClickLanguage = (code: TagCode): void => {
  const activeConditions = tagsStructure.find(
    (tag) => tag.language === code
  )?.conditions;
  if (activeConditions) {
    tagsCondition.value = createTagCondition(tagsStructure, activeConditions);
  }
  tagLanguage.value = activateLanguage(tagLanguage.value, code);
};

const handleTagClickCondition = (code: TagCode): void => {
  const conditionSelected = tagsCondition.value.find(
    (tag) => tag.code === code
  );
  if (conditionSelected?.type === TagType.DISABLED) {
    const tagContainThisCondition = tagsStructure.find((tag) =>
      tag.conditions.some((cond) => cond === conditionSelected?.code)
    );
    handleTagClickLanguage(tagContainThisCondition?.language as TagCode);
  }
  tagsCondition.value = tagsCondition.value.map((tag) => ({
    ...tag,
    type:
      tag.type === TagType.DISABLED
        ? TagType.DISABLED
        : tag.code === code
        ? TagType.ACTIVE
        : TagType.INACTIVE,
  }));
};
</script>
