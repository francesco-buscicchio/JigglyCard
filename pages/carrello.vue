<template>
  <div class="gap-b-4 flex flex-col px-4">
    <MoleculesBreadcrumb />
  </div>
  <h1 class="text-accent-500 text-center pb-8">{{ $t("cart") }}</h1>
  <div
    v-for="(item, index) of products"
    :key="index"
    class="border-t-[2px] border-neutral-200 mx-5 pt-4 pb-2"
  >
    <MoleculesCartCard
      :image="item.image"
      :selectedQuantity="item.selectedQuantity"
      :avaibleQuantity="item.avaibleQuantity"
      :price="item.price"
      :title="item.title"
      :language="item.language"
      :condition="item.condition"
    />
  </div>
</template>



<script lang="ts" setup>
import blastoise from "~/assets/blastoise_ex_mew_009.png";

const products = [
  {
    image: blastoise,
    selectedQuantity: 1,
    avaibleQuantity: 4,
    price: 8,
    title: "Blastoise ex (MEW 009)",
    language: "Italiano",
    condition: "Near Mint",
  },
  {
    image: blastoise,
    selectedQuantity: 1,
    avaibleQuantity: 4,
    price: 8,
    title: "Blastoise ex (MEW 009)",
    language: "Italiano",
    condition: "Near Mint",
  },
  {
    image: blastoise,
    selectedQuantity: 1,
    avaibleQuantity: 4,
    price: 8,
    title: "Blastoise ex (MEW 009)",
    language: "Italiano",
    condition: "Near Mint",
  },
  {
    image: blastoise,
    selectedQuantity: 1,
    avaibleQuantity: 4,
    price: 8,
    title: "Blastoise ex (MEW 009)",
    language: "Italiano",
    condition: "Near Mint",
  },
];
</script>