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
import { availableConditions, availableLanguages, preferredLanguageOrder, PRODUCTS_COLLECTION } from "~/data/const";
import type { ListingTagProps } from "~/components/Molecules/ListingTag/ListingTag.types";
import { TagCondition, TagType, type TagStructure, type VariantDetail } from "~/components/Atoms/Tag/tag.types";

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
  tagsStructure = setTagsStructure(results.results[0])
  console.log(tagsStructure)
  setTags(tagsStructure)
  setProduct(results.results[0]);
}

const setTagsStructure = (query: any): TagStructure[] => {
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
  const languageMap = new Map<string, string>(
    availableLanguages.map(lang => [lang.code, lang.name])
  );

  const conditionMap = new Map<string, string>(
    availableConditions.map(cond => [cond.code, cond.name])
  );
  const sortedLanguages = preferredLanguageOrder
    .filter(lang => tagsStructure.some(item => item.language === lang))
    .map(lang => ({
      code: lang,
      name: languageMap.get(lang) || lang,
      conditions: tagsStructure.find(item => item.language === lang)?.conditions || []
    }));

  // Mappa i linguaggi con i tipi appropriati
  tagLanguage.value = sortedLanguages.map((lang, index) => ({
    type: index === 0 ? TagType.ACTIVE : TagType.INACTIVE,
    text: lang.name
  }));

  const allConditionsSet = new Set<TagCondition>();
  tagsStructure.forEach(item => {
    item.conditions.forEach(cond => allConditionsSet.add(cond));
  });
  const allConditions = Array.from(allConditionsSet);

  // Identificazione del linguaggio attivo
  const activeLanguageCode = preferredLanguageOrder.find(lang =>
    tagLanguage.value.find(tag => tag.text === languageMap.get(lang))
  );

  const activeLanguage = tagsStructure.find(item => item.language === activeLanguageCode);
  const activeConditions = activeLanguage ? activeLanguage.conditions : [];

  // Mappatura delle condizioni con i tipi appropriati
  tagsCondition.value = allConditions.map(cond => {
    if (activeConditions.includes(cond)) {
      const index = activeConditions.indexOf(cond);
      return {
        type: index === 0 ? TagType.ACTIVE : TagType.INACTIVE,
        text: conditionMap.get(cond) || cond
      };
    } else {
      return {
        type: TagType.DISABLED,
        text: conditionMap.get(cond) || cond
      };
    }
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
