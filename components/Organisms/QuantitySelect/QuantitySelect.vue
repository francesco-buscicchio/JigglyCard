<template>
    <div>
        <div class="flex items-center justify-between">
            <div class="flex mr-6 items-center">
                <p class="mr-6">Quantità: </p>
                <MoleculesPageSorter :sortingItems="quantityOptions" :selected="quantity"
                    @handleSorting="updateQuantity" />
            </div>

            <h2 class="mr-18">{{ totalPrice }} €</h2>
        </div>

        <p class="my-2">Disponibilità: {{ quantity }} pezzi</p>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
    quantity: number;
    price: number;
}>();

const quantity = ref(1);

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
