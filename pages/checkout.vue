<template>
    <MoleculesBreadcrumb />
    <h1 class="text-accent-500 text-center pb-4">Checkout</h1>
    <h4 class="py-4 ml-4">{{ $t('shippingInfo') }}</h4>

    <OrganismsCheckoutForm @updateFormValues="updateFormData" />

    <button @click="logFormValues">Log Values</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const formData = ref({});

function updateFormData(data) {
    formData.value = data;
}

function logFormValues() {
    console.log('Form Data:', formData.value);
}

definePageMeta({
    layout: 'default',
});
</script>