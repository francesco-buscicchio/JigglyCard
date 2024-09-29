<template>
  <swiper :modules="[Navigation, Pagination]" pagination>
    <swiper-slide v-for="(slide, index) in slides" :key="index">
      <div
        class="relative bg-cover bg-center h-[300px] md:h-[500px] cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105"
        :style="{ backgroundImage: `url(${slide.imageUrl})` }" @click="navigateToListing(slide.navigateTo)" role="img">
        <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 class="text-white text-3xl md:text-5xl font-bold text-center">
            {{ slide.productName }}
          </h1>
        </div>
      </div>
    </swiper-slide>
  </swiper>
</template>

<script setup>
import { useRouter } from "vue-router";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
import { Navigation, Pagination } from "swiper/modules";

const props = defineProps({
  slides: {
    type: Array,
    required: true,
    default: () => []
  }
});

const router = useRouter();

const navigateToListing = (route) => {
  router.push(route);
};
</script>

<style scoped>
.mySwiper {
  width: 100%;
  height: 100%;
}
</style>
