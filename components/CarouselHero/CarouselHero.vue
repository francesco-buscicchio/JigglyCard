<template>
  <div>
    <Swiper
      :modules="[EffectCube, Pagination]"
      effect="cube"
      :grab-cursor="true"
      :loop="true"
      :cube-effect="{
        shadow: true,
        slideShadows: true,
        shadowOffset: 20,
        shadowScale: 0.94,
      }"
      :pagination="true"
      class="w-full h-full"
    >
      <SwiperSlide v-for="photo in data" :key="photo.id" class="flex items-center justify-center">
        <div class="relative w-full h-full">
          <img :src="photo.image" alt="Immagine carosello" class="object-cover w-full h-full" />
          <a :href="photo.linkUrl" 
          class="absolute inset-0 w-[50vh] h-[10vh] bg-mediumPink text-white text-xl l:text-2xl flex items-center justify-center m-auto rounded-lg hover:bg-darkPink transition-colors duration-300"
          >
            {{ t("disponibileOra") }}          
          </a>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { EffectCube, Pagination } from "swiper/modules";

import "swiper/css/effect-cube";
import "swiper/css/pagination";
import "swiper/css";
const { t } = useI18n();

type CarouselHeroType = {
  id: number;
  image: string;
  linkUrl: string;
};

const props = defineProps<{ data: CarouselHeroType[] }>();
</script>

<style>
.swiper {
  width: 100%;
  height: 35vw;
  overflow: visible;
}

@media (max-width: 768px) {
  .swiper {
    height: 50vw;
  }
}

.swiper-pagination-bullet {
  width: 12px;
  height: 12px;
  background-color: #fff;
  opacity: 1;
}

.swiper-pagination-bullet-active {
  background-color: #fa737d;
}
</style>
