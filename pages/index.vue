<template>
  <NewsBanner :news="newsBannerData" class="pb-9"></NewsBanner>
  <HeaderMobile class="w-full lg:hidden" :header="{ cartCount: 9 }" />
  <HeaderDesktop class="hidden w-full lg:block" :header="{ cartCount: 9 }" />
  <div class="lg:flex flex-row pt-4 justify-between mx-8">
    <div class="lg:w-[75%] w-full">
      <CarouselHero :data="carouselData" />
    </div>
    <div
      class="lg:w-[20%] w-full lg:flex flex-col grid grid-cols-12 gap-6 lg:pt-0 pt-8"
    >
      <button
        class="bg-lightPink w-full text-white py-8 rounded-xl text-xl col-span-6 lg:block hidden"
      >
        Offerte settimanali
      </button>

      <button
        class="bg-mediumPink w-full text-white py-8 rounded-xl text-xl col-span-6 lg:block hidden"
      >
        Preordini
      </button>

      <div ref="imageDiv" class="bg-black text-white w-full col-span-12">
        <NuxtImg
          src="../public/img/HeroSingleCard.png"
          class="w-full h-full object-cover"
        ></NuxtImg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const carouselData = [
  {
    id: 0,
    image: "DestinoPaldea.jpg",
    linkUrl: "/",
  },
  {
    id: 1,
    image: "EvoluzioniPaldea.jpg",
    linkUrl: "/",
  },
  {
    id: 2,
    image: "Ossidiana.jpg",
    linkUrl: "/",
  },
];

const newsBannerData = [
  {
    label: "💸 CLICCA QUI PER VENDERE LA TUA COLLEZIONE 💸",
    url: "/card",
  },
  {
    label: "💲 CODICE WELCOMEJIGGLY PER AVERE UNO SCONTO DEL 10% 💲",
  },
];

const imageDiv = ref(null);

onMounted(() => {
  const parentHeight = imageDiv.value.parentElement.clientHeight; // Altezza del div contenitore
  let otherButtonsHeight = 0;
  imageDiv.value.parentElement
    .querySelectorAll('button:not([ref="ciaoButton"])')
    .forEach((button) => {
      otherButtonsHeight += button.clientHeight; // Somma altezze degli altri bottoni
    });
  const remainingHeight = parentHeight - otherButtonsHeight - 48;
  imageDiv.value.style.height = `${remainingHeight}px`; // Imposta l'altezza rimanente
});

// Qui sotto puoi inserire i tuoi commenti o il codice esistente
//import FirebaseCollection from "../service/firebase.collection";
//const fbcol = new FirebaseCollection();
//const result = await fbcol.readCollection("test");
//console.log(result);
</script>
