<template>
  <MoleculesToastMessage
    :text="toastData.message"
    :type="toastData.type"
    :trigger-key="toastKey"
  />
  <div v-if="quantityOptions">
    <!-- mobile -->
    <div v-show="!isDesktopView">
      <div class="flex items-center gap-14">
        <div class="flex items-center">
          <p class="mr-6">{{ t("product.quantity.quantity") }}:</p>
          <MoleculesPageSorter
            :sortingItems="quantityOptions"
            :selected="quantityRef"
            @handleSorting="updateQuantity"
          />
        </div>

        <h2 class="price-tag">{{ totalPrice }} €</h2>
      </div>
      <p class="my-2">
        {{ t("product.quantity.availability") }}:
        {{ quantityOptions.length }}
        {{ t("product.quantity.pieces") }}
      </p>

      <AtomsButtonCTA
        type="primary"
        :text="t('product.hero.AddToCart')"
        class="max-w-[30rem] mt-12"
        @click="addToCart"
      >
        <Icon name="jig:cart-white" size="30"></Icon>
      </AtomsButtonCTA>
    </div>

    <!-- desktop -->
    <div v-show="isDesktopView">
      <div class="flex mr-6 my-7 items-center gap-7">
        <div class="">
          <p>{{ t("product.quantity.quantity") }}:</p>
          <p class="my-1 text-xs">
            ({{ t("product.quantity.availability") }}:
            {{ quantityOptions.length }} {{ t("product.quantity.pieces") }} )
          </p>
        </div>
        <MoleculesPageSorter
          :sortingItems="quantityOptions"
          :selected="quantityRef"
          @handleSorting="updateQuantity"
        />
      </div>

      <div class="flex gap-16 mt-10 items-center">
        <h2 class="whitespace-nowrap price-tag text-3xl">{{ totalPrice }} €</h2>
        <AtomsButtonCTA
          type="primary"
          :text="t('product.hero.AddToCart')"
          class="max-w-[30rem]"
          @click="addToCart()"
        >
          <Icon name="jig:cart-white" size="30"></Icon>
        </AtomsButtonCTA>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "~/stores/cart";
import { ToastMessageType } from "~/types/toastMessage.type";
import type { ProductType } from "~/types/productType.type";
import type { Variant } from "~/types/variant.type";

const { t } = useI18n();
const cart = useCartStore();

const isDesktopView = isDesktop();
const quantityRef = ref(1);
const toastKey = ref(0);
const props = defineProps<{
  variant: Variant;
  product: ProductType;
}>();
const toastData = {
  message: "",
  type: "",
};

const quantityOptions = computed(() => {
  if (!props.variant) return null;
  return Array.from({ length: props.variant.quantity }, (_, i) => ({
    value: (i + 1).toString(),
    name: (i + 1).toString(),
  }));
});

const totalPrice = computed(() => {
  if (!props.variant) return null;
  return (quantityRef.value * props.variant.price).toFixed(2);
});

function updateQuantity(newQuantity: string) {
  quantityRef.value = Number(newQuantity);
}

function addToCart() {
  if (!props.variant || !props.product) return;

  cart.addLine(
    {
      variantId: props.variant.id,
      blueprintId: props.product.blueprintId ?? 0,
      productSlug: props.product.id,
      name: props.product.productName,
      imageUrl: props.product.imageUrl,
      language: props.variant.language,
      condition: props.variant.condition,
      // Lo store lavora in centesimi: il prezzo della variante è in euro.
      priceCents: Math.round(props.variant.price * 100),
      availableQuantity: props.variant.quantity,
    },
    quantityRef.value,
  );

  toastData.message = t("toast.cart.success");
  toastData.type = ToastMessageType.SUCCESS;
  toastKey.value++;
}
</script>
