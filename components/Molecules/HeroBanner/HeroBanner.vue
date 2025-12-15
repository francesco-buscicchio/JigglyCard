<template>
  <div v-if="loading || !hasSlides" class="flex gap-4 w-full">
    <div
      v-for="item in skeletonSlides"
      :key="item"
      class="h-75 md:h-125 flex-1 rounded-2xl bg-neutral-100 animate-pulse"
    ></div>
  </div>
  <template v-else>
    <swiper
      ref="swiperRef"
      :grab-cursor="true"
      :space-between="50"
      @swiper="setControlledSwiper"
      @slideChange="onSlideChange"
    >
      <swiper-slide v-for="(slide, index) in slides" :key="slide.id ?? index">
        <div
          class="relative bg-cover bg-center h-75 md:h-125 cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105"
          :style="{ backgroundImage: `url(${slide.imageUrl})` }"
          @click="navigateToListing(slide)"
          role="img"
        ></div>
      </swiper-slide>
    </swiper>

    <MoleculesCardCarousel
      :items="slides"
      @update:index="updateIndex"
      :activeIndex="currentIndex"
    />
  </template>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import "swiper/swiper-bundle.css";
import type { PropType } from "vue";
import type { ProductType } from "~/types/productType.type";
import type { Swiper } from "swiper/types";

const props = defineProps({
  slides: {
    type: Array as PropType<ProductType[]>,
    required: true,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();
const currentIndex = ref(0);
const controlledSwiper = ref();
const skeletonSlides = [0, 1, 2];
const hasSlides = computed(() => (props.slides?.length ?? 0) > 0);

const navigateToListing = (slide: ProductType) => {
  const url = `${slide.tcg}/all?expansion=${slide.expansion}`;
  router.push(url);
};

function updateIndex(index: number) {
  currentIndex.value = index;
  controlledSwiper.value.slideTo(index);
}

const setControlledSwiper = (swiper: Swiper) => {
  controlledSwiper.value = swiper;
};

const onSlideChange = () => {
  if (controlledSwiper.value) {
    currentIndex.value = controlledSwiper.value.activeIndex;
  }
};
</script>
