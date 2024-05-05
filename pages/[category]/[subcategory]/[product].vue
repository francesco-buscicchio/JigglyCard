<template>
  <div class="w-full mx-8">
    <Breadcrumb :data="data" />
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
