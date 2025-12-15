<template>
  <div class="mx-5 py-4">
    <h5>{{ t("cart.shipping.heading") }}</h5>

    <div class="my-4">
      <AtomsRadioButton
        :value="SHIPPING_METHOD_STANDARD"
        :id="SHIPPING_METHOD_STANDARD.id"
        name="shippingMethod"
        v-model="selectedOption"
        :label="SHIPPING_METHOD_STANDARD.label"
      />
      <p class="text-xs py-3">
        {{ t("cart.shipping.note") }}
      </p>
    </div>

    <div class="border-t-[2px] border-neutral-200 py-4">
      <div class="flex justify-between" v-if="couponData.value > 0">
        <p>{{ t("cart.shipping.couponLabel") }}: {{ couponData.name }}</p>
        <p>-{{ couponData.value }} €</p>
      </div>
      <div v-if="couponData.value > 0">
        <AtomsButtonCTA
          type="underline-text"
          :text="t('cart.shipping.removeCoupon')"
          @click="removeCoupon"
        />
      </div>
      <div class="flex justify-between">
        <p class="">{{ t("cart.shipping.total") }}</p>
        <p class="price-tag">{{ total }} €</p>
      </div>
    </div>
    <!-- Codice promo -->
    <div class="mb-12">
      <p class="mb-2">{{ t("cart.shipping.couponQuestion") }}</p>
      <div class="lg:flex w-full lg:gap-3 lg:items-top lg:justify-center">
        <div class="mb-2 lg:mb-0 flex-1">
          <MoleculesContainerInput
            :status="couponData.error === '' ? 'newsletter' : 'error'"
            :placeholder="placeholder"
            @inputUpdate="updateCouponCode($event)"
            :notValidMessage="couponData.error"
            :isValid="couponData.error === ''"
          />
        </div>
        <div class="lg:max-w-22">
          <AtomsButtonCTA
            type="secondary"
            :text="codeApply"
            @click="applyCoupon()"
          />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-y-4">
      <AtomsButtonCTA
        type="primary"
        :text="t('cart.shipping.buyCta')"
        @button-clicked="goTo(PATH.CHECKOUT)"
      />
      <AtomsButtonCTA
        type="underline-text"
        :text="t('cart.shipping.back')"
        @button-clicked="goBack"
      />
    </div>

    <div class="my-16">
      <MoleculesTextViewer>
        <template v-slot:title>
          {{ t("cart.help.title") }}
        </template>
        <template v-slot:content>
          <!-- TODO mettere descrizione corretta -->
          {{ t("product.messages.defaultDescription") }}
        </template>
      </MoleculesTextViewer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { goBack } from "@/utils/navigationUtils";
import { SHIPPING_METHOD_STANDARD, PATH } from "~/data/const";
import { goTo } from "@/utils/navigationUtils";
const { t } = useI18n();
import { type CartItem } from "~/service/CartService";

const props = defineProps<{
  cart: CartItem;
  totalCart: Number;
  couponData: any;
}>();

const emit = defineEmits(["couponApplied", "removeCoupon"]);
const isDesktopView = isDesktop();
const couponCode = ref("");

const updateCouponCode = (event: string) => {
  couponCode.value = event;
};

const total = computed(() => {
  return (Number(props.totalCart) - Number(props.couponData.value)).toFixed(2);
});

const applyCoupon = () => {
  emit("couponApplied", couponCode.value);
};

const removeCoupon = () => {
  emit("removeCoupon");
};

const placeholder = computed(() => {
  return isDesktopView.value ? "XXXX" : t("cart.shipping.couponPlaceholder");
});
const codeApply = computed(() => {
  return isDesktopView.value
    ? t("cart.shipping.applyDesktop")
    : t("cart.shipping.apply");
});

// TODO: rendere di default l'opzione standard
const selectedOption = ref(SHIPPING_METHOD_STANDARD);
</script>
