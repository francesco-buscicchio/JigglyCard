<template>
    <MoleculesBreadcrumb />
    <h1 class="text-accent-500 text-center pb-4">Checkout</h1>
    <h4 class="py-4 ml-4">{{ $t('shippingInfo') }}</h4>

    <OrganismsCheckoutForm @updateFormValues="updateFormData" />
    <OrganismsSelectOptions :shipping-options="shippingOptions" @update:selectedOption="updateSelectedOption" />
    <OrganismsCartSummary :products="mockProducts" :shipping-cost="selectedShippingOption?.price || 0" />

    <!-- TODO da rivedere  -->
    <div class="mx-4 my-2">
        <AtomsButtonCTA @click="validateForm" class="text-white rounded">
            {{ $t('confirmAndPay') }}
        </AtomsButtonCTA>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const formData = ref({});
const shippingOptions = ref([
    { name: 'Opzione 1', price: 5 },
    { name: 'Opzione 2', price: 10 },
    { name: 'Opzione 3', price: 15 },
]);
const selectedShippingOption = ref(null);

function updateFormData(data) {
    formData.value = data;
}

function updateSelectedOption(option) {
    selectedShippingOption.value = option;
}

function validateForm() {
    //TODO:log utili solo per carello ecc.. da eliminare
    console.log('Form Data:', formData.value);
    console.log('Selected Shipping Option:', selectedShippingOption.value);

    const isFormValid = Object.values(formData.value).every(value => value !== null && value !== '');

    const isShippingSelected = selectedShippingOption.value !== null;

    if (isFormValid && isShippingSelected) {
        console.log('ok');
    } else {
        console.log('i campi obbligatori non sono stati compilati');
    }
}

definePageMeta({
    layout: 'default',
});

const mockProducts = ref([
    { nameProduct: 'Pikachu', price: 9.99, codeProduct: 'PK001' },
    { nameProduct: 'Charmander', price: 5.99, codeProduct: 'CH002' },
    { nameProduct: 'Bulbasaur', price: 8.99, codeProduct: 'BL003' },
]);
</script>
