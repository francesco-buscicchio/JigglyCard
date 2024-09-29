<template>
  <swiper ref="swiperRef" :grab-cursor="true" :space-between="50" @swiper="setControlledSwiper"
    @slideChange="onSlideChange">
    <swiper-slide v-for="(slide, index) in slides">
      <div
        class="relative bg-cover bg-center h-[300px] md:h-[500px] cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105"
        :style="{ backgroundImage: `url(${slide.imageUrl})` }" @click="navigateToListing(slide.navigateTo)" role="img">
      </div>
    </swiper-slide>
  </swiper>

  <MoleculesCardCarousel :items="slides" @update:index="updateIndex" :activeIndex="currentIndex" />

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
const currentIndex = ref(0);
const controlledSwiper = ref(null);

const navigateToListing = (route) => {
  router.push(route);
};

function updateIndex(index) {
  currentIndex.value = index;
  //@ts-ignore
  controlledSwiper.value.slideTo(index);
}

const setControlledSwiper = (swiper) => {
  controlledSwiper.value = swiper;
};

const onSlideChange = () => {
  if (controlledSwiper.value) {
    //@ts-ignore
    currentIndex.value = controlledSwiper.value.activeIndex;
  }
};
</script>

<style scoped>
.mySwiper {
  width: 100%;
  height: 100%;
}
</style>
