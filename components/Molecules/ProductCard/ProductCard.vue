<template>
  <div :class="containerClass">
    <h5>{{ productName }}</h5>
    <div class="flex">
      <img
        :src="imageUrl"
        :alt="productName"
        class="max-h-38 object-cover mr-4"
      />
      <div class="flex flex-col gap-y-2">
        <p>{{ code }}</p>
        <p>{{ expansion }}</p>
        <label>{{ $t("startingFrom") }}</label>
        <p class="text-2xl font-bold">{{ price }} €</p>
      </div>
    </div>
    <div class="w-full">
      <AtomsButtonCTA
        :type="buttonCtaType"
        :text="$t('showDetails')"
        v-on:button-clicked="navigateTo(`/${tcg}/${category}/${id}`)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";

const props = defineProps({
  colorScheme: {
    type: String,
  },
  id: {
    type: String,
  },
  tcg: {
    type: String,
  },
  category: {
    type: String,
  },
  productName: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  expansion: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

const containerClass = computed(() => {
  switch (props.colorScheme) {
    case "primaryHome":
      return "bg-accent-500 text-white border-white border-[1px] mx-4 min-h-80 max-h-80 flex flex-col justify-between p-4 rounded-lg";
    case "lightHome":
      return "bg-white text-neutrals-950 border-[1px] mx-4 border-accent-950 min-h-80 max-h-80 flex flex-col justify-between p-4  rounded-lg";
    case "noBorder":
      return "bg-white text-neutrals-950 mx-4 min-h-80 max-h-80 flex flex-col justify-between p-4";
    default:
      return "rounded-lg shadow-md overflow-hidden w-full min-h-80 max-h-80 flex flex-col justify-between p-4";
  }
});

const buttonCtaType = computed(() => {
  switch (props.colorScheme) {
    case "primaryHome":
      return "secondary";
    case "lightHome":
      return "primary";
    default:
      return "primary";
  }
});
</script>
