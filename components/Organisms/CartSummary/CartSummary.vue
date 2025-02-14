<template>
    <div class="p-4">
        <div class="border-b pb-2">
            <h5>{{ $t('recapCart') }}</h5>
        </div>

        <div v-for="(product, index) in products" :key="index" class="flex justify-between border-b py-2">
            <div>
                <p class="mb-1">{{ product.nameProduct }}</p>
                <p>{{ product.codeProduct }}</p>
            </div>
            <div class="text-right">
                <p>{{ formatPrice(product.price) }}</p>
            </div>
        </div>

        <div class="flex justify-between pt-2">
            <p>{{ $t('shipping') }}</p>
            <p>{{ formatPrice(shippingCost) }}</p>
        </div>

        <div class="flex justify-between pt-2 font-bold border-t mt-2">
            <p>{{ $t('total') }}</p>
            <p>{{ formatPrice(finalTotal) }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { number } from '@formkit/icons';
import { computed, defineProps } from 'vue';

interface Product {
    nameProduct: string;
    price: number;
    codeProduct: string;
}

const props = defineProps<{
    products: Product[];
    shippingCost: number;
}>();

const totalPrice = computed(() => {
    return props.products.reduce((sum, product) => sum + product.price, 0);
});

const finalTotal = computed(() => {
    return totalPrice.value + props.shippingCost;
});

function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(price);
}
</script>
