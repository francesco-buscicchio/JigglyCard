<template>
  <div v-if="quantityOptions">
    <!-- mobile -->
    <div v-show="!isDesktopView">
      <div class="flex items-center gap-14">
        <div class="flex items-center">
          <p class="mr-6">{{ t("quantitySelect.quantity") }}:</p>
          <MoleculesPageSorter
            :sortingItems="quantityOptions"
            :selected="quantityRef"
            @handleSorting="updateQuantity"
          />
        </div>

        <h2 class="price-tag">{{ totalPrice }} €</h2>
      </div>
      <p class="my-2">
        {{ t("quantitySelect.availability") }}:
        {{ quantityOptions.length }}
        {{ t("quantitySelect.pieces") }}
      </p>

      <AtomsButtonCTA
        type="primary"
        :text="t('productHero.AddToCart')"
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
          <p>{{ t("quantitySelect.quantity") }}:</p>
          <p class="my-1 text-xs">
            ({{ t("quantitySelect.availability") }}:
            {{ quantityOptions.length }} {{ t("quantitySelect.pieces") }} )
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
          :text="t('productHero.AddToCart')"
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
import { CartService } from "~/service/CartService";
import type { Variant } from "~/types/variant.type";

const config = useRuntimeConfig();
const { t } = useI18n();

const isDesktopView = isDesktop();
const quantityRef = ref(1);
const props = defineProps<{
  variant: Variant;
}>();

const cartService = new CartService(
  config.public.STRAPI_BASE_URL,
  config.public.FULL_ACCESS_TOKEN
);

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

async function addToCart() {
  let cartExists = false;
  let sessionID = "";
  let cartID = "";

  if (localStorage.getItem("jiggly_cart_session_id")) {
    sessionID = localStorage.getItem("jiggly_cart_session_id") ?? "";
    cartID = localStorage.getItem("jiggly_cart_id") ?? "";
    cartExists = true;
  } else {
    sessionID = cartService.generateSessionId();
  }

  if (!cartExists) {
    const quantityData = [
      { variant: props.variant.documentId, quantity: quantityRef.value },
    ];
    const result = await cartService.createCart({
      session_id: sessionID,
      variants: [props.variant.documentId],
      quantity: JSON.stringify(quantityData),
    });
    localStorage.setItem("jiggly_cart_id", result.data.documentId);
    localStorage.setItem("jiggly_cart_session_id", sessionID);
  } else {
    const cart = await cartService.getCartById(cartID);
    if (cart) {
      const quantity = cart.data.quantity;
      const cartData = {
        variants: cart.data.variants,
        quantity: cart.data.quantity,
      };
      if (quantity.length) {
        const indexQuantity = quantity.findIndex((val: any) => {
          return val.variant === props.variant.documentId;
        });
        if (indexQuantity !== -1) {
          quantity[indexQuantity].quantity += quantityRef.value;
        } else {
          quantity.push({
            variant: props.variant.documentId,
            quantity: quantityRef.value,
          });
          cartData.variants.push(props.variant.documentId);
          cartData.quantity = JSON.stringify(quantity);
        }
      }
      cartService.updateCart(cart.data.documentId, cartData);
    }
  }
}
</script>
