<template>
  <div class="flex flex-row items-top gap-4">
    <img :src="image" class="w-18" :alt="alt" />
    <slot />
  </div>
  <div class="pt-4">
    <OrganismsQuantitySelect
      :price="price"
      :quantity="availableQuantity"
      :isCart="true"
    />
  </div>
  <div class="pt-7 pb-5">
    <AtomsButtonCTA type="cart-drop" text="Elimina dal carrello" />
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["buttonClicked"]);

defineProps({
  alt: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  selectedQuantity: {
    type: Number,
    default: 1,
  },
  availableQuantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});
</script>
