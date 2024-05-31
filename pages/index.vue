<template>
  <!-- <PrivacyModal /> -->
  <!-- <Newsletter /> -->


  <div class="lg:flex flex-row pt-4 justify-between mx-8">
    <div class="w-full">
      <CarouselHero :data="carouselData" />
    </div>
  </div>
  <br />

  <!--
  <Mancoliste
    :set="{
      collectionID: ['pcol_01HYARCV4QD4YP9QF5WCK1985E'],
      typeID: ['ptyp_01HYAS1R5WK6ZT5PYX6NXAGSEE'],
    }"
  />
  -->
  <ServiceBanner :sections="sectionsDataService"/>
<br>
  <Footer :sections="sectionsData" :footer="footerData" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import DestinoPaldea from "../../assets/img/DestinoPaldea.jpg";
import EvoluzioniPaldea from "../../assets/img/EvoluzioniPaldea.jpg";
import Ossidiana from "../../assets/img/Ossidiana.jpg";
import facebookLogo from "~/assets/icons/facebook.svg";
import instagramLogo from "~/assets/icons/instagram.svg";
import youtubeLogo from "~/assets/icons/youtube.svg";

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

const sectionsDataService = [
  {
    title: "Section 1",
    sections: [
      { value: "Item 1", link: "#" },
      { value: "Item 2", link: "#" },
      { value: "Item 3", link: "#" },
    ],
    imgUrl: facebookLogo,
  },
  {
    title: "Section 2",
    sections: [
      "Lorem ipsum dolor sit amet",
      "consectetur adipiscing elit",
      "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    ],
    imgUrl: facebookLogo,
  },
  {
    title: "Section 3",
    sections: [
      { value: "Item Link", link: "#" },
      "consectetur adipiscing elit",
      { value: "Item Link", link: "#" },
      "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    ],
    imgUrl: facebookLogo,
  },
  {
    title: "Section 4",
    sections: [
      { value: "Item Link", link: "#" },
      "consectetur adipiscing elit fvfvfvfv",
      { value: "Item Link", link: "#" },
      "sed do eiusmod tempor incididunt ut labore et dolore chi legge e scemo senza accento aliqua",
    ],
    imgUrl: facebookLogo,
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
      img: facebookLogo,
      url: "/",
    },

    {
      img: instagramLogo,
      url: "/",
    },
    {
      img: youtubeLogo,
      url: "/",
    },
  ],
};
</script>

