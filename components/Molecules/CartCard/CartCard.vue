<template>
  <!-- mobile -->
  <div v-show="isMobileview">
    <div class="flex flex-row items-top gap-4">
      <img :src="image" class="w-18" />
      <slot />
    </div>
    <div class="pt-4">
      <OrganismsQuantitySelect
        :price="price"
        :quantity="availableQuantity"
      />
    </div>
    <div class="pt-7 pb-5">
      <AtomsButtonCTA type="underline-text" text="Elimina dal carrello" />
    </div>
  </div>
  <!-- desktop -->
  <div class="flex gap-3" v-show="!isMobileview">
    <img :src="image" class="w-24" />

    <slot />
    <div>
      <div class="pt-4">
        <OrganismsQuantitySelect
          :price="price"
          :quantity="availableQuantity"
        />
      </div>
    </div>
    <!-- elimina dal carrello -->
    <Icon name="jig:close-accent" class="ml-6" size="20" @click=""></Icon>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["buttonClicked"]);
const isMobileview = isMobile();

defineProps({
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
