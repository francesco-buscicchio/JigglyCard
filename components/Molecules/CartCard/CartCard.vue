<template>
  <!-- mobile -->
  <div v-show="isMobileview">
    <div class="flex flex-row items-top gap-4">
      <img :src="image ?? defaultCardImage" class="w-18" />
      <slot />
    </div>
    <div class="pt-4">
      <OrganismsQuantitySelect
        :price="price"
        :quantity="availableQuantity"
        :selectedQuantity="quantity"
        @quantityChanged="quantityChange"
      />
    </div>
    <div class="pt-7">
      <AtomsButtonCTA type="underline-text" text="Elimina dal carrello" />
    </div>
  </div>
  <!-- desktop -->
  <div class="flex justify-between" v-show="!isMobileview">
    <div class="flex gap-3">
      <img :src="image ?? defaultCardImage" class="w-24" />

      <slot />
    </div>

    <div class="flex gap-13">
      <div>
        <OrganismsQuantitySelect
          :price="price"
          :quantity="availableQuantity"
          :selectedQuantity="quantity"
          @quantityChanged="quantityChange"
        />
      </div>
      <!-- elimina dal carrello -->
      <div class="flex flex-col justify-center">
        <Icon
          name="jig:close-accent"
          class="cursor-pointer"
          size="20"
          @click="removeVariant"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import defaultCardImage from "@/assets/img/default-card-image.png";
const emit = defineEmits(["removeVariantClicked", "quantityChanged"]);
const isMobileview = isMobile();

const quantity = computed(() => {
  return props.selectedQuantity;
});

function quantityChange(newQuantity: Number) {
  emit("quantityChanged", newQuantity);
}

const props = defineProps({
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

const removeVariant = () => {
  emit("removeVariantClicked");
};
</script>
