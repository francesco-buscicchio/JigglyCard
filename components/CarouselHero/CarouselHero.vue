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
    >
      <SwiperSlide v-for="photo in data" :key="photo.id">
        <NuxtImg
          :src="photo.image"
          alt="Immagine carosello"
          class="object-cover"
        />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { EffectCube, Pagination } from "swiper/modules";

import "swiper/css/effect-cube";
import "swiper/css/pagination";
import "swiper/css";

const swiper = useSwiper();

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

.swiper-slide img {
  width: 100%;
  height: 100%;
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
