<template>
  <div class="flex flex-col items-center space-y-4 mt-mid">
    <img
      src="~/assets/img/logo.png"
      alt="Logo"
      class="w-10 md:w-40 cursor-pointer"
    />
    <div class="w-full flex items-center justify-center relative">
      <img
        src="~/assets/gif/pokeball.gif"
        alt="Animated GIF"
        class="absolute left-0 w-22 md:w-100 cursor-pointer"
      />
      <div class="pt-8">
        <p class="text-lightPink text-3xl md:text-8xl">JIGGLYCARD</p>
      </div>
    </div>
    <h2>{{ prestoOnline }}</h2>
  </div>

  <div class="absolute mb-newsletter w-full">
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
  