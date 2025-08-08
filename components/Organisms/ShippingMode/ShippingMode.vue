<template>
  <div class="mx-5 py-4">
    <h5>{{ t("shippingSection.shippingMethod") }}</h5>

    <div class="my-4">
      <AtomsRadioButton
        :value="{ id: 'standard-1' }"
        name="Standard-1"
        v-model="selectedOption"
      />
      <span class="ml-2 text-base">Standard 1€ </span>
      <p class="text-xs py-3">
        {{ t("shippingSection.message") }}
      </p>
    </div>

    <div class="border-t-[2px] border-neutral-200 py-4">
      <div class="flex justify-between" v-if="couponData.value > 0">
        <p>Coupon: {{ couponData.name }}</p>
        <p>-{{ couponData.value }} €</p>
      </div>
      <div v-if="couponData.value > 0">
        <AtomsButtonCTA
          type="underline-text"
          text="Rimuovi coupon"
          @click="removeCoupon"
        />
      </div>
      <div class="flex justify-between">
        <p class="">{{ t("shippingSection.total") }}</p>
        <p class="price-tag">{{ totalCart - couponData.value }} €</p>
      </div>
    </div>
    <!-- Codice promo -->
    <div class="mb-12">
      <p class="mb-2">{{ t("shippingSection.couponCodeQuestion") }}</p>
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
        :text="t('shippingSection.buyCTA')"
        @button-clicked="goTo(PATH.CHECKOUT)"
      />
      <AtomsButtonCTA
        type="underline-text"
        :text="t('shippingSection.goBackProducts')"
        @button-clicked="goBack"
      />
    </div>

    <div class="my-16">
      <MoleculesTextViewer>
        <template v-slot:title>
          {{ t("needAssistance") }}
        </template>
        <template v-slot:content>
          <!-- TODO mettere descrizione corretta -->
          {{ t("defaultDescription") }}
        </template>
      </MoleculesTextViewer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { goBack } from "@/utils/navigationUtils";
import { PATH } from "~/data/const";
import { goTo } from "@/utils/navigationUtils";
const { t } = useI18n();
import { type CartItem } from "~/service/CartService";

const props = defineProps<{
  cart: CartItem;
  totalCart: Number;
  couponData: Object;
}>();

const emit = defineEmits(["couponApplied", "removeCoupon"]);
const isDesktopView = isDesktop();
const couponCode = ref("");

const updateCouponCode = (event: string) => {
  couponCode.value = event;
};

const applyCoupon = () => {
  emit("couponApplied", couponCode.value);
};

const removeCoupon = () => {
  emit("removeCoupon");
};

const placeholder = computed(() => {
  return isDesktopView.value ? "XXXX" : t("shippingSection.couponCode");
});
const codeApply = computed(() => {
  return isDesktopView.value
    ? t("shippingSection.codeApplyWeb")
    : t("shippingSection.codeApply");
});

// TODO: rendere di default l'opzione standard
const selectedOption = ref({ id: "standard-1" });
</script>
