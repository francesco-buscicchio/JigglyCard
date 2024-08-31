<template>
  <div class="flex flex-col items-center space-y-4 mt-4">
    <div class="w-full flex items-center justify-center relative">
      <div>
        <h1 class="text-lightPink">JIGGLYCARD</h1>
      </div>
    </div>
    <h2>{{ prestoOnline }}</h2>
  </div>

  <img :src="Mainimg" alt="" class="my-2">

  <div class="my-5 bottom-[10vh] s:bottom-[15vh] w-full">
    <StaticNewsLetter />
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

const Mainimg: string = Ossidiana

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
  .mb-newsletter {
    bottom: 10vh;
  }
}
</style>