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
import { algoliasearch, type SearchResult } from "algoliasearch";
import { availableConditions, availableLanguages, PRODUCTS_COLLECTION } from "~/data/const";
import type { ListingTagProps } from "~/components/Molecules/ListingTag/ListingTag.types";
import { TagType } from "~/components/Atoms/Tag/tag.types";

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
const tagLanguage = ref<ListingTagProps[]>(
  [
    // { type: TagType.ACTIVE, text: "italiano" },
    // { type: TagType.INACTIVE, text: "inglese" },
    // { type: TagType.DISABLED, text: "giapponese" },
  ]
);
const tagsCondition = ref<ListingTagProps[]>(
  [
    // { type: TagType.ACTIVE, text: "near mint" },
    // { type: TagType.INACTIVE, text: "excellent" },
    // { type: TagType.DISABLED, text: "good" },
    // { type: TagType.DISABLED, text: "played" },
    // { type: TagType.DISABLED, text: "poor" },
  ]
);

async function fetchData() {
  let results = await client.search({
    requests: [
      {
        indexName: PRODUCTS_COLLECTION,
        filters: `objectID:"${route.params.product}"`,
      },
    ],
  });
  setTags(results.results[0])
  setProduct(results.results[0]);
}

const setTags = (query: any) => {
  const variantsDetails: { language: string; condition: string; price: number }[] =
    query.hits[0].variantsDetails;

  const variantLanguages = Array.from(new Set(variantsDetails.map((v) => v.language)));

  const activeLanguageCode = variantLanguages[0];

  tagLanguage.value = availableLanguages
    .filter((lang) => variantLanguages.includes(lang.code))
    .map((lang) => ({
      type: lang.code === activeLanguageCode ? TagType.ACTIVE : TagType.INACTIVE,
      text: lang.name,
    }));

  // Estrazione delle condizioni per la lingua attiva
  const activeLanguageConditions = new Set(
    variantsDetails
      .filter((v) => v.language === activeLanguageCode)
      .map((v) => v.condition)
  );

  // Estrazione delle condizioni per le lingue inattive
  const inactiveLanguageConditions = new Set(
    variantsDetails
      .filter((v) => v.language !== activeLanguageCode)
      .map((v) => v.condition)
  );

  // Determinazione della prima condizione attiva
  const firstActiveCondition = [...activeLanguageConditions][0];

  // Creazione dei tag per le condizioni disponibili
  tagsCondition.value = availableConditions
    .filter(
      (cond) =>
        activeLanguageConditions.has(cond.code) || inactiveLanguageConditions.has(cond.code)
    )
    .map((cond) => {
      let type: TagType;

      if (activeLanguageConditions.has(cond.code)) {
        type = cond.code === firstActiveCondition ? TagType.ACTIVE : TagType.INACTIVE;
      } else {
        type = TagType.DISABLED;
      }

      return { type, text: cond.name };
    });
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
  tagLanguage.value = updateTagState(tagLanguage.value, text);
};

const handleTagClickCondition = (text: string) => {
  tagsCondition.value = updateTagState(tagsCondition.value, text);
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
