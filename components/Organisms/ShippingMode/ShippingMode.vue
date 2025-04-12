<template>
  <div class="mx-5 border-t-[2px] border-neutral-200 py-4">
    <h5>{{ t("shippingMode.shippingMethod") }}</h5>

    <div class="my-4">
      <AtomsRadioButton
        :value="{ id: 'standard-1' }"
        name="Standard-1"
        v-model="selectedOption"
      />
      <span class="ml-2 text-base">Standard 1€ </span>
      <p class="text-xs py-3">
        {{ t("shippingMode.message") }}
      </p>
    </div>

    <div class="flex justify-between border-t-[2px] border-neutral-200 py-4">
      <p class="">{{ t("shippingMode.total") }}</p>
      <p class="price-tag">{{ totalCart }} €</p>
    </div>
    <!-- Codice promo -->
    <div class="mb-12">
      <p class="mb-2">{{ t("shippingMode.couponCodeQuestion") }}</p>
      <div class="lg:flex w-full">
        <div class="mb-2">
          <AtomsInputText :placeholder="placeholder" />
        </div>
        <div class="lg:max-w-22">
          <AtomsButtonCTA
            type="secondary"
            :text="t('shippingMode.codeApply')"
          />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-y-4">
      <AtomsButtonCTA type="primary" :text="t('shippingMode.buyCTA')" />
      <AtomsButtonCTA
        type="underline-text"
        :text="t('shippingMode.goBackProducts')"
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

const { t } = useI18n();
const isDesktopView = isDesktop();
const placeholder = computed(() => {
  return isDesktopView.value ? "XXXX" : t("shippingMode.couponCode");
});
// TODO: rendere di default l'opzione standard
const selectedOption = ref({ id: "standard-1" });
</script>
