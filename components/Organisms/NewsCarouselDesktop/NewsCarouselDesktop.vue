<template>
  <div class="flex flex-col items-center bg-accent-500 text-white py-30">
    <h2 class="mb-18">{{ $t("whatsnew") }}</h2>
    <div class="flex w-[100vw] justify-center">
      <button
        @click="prev"
        class="cursor-pointer mx-10 custom-button-prev"
        :disabled="currentIndex === 0"
      >
        <Icon name="jig:arrow-left" size="50" />
      </button>
      <div class="flex w-[80vw] justify-center">
        <Swiper
          :slidesPerView="3"
          space-between="100vw"
          :navigation="{
            nextEl: '.custom-button-next',
            prevEl: '.custom-button-prev',
          }"
          :modules="[Navigation]"
          ref="swiperRef"
          @swiper="setControlledSwiper"
        >
          <SwiperSlide
            v-for="(product, index) in props.products"
            :key="index"
            class="relative cursor-pointer"
            :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center' }"

          >
            <OrganismsNewsProductWeb
              :product="product"
              :is-middle="isMiddle(index)"
            />
           
          </SwiperSlide>
        </Swiper>
      </div>

      <button
        @click="next"
        class="cursor-pointer mx-10 custom-button-next"
        :disabled="currentIndex + 3 >= props.products.length"
      >
        <Icon name="jig:arrow-right" size="50" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductType } from "~/types/product.type";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import type { Swiper } from "swiper/types";

const props = defineProps({
  products: {
    type: Array<ProductType>,
    required: true,
  },
});
const currentIndex = ref(0);
const productList = computed(() => props.products.slice(0, 9));
const controlledSwiper = ref<Swiper | null>(null);


const setControlledSwiper = (swiper: any) => {
  controlledSwiper.value = swiper;
};


const next = () => {
  if (currentIndex.value + 3 < productList.value.length) {
    currentIndex.value++;
  }
};

const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};
const isMiddle = (index: number) => {
  const activeIndex = controlledSwiper?.value?.activeIndex || 0;
  const slidesPerView = 3; // Number of slides visible per view
  const middleIndex = activeIndex + Math.floor(slidesPerView / 2);
  return index === middleIndex;
};
</script>
