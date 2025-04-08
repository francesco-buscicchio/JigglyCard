<template>
  <div class="p-4">
    <div class="border-b pb-2">
      <h5>{{ $t("recapCart") }}</h5>
    </div>

    <div
      v-for="product in products"
      :key="product.id"
      class="flex justify-between border-b py-2 items-end"
    >
      <div>
        <p class="mb-1">{{ product.nameProduct }}</p>
        <p>{{ product.codeProduct }}</p>
      </div>
      <div class="text-right">
        <p>{{ product.price }} €</p>
      </div>
    </div>

    <div class="flex justify-between pt-2">
      <p>{{ $t("shipping") }}</p>
      <p>{{ shippingCost }}</p>
    </div>

    <div class="flex justify-between pt-2 font-bold border-t mt-2">
      <p class="bold text-lg">{{ $t("total") }}</p>
      <p class="bold text-lg">{{ finalTotal }} €</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, type PropType } from "vue";
import type { Product } from "~/types/product.type";
const { t } = useI18n();
const props = defineProps({
  products: {
    type: Array as PropType<Product[]>,
    required: true,
    validator: (value: Product[]) => {
      return Array.isArray(value);
    },
  },
  shippingCost: {
    type: Number,
    required: true,
    validator: (value: number) => {
      return value >= 0;
    },
  },
});

const totalPrice = computed(() => {
  return props.products.reduce((sum, product) => sum + product.price, 0);
});

const finalTotal = computed(() => {
  return totalPrice.value + props.shippingCost;
});

const shippingCost = computed(() => {
  return props.shippingCost > 0 ? `${props.shippingCost} €` : t("gratis");
});
</script>
