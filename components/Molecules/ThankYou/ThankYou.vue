<template>
  <div class="flex flex-col items-center justify-center p-5">
    <h1 class="text-accent-500">{{ t("thanks.main") }}</h1>
    <p class="pt-5">{{ t(`thanks.${props.type}`) }}</p>
    <img class="lg:w-103 w-62 pt-10" :src="thanksSrc" alt="Thank You" />
    <AtomsButtonCTA
      type="cart-drop"
      :text="t('thanks.backHome')"
      @button-clicked="navigateToHome()"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import thanksSrc from "@/assets/img/thanks.png";
import { PATH } from "~/data/const";

const { t } = useI18n();
const props = defineProps({
  type: {
    type: String,
    default: "order",
    validator: (value: string) => ["order", "newsletter"].includes(value),
  },
});

const navigateToHome = () => {
  navigateTo(PATH.HOME);
};
</script>

<style>
.link-to-home {
  font-family: "Roboto Flex";
  text-decoration: underline;
  cursor: pointer;
  font-size: 12px;
}
</style>
