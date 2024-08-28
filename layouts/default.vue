<template>
  <div class="w-full lg:hidden sticky-header">
    <OrganismsHeaderMobile
      class="w-full lg:hidden"
      :header="{ cartCount: 9 }"
    />
    <OrganismsHeaderDesktop
      class="hidden w-full lg:block"
      :header="{ cartCount: 9 }"
    />
  </div>
  <slot />

  <footer>
    <OrganismsFooter
      :sections="sectionsData"
      :footer="footerData"
      :policyLinks="policyLinks"
    />
  </footer>
</template>

<script setup lang="ts">
import facebookLogo from "~/assets/icons/facebook.svg";
import instagramLogo from "~/assets/icons/instagram.svg";
import youtubeLogo from "~/assets/icons/youtube.svg";
import tiktokLogo from "~/assets/icons/tiktok.png";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const sectionsData = [
  {
    title: "about",
    sections: [
      { value: "Item 1 con link", link: "#" },
      { value: "Item 2", link: "#" },
      { value: "Item 3", link: "#" },
    ],
  },
  {
    title: "spedizioni e rimborsi",
    sections: [
      "Lorem ipsum dolor sit amet",
      "consectetur adipiscing elit",
      "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    ],
  },
];

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
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1000; /* Ensure it stays on top of other content */
}
</style>
