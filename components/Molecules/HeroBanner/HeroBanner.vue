<template>
  <swiper ref="swiperRef" :grab-cursor="true" :space-between="50" @swiper="setControlledSwiper"
    @slideChange="onSlideChange">
    <swiper-slide v-for="(slide, index) in slides">
      <!-- TODO: calcolare link di navigazione -->
      <div
      class="relative bg-cover bg-center h-75 md:h-125 cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105"
        :style="{ backgroundImage: `url(${slide.imageUrl})` }" @click="navigateToListing(slide.navigateTo)" role="img">
      </div>
    </swiper-slide>
  </swiper>›

  <MoleculesCardCarousel :items="slides" @update:index="updateIndex" :activeIndex="currentIndex" />

</template>

<script lang="ts" setup>
import { useRouter, type RouteLocation } from "vue-router";
import "swiper/swiper-bundle.css";
import type { PropType } from "vue";
import type { ProductType } from "~/components/Organisms/ProductCarousel/ProductCarousel.vue";

const props = defineProps({
  slides: {
    type: Array as PropType<ProductType[]>,
    required: true,
    default: () => []
  }
});

const router = useRouter();
const currentIndex = ref(0);
const controlledSwiper = ref();

const navigateToListing = (route:RouteLocation) => {
  router.push(route);
};

function updateIndex(index:number) {
  currentIndex.value = index;
  controlledSwiper.value.slideTo(index);
}

const setControlledSwiper = (swiper:any) => {
  controlledSwiper.value = swiper;
};

const onSlideChange = () => {
  if (controlledSwiper.value) {
    currentIndex.value = controlledSwiper.value.activeIndex;
  }
};
</script>
