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
       {{ $t('WeeklyOffers') }}
      </button>

      <button
        class="bg-mediumPink w-full text-white py-8 rounded-xl text-xl col-span-6 lg:block hidden"
        aria-label="Preordini"
      >
        {{ $t('PreOrders')}}
      </button>

      <div ref="imageDiv" class="bg-black text-white w-full col-span-12">
        <img
          alt="Sfoglia le singole"
          src="../assets/img/HeroSingleCard.png"
          class="w-full h-full object-cover cursor-pointer"
        ></img>
      </div>
    </div>
  </div>
  <br>

  <Mancoliste 
    :set="{
      collectionID: ['pcol_01HYARCV4QD4YP9QF5WCK1985E'], 
      typeID: ['ptyp_01HYAS1R5WK6ZT5PYX6NXAGSEE']
    }"/>
  <Footer       
    :sections="sectionsData" 
    :footer="footerData"
  />


</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import DestinoPaldea from '../../assets/img/DestinoPaldea.jpg';
import EvoluzioniPaldea from '../../assets/img/EvoluzioniPaldea.jpg';
import Ossidiana from '../../assets/img/Ossidiana.jpg';
import newsBannerData from '../data/newsBanner';
import facebookLogo from '~/assets/icons/facebook.svg'
import instagramLogo from '~/assets/icons/instagram.svg'
import tiktokLogo from '~/assets/icons/tiktok.svg'
import youtubeLogo from '~/assets/icons/youtube.svg'

useHead({
  title: "Jigglycard",
  meta: [{
    name: 'Jigglycard',
    content: "Entra nel magico mondo Pokemon, carte singole, prodotti sealed, permuta collezioni..."
  }]
})

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

const sectionsData = [
  {
    title: "Section 1",
    sections: [
      { value: "Item 1", link: "#" },
      { value: "Item 2", link: "#" },
      { value: "Item 3", link: "#" }
    ]
  },
  {
    title: "Section 2",
    sections: [
      "Lorem ipsum dolor sit amet",
      "consectetur adipiscing elit",
      "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
    ]
  },
  {
    title: "Section 3",
    sections: [
      { value: "Item Link", link: "#" },
      "consectetur adipiscing elit",
      { value: "Item Link", link: "#" },
      "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
    ]
  },
  {
    title: "Section 4",
    sections: [
      { value: "Item Link", link: "#" },
      "consectetur adipiscing elit fvfvfvfv",
      { value: "Item Link", link: "#" },
      "sed do eiusmod tempor incididunt ut labore et dolore chi legge e scemo senza accento aliqua"
    ]
  },
];

const footerData = {
  text: ["Mock Footer 1", "Mock Footer 2"],
  imgs: [
    {
      img: facebookLogo,
      url: '/'
    },

    {
      img: instagramLogo,
      url: '/'
    },
    {
      img: youtubeLogo,
      url: '/'
    }]
};


// Qui sotto puoi inserire i tuoi commenti o il codice esistente

//import FirebaseCollection from "../service/firebase.collection";
//const fbcol = new FirebaseCollection();
//const result = await fbcol.readCollection("test");
//console.log(result);
</script>

