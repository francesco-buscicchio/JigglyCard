<template>
  <div class="w-full mx-4" v-if="product">
    <MoleculesBreadcrumb />

    <MoleculesProductPageHero :image="product.imageUrl" :title="formatTitle(product.productName)"
      :code="extractCardCode(product.productName)" :expansion="product.expansion" />

    <MoleculesListingTag @handle-tag-click="handleTagClickLanguage" :tags="tagLanguage" />
    <MoleculesListingTag @handle-tag-click="handleTagClickCondition" :tags="tagsCondition" />

  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { algoliasearch } from "algoliasearch";
import { availableLanguages, PRODUCTS_COLLECTION } from "~/data/const";
import type { ListingTagProps } from "~/components/Molecules/ListingTag/ListingTag.types";
import { TagType, type TagStructure, type VariantDetail } from "~/components/Atoms/Tag/tag.types";
import { activateLanguage, createTagCondition, createTagLanguage, findActiveLanguage } from "./product.utils";

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

const tagLanguage = ref<ListingTagProps[]>([]);
const tagsCondition = ref<ListingTagProps[]>([]);
let tagsStructure: TagStructure[]
async function fetchData() {
  let results = await client.search({
    requests: [
      {
        indexName: PRODUCTS_COLLECTION,
        filters: `objectID:"${route.params.product}"`,
      },
    ],
  });
  tagsStructure = createTagsStructure(results.results[0])
  setTags(tagsStructure)
  setProduct(results.results[0]);
}

const createTagsStructure = (query: any): TagStructure[] => {
  const variantsDetails: VariantDetail[] =
    query.hits[0].variantsDetails;
  const grouped: { [key in TagStructure["language"]]?: Set<VariantDetail["condition"]> } = {};

  variantsDetails.forEach(variant => {
    const { language, condition } = variant

    if (!grouped[language]) {
      grouped[language] = new Set();
    }

    grouped[language]?.add(condition);
  })

  const tagStructures: TagStructure[] = Object.entries(grouped).map(([lang, conditionsSet]) => ({
    language: lang as TagStructure["language"],
    conditions: Array.from(conditionsSet!) as TagStructure["conditions"],
  }));

  return tagStructures;

}


const setTags = (tagsStructure: TagStructure[]) => {

  tagLanguage.value = createTagLanguage(tagsStructure)
  const activeLanguage = findActiveLanguage(tagLanguage.value, tagsStructure)
  const activeConditions = activeLanguage ? activeLanguage.conditions : [];
  tagsCondition.value = createTagCondition(tagsStructure, activeConditions)
};


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

const handleTagClickLanguage = (text: string) => {
  const codeLanguage = (availableLanguages.find(lang => lang.name === text))?.code
  const activeConditions = (tagsStructure.find(tag => tag.language === codeLanguage))?.conditions
  if (activeConditions) {
    tagsCondition.value = createTagCondition(tagsStructure, activeConditions)
  }
  tagLanguage.value = activateLanguage(tagLanguage.value, text)

};

const handleTagClickCondition = (text: string) => {
};

const updateTagState = (tags: ListingTagProps[], text: string): ListingTagProps[] => {
  return tags.map(tag => {
    if (tag.type === TagType.DISABLED) {
      // TODO gestire il clcik dei disabled
      return tag; // I tag disabilitati non vengono aggiornati
    }

    if (tag.text === text) {
      return { ...tag, type: TagType.ACTIVE };
    }

    return { ...tag, type: TagType.INACTIVE };
  });
};
</script>
