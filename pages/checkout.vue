<template>
  <div class="px-[4vw]">
    <MoleculesBreadcrumb />
    <h1 class="text-accent-500 text-center pb-4">Checkout</h1>
    <h4 class="py-4">{{ t("shippingInfo") }}</h4>

    <div class="lg:flex lg:gap-[10vw] lg:items-start">
      <OrganismsCheckoutForm
        @updateFormValues="updateFormData"
        class="lg:flex-1 mb-12 max-w-[650px]"
      />
      <OrganismsCartSummary
        :products="products"
        :shipping-cost="selectedShippingOption?.price || 0"
        v-show="!isMobileView"
      />
    </div>

    <div class="mb-12 lg:mb-18">
      <OrganismsSelectOptions
        :shippingOptions="SHIPPING_METHODS"
        :selectedOption="selectedShippingOption"
        @update:selectedOption="updateSelectedOption"
      />
    </div>

    <div class="mb-12 lg:mb-18" v-show="isMobileView">
      <OrganismsCartSummary
        :products="products"
        :shipping-cost="selectedShippingOption?.price || 0"
      />
    </div>

    <div class="mb-12 lg:mb-18" v-if="totalAmount > 0">
      <OrganismsCheckoutPayment
        :is-checkout-valid="isFormValid"
        :totalAmount="totalAmountWithShipment"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { SHIPPING_METHODS } from "~/data/const";

const isMobileView = isMobile();
const runtimeConfig = useRuntimeConfig();
const { t } = useI18n();

const cartConfig: CartConfig = {
  strapiBaseUrl: runtimeConfig.public.STRAPI_BASE_URL,
  fullAccessToken: runtimeConfig.public.FULL_ACCESS_TOKEN,
};
const formData = ref({});

const { products, totalCart } = useCart(cartConfig);

const totalAmount = computed(() => Number(totalCart.value) * 100);
const totalAmountWithShipment = computed(
  () => Number(totalCart.value) + selectedShippingOption.value?.price || 0
);

type formData = {
  name: string | null;
  surname: string | null;
  email: string | null;
  streetAndHouseNumber: string | null;
  city: string | null;
  cap: string | null;
  iWantTheInvoice: boolean;
};
const selectedShippingOption = ref(SHIPPING_METHODS[0]);

function updateFormData(data: formData) {
  formData.value = data;
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
</script>
