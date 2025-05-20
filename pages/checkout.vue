<template>
  <div class="px-[4vw]">

  <MoleculesBreadcrumb />
  <h1 class="text-accent-500 text-center pb-4">Checkout</h1>
  <h4 class="py-4">{{ t("shippingInfo") }}</h4>

  <div class="lg:flex lg:gap-[10vw] lg:items-start">

    <OrganismsCheckoutForm @updateFormValues="updateFormData" class="lg:flex-1 mb-18 max-w-[650px]"/>
    <OrganismsCartSummary
      :products="mockProducts"
      :shipping-cost="selectedShippingOption?.price || 0"
      v-show="!isMobileView"
    />
  </div>

    <div class="my-6">
      <OrganismsSelectOptions
        :shipping-options="shippingOptions"
        @update:selectedOption="updateSelectedOption"
      />
    </div>

    <div class="my-6" v-show="isMobileView">
      <OrganismsCartSummary
        :products="mockProducts"
        :shipping-cost="selectedShippingOption?.price || 0"
      />
    </div>
    
    <div class="my-6">
      <OrganismsCheckoutPayment :is-checkout-valid="isFormValid" />
    </div>
 
</div>

</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Product } from "~/types/product.type";
const isMobileView = isMobile()
const { t } = useI18n();
const formData = ref({});
const shippingOptions = ref([
  { name: "Opzione 1", price: 5 },
  { name: "Opzione 2", price: 10 },
  { name: "Opzione 3", price: 15 },
]);
const selectedShippingOption = ref(null);

function updateFormData(data) {
  formData.value = data;
}

function updateSelectedOption(option) {
  selectedShippingOption.value = option;
}

const isFormValid = computed(() => {
  const allFieldsFilled = Object.values(formData.value).every(
    (value) => value !== null && value !== ""
  );
  const isShippingSelected = selectedShippingOption.value !== null;
  return allFieldsFilled && isShippingSelected;
});

function validateForm() {
  //TODO:log utili solo per carello ecc.. da eliminare
  console.log("Form Data:", formData.value);
  console.log("Selected Shipping Option:", selectedShippingOption.value);

  if (isFormValid.value) {
    console.log("ok");
  } else {
    console.log("i campi obbligatori non sono stati compilati");
  }
}

definePageMeta({
  layout: "default",
});

const mockProducts = ref<Product[]>([
  { nameProduct: "Pikachu", price: 9.99, codeProduct: "PK001", id: "1" },
  { nameProduct: "Charmander", price: 5.99, codeProduct: "CH002", id: "2" },
  { nameProduct: "Bulbasaur", price: 8.99, codeProduct: "BL003", id: "3" },
]);
</script>
