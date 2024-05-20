<template>
  <div class="lg:flex flex-row pt-4 justify-between mx-8">
    <div class="lg:w-[75%] w-full">
      <CarouselHero :data="carouselData" />
    </div>
    <div
      class="lg:w-[20%] w-full lg:flex flex-col grid grid-cols-12 gap-6 lg:pt-0 pt-8"
    >
      <button
        class="bg-lightPink w-full text-white py-8 rounded-xl text-xl col-span-6 lg:block hidden"
        aria-label="Offerte Settimanali"
      >
        {{ $t("WeeklyOffers") }}
      </button>

      <button
        class="bg-mediumPink w-full text-white py-8 rounded-xl text-xl col-span-6 lg:block hidden"
        aria-label="Preordini"
      >
        {{ $t("PreOrders") }}
      </button>

      <div ref="imageDiv" class="bg-black text-white w-full col-span-12">
        <NuxtImg
          alt="Sfoglia le singole"
          src="/img/HeroSingleCard.png"
          class="w-full h-full object-cover cursor-pointer"
        ></NuxtImg>
      </div>
    </div>
  </div>
  <br />
  <Footer :sections="sectionsData" :footer="footerData" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

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
    image: "img/DestinoPaldea.jpg",
    linkUrl: "/",
  },
  {
    id: 1,
    image: "img/EvoluzioniPaldea.jpg",
    linkUrl: "/",
  },
  {
    id: 2,
    image: "img/Ossidiana.jpg",
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
      img: "icons/facebook.svg",
      url: "/",
    },

    {
      img: "icons/instagram.svg",
      url: "/",
    },
    {
      img: "icons/youtube.svg",
      url: "/",
    },
  ],
};

// Qui sotto puoi inserire i tuoi commenti o il codice esistente

//import FirebaseCollection from "../service/firebase.collection";
//const fbcol = new FirebaseCollection();
//const result = await fbcol.readCollection("test");
//console.log(result);
</script>
