<template>
  <NewsBanner :news="newsBannerData" class="lg:pb-9"></NewsBanner>
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
       {{ $t('WeeklyOffers') }}
      </button>

      <button
        class="bg-mediumPink w-full text-white py-8 rounded-xl text-xl col-span-6 lg:block hidden"
      >
        {{ $t('PreOrders')}}
      </button>

      <div ref="imageDiv" class="bg-black text-white w-full col-span-12">
        <img
          src="../assets/img/HeroSingleCard.png"
          class="w-full h-full object-cover cursor-pointer"
        ></img>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import DestinoPaldea from '../../assets/img/DestinoPaldea.jpg';
import EvoluzioniPaldea from '../../assets/img/EvoluzioniPaldea.jpg';
import Ossidiana from '../../assets/img/Ossidiana.jpg';
import newsBannerData from '../data/newsBanner';


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


//import FirebaseCollection from "../service/firebase.collection";
//const fbcol = new FirebaseCollection();
//const result = await fbcol.readCollection("test");
//console.log(result);
</script>
