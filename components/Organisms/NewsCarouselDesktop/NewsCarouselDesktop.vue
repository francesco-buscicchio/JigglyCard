<template>
  <div class="flex flex-col items-center bg-accent-500 text-white py-30">
    <h2 class="mb-18">{{ t("home.sections.whatsNew") }}</h2>
    <div class="flex w-[100vw] justify-center">
      <button
        v-if="!isPrevDisabled"
        @click="prev"
        class="cursor-pointer mx-10 custom-button-prev"
      >
        <Icon name="jig:arrow-left" size="50" />
      </button>

      <div class="flex w-[80vw] justify-center">
        <Swiper
          :slidesPerView="3"
          :centered-slides="true"
          space-between="100vw"
          :initial-slide="initialSlideIndex"
          :modules="[Parallax]"
          :speed="1000"
          :parallax="true"
          ref="swiperRef"
          @swiper="onSwiperInit"
          @slideChange="onSlideChange"
        >
          <SwiperSlide
            v-for="(product, index) in productList"
            :key="index"
            class="relative cursor-pointer"
            :style="{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }"
          >
            <OrganismsNewsProductWeb
              :product="product"
              :isMiddle="isMiddle(index)"
              data-swiper-parallax="0"
            />
          </SwiperSlide>
        </Swiper>
      </div>

      <button
        v-if="!isNextDisabled"
        @click="next"
        class="cursor-pointer mx-10 custom-button-next"
      >
        <Icon name="jig:arrow-right" size="50" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductType } from "~/types/product.type";
import { Parallax } from "swiper/modules";
import "swiper/css";
import type { Swiper } from "swiper/types";

const { t } = useI18n();
const props = defineProps({
  products: {
    type: Array<ProductType>,
    required: true,
  },
});
const currentIndex = ref(0);
const productList = computed(() => props.products.slice(0, 9));
const controlledSwiper = ref<Swiper | null>(null);
const initialSlideIndex = computed(() => 1);
const lastSlideIndex = computed(() =>
  Math.max(productList.value.length - 1, 0)
);
const isPrevDisabled = computed(() => currentIndex.value <= 0);
const isNextDisabled = computed(
  () => currentIndex.value >= lastSlideIndex.value
);

const onSwiperInit = (swiper: Swiper) => {
  controlledSwiper.value = swiper;
  if (swiper.activeIndex !== initialSlideIndex.value) {
    swiper.slideTo(initialSlideIndex.value, 0);
    currentIndex.value = initialSlideIndex.value;
    return;
  }
  currentIndex.value = swiper.activeIndex;
};

const onSlideChange = (swiper: Swiper) => {
  currentIndex.value = swiper.activeIndex;
};

const next = () => {
  if (!isNextDisabled.value) {
    controlledSwiper.value?.slideNext();
  }
};

const prev = () => {
  if (!isPrevDisabled.value) {
    controlledSwiper.value?.slidePrev();
  }
};

const isMiddle = (index: number) => {
  const activeIndex = controlledSwiper?.value?.activeIndex || 0;
  return index === activeIndex;
};
</script>
