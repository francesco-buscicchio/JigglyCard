<template>
    <div>
        <div class="flex items-center">
            <p>Quantità: {{ quantity }}</p>
            <MoleculesPageSorter :sortingItems="quantityOptions" :selected="quantity" @handleSorting="updateQuantity" />
            <h5>{{ totalPrice }} €</h5>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
    quantity: number;
    price: number;
}>();

const quantity = ref(props.quantity);

const quantityOptions = computed(() => {
    return Array.from({ length: props.quantity }, (_, i) => ({
        value: (i + 1).toString(),
        name: (i + 1).toString(),
    }));
});

const totalPrice = computed(() => quantity.value * props.price);

function updateQuantity(newQuantity: string) {
    quantity.value = Number(newQuantity);
}
</script>