<template>
  <div class="flex flex-col items-center bg-accent-500 text-white py-30">
    <h2 class="mb-18">{{ t("whatsnew") }}</h2>
    <div class="flex w-[100vw] justify-center">
      <button class="cursor-pointer mx-10 custom-button-prev">
        <Icon name="jig:arrow-left" size="50" />
      </button>

      <div class="flex w-[80vw] justify-center">
        <Swiper
          :loop="true"
          :slidesPerView="3"
          space-between="100vw"
          :navigation="{
            nextEl: '.custom-button-next',
            prevEl: '.custom-button-prev',
          }"
          :centered-slides="true"
          :modules="[Navigation, Parallax]"
          :speed="1000"
          :parallax="true"
          ref="swiperRef"
          @swiper="onSwiperUpdate"
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

      <button class="cursor-pointer mx-10 custom-button-next">
        <Icon name="jig:arrow-right" size="50" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductType } from "~/types/productType.type";
import { Navigation, Parallax } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
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

const onSwiperUpdate = (swiper: Swiper) => {
  controlledSwiper.value = swiper;
  currentIndex.value = swiper.realIndex;
};

const onSlideChange = (swiper: Swiper) => {
  currentIndex.value = swiper.realIndex;
};

const isMiddle = (index: number) => {
  return index === (controlledSwiper.value?.realIndex ?? 0);
};
</script>
