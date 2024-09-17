<template>
  <div
    :class="{ 'fixed-header': !isMenuOpen, 'overlay-header': isMenuOpen }"
    class="lg:hidden"
  >
    <OrganismsHeaderMobile
      class="w-full"
      :header="{ cartCount: 9 }"
      :isMenuOpen="isMenuOpen"
      @toggle-menu="toggleMenu"
    />
  </div>

  <div class="hidden w-full lg:block sticky-header">
    <OrganismsHeaderDesktop class="w-full" :header="{ cartCount: 9 }" />
  </div>
  <slot />

  <footer>
    <OrganismsPreFooter />
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

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

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
.fixed-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
}

.overlay-header {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh; /* Copre l'intera altezza dello schermo */
  width: 100%; /* Copre tutta la larghezza */
  background-color: rgba(
    0,
    0,
    0,
    0.8
  ); /* Sfondo semitrasparente per l'effetto overlay */
  z-index: 1050; /* Più alto per stare sopra tutto */
}
</style>
