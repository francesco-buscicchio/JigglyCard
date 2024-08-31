<template>
  <div class="flex flex-col items-center space-y-4 mt-4">
    <div class="w-full flex items-center justify-center relative">
      <div>
        <h1 class="text-lightPink">JIGGLYCARD</h1>
      </div>
    </div>
    <h2>{{ prestoOnline }}</h2>
  </div>

  <!-- Container for the newsletter and image -->
  <div
    class="md:my-20 main-content-container my-5 bottom-[10vh] s:bottom-[15vh] w-full flex flex-col s:flex-row justify-center items-center space-y-4 s:space-y-0 s:space-x-4">
    <StaticNewsLetter class="order-2 md:order-1 w-full s:w-1/2" />
    <img :src="Mainimg" alt="Main Image" class="order-1 md:order-2 w-full s:w-1/2" />
  </div>

  <OrganismsFooter :footer="footerData" :policyLinks="policyLinks" :hidePayments="true" :showInformationSite="true" />
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import facebookLogo from "~/assets/icons/facebook.svg";
import instagramLogo from "~/assets/icons/instagram.svg";
import youtubeLogo from "~/assets/icons/youtube.svg";
import tiktokLogo from "~/assets/icons/tiktok.png";
import Ossidiana from "~/assets/img/Ossidiana.jpg";

const Mainimg: string = Ossidiana;

const { t } = useI18n();
const prestoOnline = t("prestoOnline");

definePageMeta({
  layout: false,
});

const footerData = {
  imgs: [
    {
      img: instagramLogo,
      url: "https://www.instagram.com/jigglycard/",
    },
    {
      img: tiktokLogo,
      url: "https://www.tiktok.com/@jigglycard",
    },
    {
      img: facebookLogo,
      url: "#",
    },
    {
      img: youtubeLogo,
      url: "#",
    },
  ],
};

const policyLinks = [
  { label: t("privacy"), link: "/privacy-policy" },
  { label: t("cookies"), link: "/cookies" },
  { label: t("terminiDiUtilizzo"), link: "/terms-of-use" },
];
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
  .main-content-container {
    flex-direction: row;
    align-items: flex-start;
  }

  .mb-newsletter {
    bottom: 10vh;
  }
}
</style>
