<template>
  <NewsBanner :news="newsBannerData" class="lg:pb-9"></NewsBanner>
  <HeaderMobile class="w-full lg:hidden" :header="{ cartCount: 9 }" />
  <HeaderDesktop class="hidden w-full lg:block" :header="{ cartCount: 9 }" />
</template>

<script setup lang="ts">
import newsBannerData from "../data/newsBanner";
</script>

<style scoped></style>
