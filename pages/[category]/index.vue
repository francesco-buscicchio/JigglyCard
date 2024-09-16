<template>
  <div class="mx-8">
    <OrganismsListingFilters></OrganismsListingFilters>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

const data = [
  { name: "Singole", url: `/${route.params.category}` },
  {
    name: "Zenith Regale",
    url: `/${route.params.category}/${route.params.subcategory}`,
  },
  { name: "Pikachu (CRZ 160)" },
];
</script>
