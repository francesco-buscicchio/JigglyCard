<template>
  <div
    class="bg-accent-50 rounded-lg shadow-md overflow-hidden w-full min-h-80 max-h-80 flex flex-col justify-between p-4"
  >
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
      <AtomsButtonCTA type="primary" text="vedi dettagli" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
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
</script>
