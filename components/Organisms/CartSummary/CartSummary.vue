<template>
  <div
    class="lg:bg-accent-50 lg:rounded-lg lg:w-[30vw] lg:max-w-[420px] lg:p-6"
  >
    <div class="border-b pb-2">
      <h5>{{ t("cartSummary") }}</h5>
    </div>

    <div
      v-for="product in products"
      :key="product.id"
      class="flex justify-between border-b py-2 items-end"
    >
      <div>
        <p class="mb-1">{{ product.title }}</p>
        <p>{{ product.code }}</p>
      </div>
      <div class="text-right">
        <p>{{ product.price }} €</p>
      </div>
    </div>

    <div class="flex justify-between pt-2">
      <p>{{ t("shipping") }}</p>
      <p>{{ shippingCost }}</p>
    </div>

    <div class="flex justify-between pt-2 font-bold border-t mt-2">
      <p class="bold text-lg">{{ t("total") }}</p>
      <p class="bold text-lg">{{ finalTotal }} €</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, type PropType } from "vue";
import type { CartItem } from "~/service/CartService";

const { t } = useI18n();
const props = defineProps({
  products: {
    type: Array as PropType<CartItem[]>,
    required: true,
    validator: (value: CartItem[]) => {
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
  return (totalPrice.value + props.shippingCost).toFixed(2);
});

const shippingCost = computed(() => {
  return props.shippingCost > 0 ? `${props.shippingCost} €` : t("gratis");
});
</script>
