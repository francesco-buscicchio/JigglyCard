<template>
  <div class="bg-white rounded-lg shadowCard overflow-hidden w-full">
    <div class="p-4 bg-accent-50">
      <h5>{{ productName }}</h5>
      <div class="flex mt-2">
        <img
          :src="imageUrl"
          :alt="productName"
          class="w-28 h-38 object-cover mr-4"
        />
        <div class="flex flex-col gap-y-2">
          <p>{{ code }}</p>
          <p>{{ expansion }}</p>
          <label>{{ $t("startingFrom") }}</label>
          <p class="text-2xl font-bold">{{ price }} €</p>
        </div>
      </div>
      <div class="pt-4 w-full">
        <AtomsButtonCTA type="primary" text="vedi dettagli" />
      </div>
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
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.shadowCard {
  box-shadow: 0 4px 6px -1px rgba(129, 23, 40, 0.3),
    0 2px 4px -2px rgba(129, 23, 40, 0.3);
}
</style>
