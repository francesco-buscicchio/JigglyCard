<template>
  <div class="flex flex-col items-center space-y-4 mt-[10vh]">
    <div class="w-full flex items-center justify-center relative">
      <div class="pt-8">
        <h1 class="text-lightPink">JIGGLYCARD</h1>
      </div>
    </div>
    <h2>{{ prestoOnline }}</h2>
  </div>

  <div class="absolute bottom-[10vh] s:bottom-[15vh] w-full">
    <StaticNewsLetter />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const prestoOnline = t("prestoOnline");

definePageMeta({
  layout: false,
});
</script>

<style scoped>
.mt-mid {
  margin-top: 10vh;
}

.w-title {
  width: 10vh;
}

.mb-newsletter {
  bottom: 15vh;
}

@media screen and (min-width: 700px) {
  .mb-newsletter {
    bottom: 10vh;
  }
}
</style>