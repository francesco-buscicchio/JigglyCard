<template>
  <div>
    <div class="flex items-center gap-13 lg:gap-4 lg:flex-col">
      <div
        class="flex mr-6 items-center lg:flex-col lg:mr-0 justify-center lg:gap-1"
      >
        <p class="mr-6 lg:mr-0">{{ t("quantitySelect.quantity") }}:</p>
        <MoleculesPageSorter
          :sortingItems="quantityOptions"
          :selected="quantity"
          @handleSorting="updateQuantity"
          type="slim"
        />
      </div>

      <h2 class="mr-10 lg:mr-0 lg:text-2xl">{{ totalPrice }} €</h2>
    </div>

  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  quantity: number;
  price: number;
}>();

const quantity = ref(1);
const { t } = useI18n();
const quantityOptions = computed(() => {
  return Array.from({ length: props.quantity }, (_, i) => ({
    value: (i + 1).toString(),
    name: (i + 1).toString(),
  }));
});

const totalPrice = computed(() => (quantity.value * props.price).toFixed(2));

function updateQuantity(newQuantity: string) {
  quantity.value = Number(newQuantity);
}
</script>

<style scoped>
.price {
  font-family: "Roboto Flex";
  font-weight: 600;
}
</style>
