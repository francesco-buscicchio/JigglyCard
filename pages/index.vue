<template>
  <PrivacyModal />
  <Newsletter />

  <div class="lg:flex flex-row pt-4 justify-between mx-8">
    <div class="w-full">
      <CarouselHero :data="carouselData" />
    </div>
  </div>
  <br />

  <!--Esempio utilizzo bottoni
  <div class="flex flex-row gap-x-4">
    <AtomsButtonCTA type="primary" text="Primary Button"></AtomsButtonCTA>
    <AtomsButtonCTA type="secondary" text="Secondary Button"></AtomsButtonCTA>
    <AtomsButtonCTA type="disabled" text="Disabled Button">
      <Icon name="jig:heart"></Icon>
    </AtomsButtonCTA>
  </div>

  -->

  <Mancoliste
    :set="{
      collectionID: ['pcol_01HZYF8VMVVYG8N1F5H6S6D670'],
      typeID: [],
    }"
  />
  <ServiceBanner :sections="sectionsDataService" />
  <br />
  <h3 class="p-6">Prodotto in evidenza</h3>
  <div class="pb-6">
    <ProductHero />
  </div>

  <Footer :sections="sectionsData" :footer="footerData" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import DestinoPaldea from "../../assets/img/DestinoPaldea.jpg";
import EvoluzioniPaldea from "../../assets/img/EvoluzioniPaldea.jpg";
import Ossidiana from "../../assets/img/Ossidiana.jpg";
import facebookLogo from "~/assets/icons/facebook.svg";
import instagramLogo from "~/assets/icons/instagram.svg";
import youtubeLogo from "~/assets/icons/youtube.svg";
import tiktokLogo from "~/assets/icons/tiktok.png";
const { t } = useI18n();

useHead({
  title: "Jigglycard",
  meta: [
    {
      name: "Jigglycard",
      content:
        "Entra nel magico mondo Pokemon, carte singole, prodotti sealed, permuta collezioni...",
    },
  ],
});
const carouselData = [
  {
    id: 0,
    image: DestinoPaldea,
    linkUrl: "/",
  },
  {
    id: 1,
    image: EvoluzioniPaldea,
    linkUrl: "/",
  },
  {
    id: 2,
    image: Ossidiana,
    linkUrl: "/",
  },
];

const imageDiv = ref(null);

onMounted(() => {
  nextTick(() => {
    const parentHeight = imageDiv.value.parentElement.clientHeight;
    let otherButtonsHeight = 0;
    imageDiv.value.parentElement
      .querySelectorAll('button:not([ref="ciaoButton"])')
      .forEach((button) => {
        otherButtonsHeight += button.clientHeight;
      });
    const remainingHeight = parentHeight - otherButtonsHeight - 48;
    imageDiv.value.style.height = `${remainingHeight}px`;
  });
});

const sectionsDataService = [
  {
    title: t("serviceHomepage.FastShipping"),
    sections: [{ value: t("serviceHomepage.FastShippingDescription") }],
    imgUrl: "material-symbols:local-shipping",
  },
  {
    title: t("serviceHomepage.Support"),
    sections: [t("serviceHomepage.SupportDescription")],
    imgUrl: "material-symbols:support-agent-sharp",
  },
  {
    title: t("serviceHomepage.Prices"),
    sections: [t("serviceHomepage.PricesDescription")],
    imgUrl: "solar:tag-price-bold-duotone",
  },
  {
    title: t("serviceHomepage.Security"),
    sections: [t("serviceHomepage.SecurityDescription")],
    imgUrl: "solar:tag-price-bold-duotone",
  },
];

const sectionsData = [
  {
    title: "Section 1",
    sections: [
      { value: "Item 1", link: "#" },
      { value: "Item 2", link: "#" },
      { value: "Item 3", link: "#" },
    ],
  },
  {
    title: "Section 2",
    sections: [
      "Lorem ipsum dolor sit amet",
      "consectetur adipiscing elit",
      "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    ],
  },
  {
    title: "Section 3",
    sections: [
      { value: "Item Link", link: "#" },
      "consectetur adipiscing elit",
      { value: "Item Link", link: "#" },
      "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    ],
  },
  {
    title: "Section 4",
    sections: [
      { value: "Item Link", link: "#" },
      "consectetur adipiscing elit fvfvfvfv",
      { value: "Item Link", link: "#" },
      "sed do eiusmod tempor incididunt ut labore et dolore chi legge e scemo senza accento aliqua",
    ],
  },
];

const footerData = {
  text: ["Mock Footer 1", "Mock Footer 2"],
  imgs: [
    {
      img: instagramLogo,
      url: "https://www.instagram.com/jigglycard/",
    },
    {
      img: tiktokLogo,
      url: "https://www.tiktok.com/@jigglycard",
    },
  ],
};
</script>
