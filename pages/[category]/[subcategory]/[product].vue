<template>
  <div class="mx-8">
    <Breadcrumb :data="data" />

    <MoleculesListingTag @handle-tag-click="handleTagClickLanguage" :tags="tagLanguage" />
    <MoleculesListingTag @handle-tag-click="handleTagClickCondition" :tags="tagsCondition" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { TagType } from "~/components/Atoms/Tag/tag.types";
import type { ListingTagProps } from "~/components/Molecules/ListingTag/ListingTag.types";

const route = useRoute();

const tagLanguage = ref<ListingTagProps[]>([
  { type: TagType.ACTIVE, text: "italiano" },
  { type: TagType.INACTIVE, text: "inglese" },
  { type: TagType.DISABLED, text: "giapponese" },
]);
const tagsCondition = ref<ListingTagProps[]>([
  { type: TagType.ACTIVE, text: "near mint" },
  { type: TagType.INACTIVE, text: "excellent" },
  { type: TagType.DISABLED, text: "good" },
  { type: TagType.DISABLED, text: "played" },
  { type: TagType.DISABLED, text: "poor" },
]);
const data = [
  { name: "Singole", url: `/${route.params.category}` },
  {
    name: "Zenith Regale",
    url: `/${route.params.category}/${route.params.subcategory}`,
  },
  { name: "Pikachu (CRZ 160)" },
];

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
