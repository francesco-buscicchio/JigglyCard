<template>
  <div class="flex flex-row items-top gap-4">
    <img :src="image" class="w-18" />
    <div>
      <h5 class="pb-2">{{ title }}</h5>
      <p class="pb-2">{{ language }}</p>
      <p class="pb-2">{{ condition }}</p>
    </div>
  </div>
  <div class="pt-4">
    <OrganismsQuantitySelect
      :price="price"
      :quantity="avaibleQuantity"
      :isCart="true"
    />
  </div>
  <div class="pt-7 pb-5">
    <AtomsButtonCTA type="cart-drop" text="Elimina dal carrello" />
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["buttonClicked"]);

defineProps<{
  image: string;
  selectedQuantity: number;
  avaibleQuantity: number;
  price: number;
  title: string;
  language: string;
  condition: string;
}>();
</script>
