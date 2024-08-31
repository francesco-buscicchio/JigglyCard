<template>
  <div class="flex flex-col min-h-screen">
    <div class="flex-grow flex flex-col items-center space-y-4 mt-4">
      <div class="w-full flex items-center justify-center relative">
        <div>
          <h1 class="text-lightPink">JIGGLYCARD</h1>
        </div>
      </div>
      <h2>{{ prestoOnline }}</h2>
    </div>

    <div
      class="my-5 md:my-20 w-full flex flex-col md:flex-row justify-center items-center md:items-center md:space-x-4 space-y-4 md:space-y-0 md:flex-grow md:min-h-[50vh]">
      <StaticNewsLetter class="order-2 md:order-1 w-full md:w-1/3 md:px-10 mt-4 md:mt-none" />
      <div class="px-5 md:pr-20 order-1 md:order-2 w-full md:w-2/3">
        <img :src="Mainimg" alt="Main Image" class="w-full h-auto object-contain" />
      </div>
    </div>

    <OrganismsFooter :footer="footerData" :policyLinks="policyLinks" :hidePayments="true" :showInformationSite="true"
      class="mt-auto" />
  </div>
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
