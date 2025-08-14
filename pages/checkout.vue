<template>
  <div class="px-[4vw]">
    <MoleculesBreadcrumb />
    <h1 class="text-accent-500 text-center pb-4">Checkout</h1>
    <h4 class="py-4">{{ t("shippingInfo") }}</h4>

    <div class="lg:flex lg:gap-[10vw] lg:items-start">
      <OrganismsCheckoutForm
        @updateFormStatus="handleFormStatus"
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

const { t } = useI18n();
const isMobileView = isMobile();
const runtimeConfig = useRuntimeConfig();

type FormData = {
  name: string;
  surname: string;
  email: string;
  cap: string;
  city: string;
  streetAndHouseNumber: string;
  iWantTheInvoice: boolean;
};

const formData = ref<FormData | null>(null);
const isFormValid = ref(false);

function handleFormStatus(payload: { values: FormData; isValid: boolean }) {
  formData.value = payload.values;
  isFormValid.value = payload.isValid;
}

const selectedShippingOption = ref(SHIPPING_METHODS[0]);
function updateSelectedOption(option) {
  selectedShippingOption.value = option;
}

const cartConfig: CartConfig = {
  strapiBaseUrl: runtimeConfig.public.STRAPI_BASE_URL,
  fullAccessToken: runtimeConfig.public.FULL_ACCESS_TOKEN,
};

const { products, totalCart } = useCart(cartConfig);

const totalAmount = computed(() => Number(totalCart.value) * 100);
const totalAmountWithShipment = computed(() => {
  return Number(totalCart.value) + (selectedShippingOption.value?.price || 0);
});

definePageMeta({
  layout: "default",
});
</script>
