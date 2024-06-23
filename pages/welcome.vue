<template>
  <div class="flex flex-col items-center space-y-4 mt-[10vh]">
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

  <div class="absolute bottom-[10vh] s:bottom-[15vh] w-full">
    <StaticNewsLetter />
  </div>
</template>
  
  <script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const api = "https://server.serverjigglycards.com/store/mailchimp/subscribe";

const test = fetch(api, {
  method: "POST",
  body: "testBuscicchio@gmail.com",
})
  .then((response) => response.json())
  .then(() => {
    alert("Subscribed successfully!");
  })
  .catch((e) => {
    console.error(e);
    alert("An error occurred");
  });

const prestoOnline = t("prestoOnline");

definePageMeta({
  layout: "",
});
</script>
  
<style scoped>
  .w-title {
    width: 1vh;
  }
</style>
  