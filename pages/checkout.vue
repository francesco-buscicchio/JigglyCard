<template>
  <div class="px-[4vw]">
    <MoleculesBreadcrumb />
    <h1 class="text-accent-500 text-center pb-4">{{ t("checkout.title") }}</h1>
    <h4 class="py-4">{{ t("checkout.shippingInfo") }}</h4>

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
        :shippingOptions="shippingOptions"
        :selectedOption="selectedShippingOption"
        @update:selectedOption="updateSelectedOption"
      />
    </div>

    <div
      v-if="stockIssues.length"
      class="mb-12 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm"
    >
      <p class="pb-2 font-semibold">{{ t("cart.stockChanged") }}</p>
      <ul class="list-disc pl-5">
        <li v-for="issue in stockIssues" :key="issue.variantId">
          {{ issue.variantId }} — {{ t("cart.stockRequested") }}
          {{ issue.requested }}, {{ t("cart.stockAvailable") }}
          {{ issue.available }}
        </li>
      </ul>
      <NuxtLink :to="PATH.CART" class="mt-3 inline-block underline">
        {{ t("cart.shipping.back") }}
      </NuxtLink>
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
        :userData="formData"
        :shippingOption="selectedShippingOption"
        @stockIssues="stockIssues = $event"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { PATH } from "~/data/const";
import type { CheckoutLineIssue } from "~/types/shop";

const { t } = useI18n();
const isMobileView = isMobile();
const { getShippingMethods } = useShop();

export type CheckoutFormData = {
  name: string;
  surname: string;
  email: string;
  cap: string;
  city: string;
  streetAndHouseNumber: string;
  iWantTheInvoice: boolean;
};

const formData = ref<CheckoutFormData | null>(null);
const isFormValid = ref(false);

function handleFormStatus(payload: {
  values: CheckoutFormData;
  isValid: boolean;
}) {
  formData.value = payload.values;
  isFormValid.value = payload.isValid;
}

// I metodi di spedizione arrivano dal CMS: unica fonte, condivisa con la
// pagina carrello, che prima usava una lista diversa da quella hardcoded qui.
const { items: shippingMethods } = await getShippingMethods();
const shippingOptions = shippingMethods.map((method) => ({
  id: method.id,
  label: method.name,
  price: method.priceCents / 100,
}));

const selectedShippingOption = ref(shippingOptions[0]);
const stockIssues = ref<CheckoutLineIssue[]>([]);

function updateSelectedOption(option: any) {
  selectedShippingOption.value = option;
}

const { products, totalCart } = useCart();

const totalAmount = computed(() => Number(totalCart.value) * 100);
const totalAmountWithShipment = computed(() => {
  return Number(totalCart.value) + (selectedShippingOption.value?.price || 0);
});

definePageMeta({
  layout: "default",
});
</script>
