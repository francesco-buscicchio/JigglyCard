<template>
  <div class="mx-5 py-4">
    <h5>{{ t("shippingSection.shippingMethod") }}</h5>

    <div class="my-4">
      <AtomsRadioButton
        :value="SHIPPING_METHOD_STANDARD"
        :id="SHIPPING_METHOD_STANDARD.id"
        name="shippingMethod"
        v-model="selectedOption"
        :label="SHIPPING_METHOD_STANDARD.label"
      />
      <p class="text-xs py-3">
        {{ t("shippingSection.message") }}
      </p>
    </div>

    <div class="flex justify-between border-t-[2px] border-neutral-200 py-4">
      <p class="">{{ t("shippingSection.total") }}</p>
      <p class="price-tag">{{ totalCart }} €</p>
    </div>
    <!-- Codice promo -->
    <div class="mb-12">
      <p class="mb-2">{{ t("shippingSection.couponCodeQuestion") }}</p>
      <div class="lg:flex w-full lg:gap-3 lg:items-center lg:justify-center">
        <div class="mb-2 lg:mb-0 flex-1">
          <AtomsInputText :placeholder="placeholder" status="newsletter" />
        </div>
        <div class="lg:max-w-22">
          <AtomsButtonCTA type="secondary" :text="codeApply" />
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
const props = defineProps({
  totalCart: {
    type: String,
    required: true,
  },
});
import { useI18n } from "vue-i18n";
import { goBack } from "@/utils/navigationUtils";
import { SHIPPING_METHOD_STANDARD, PATH } from "~/data/const";
import { goTo } from "@/utils/navigationUtils";
const { t } = useI18n();
const isDesktopView = isDesktop();
const placeholder = computed(() => {
  return isDesktopView.value ? "XXXX" : t("shippingSection.couponCode");
});
const codeApply = computed(() => {
  return isDesktopView.value
    ? t("shippingSection.codeApplyWeb")
    : t("shippingSection.codeApply");
});
// TODO: rendere di default l'opzione standard
const selectedOption = ref(SHIPPING_METHOD_STANDARD);
</script>
