<template>
  <div :class="containerClass">
    <h3 :class="titleClass">{{ title }}</h3>
    <div class="max-w-full">
      <div
        v-if="loading || !productList.length"
        class="flex gap-4 px-6 pb-6 overflow-hidden"
      >
        <div
          v-for="item in skeletonItems"
          :key="item"
          class="w-56 h-80 bg-neutral-100 rounded-2xl animate-pulse"
        ></div>
      </div>
      <template v-else>
        <Swiper
          ref="swiperRef"
          :grab-cursor="true"
          :space-between="50"
          @swiper="setControlledSwiper"
          @slideChange="onSlideChange"
        >
          <SwiperSlide
            v-for="product in productList"
            :key="product.id"
            class="pb-4"
          >
            <MoleculesProductCard
              :productName="product.productName"
              :code="product.code"
              :expansion="product.expansion"
              :price="product.price"
              :imageUrl="product.imageUrl"
              :color-scheme="colorScheme"
              :tcg="product.tcg"
              :category="product.category"
              :id="product.id"
              :available="product.available"
            />
          </SwiperSlide>
        </Swiper>

        <MoleculesCardCarousel
          :items="productList"
          @update:index="updateIndex"
          :activeIndex="currentIndex"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Swiper } from "swiper/types";
import { ref } from "vue";
import type { ProductType } from "~/types/productType.type";

const props = defineProps({
  products: {
    type: Array<ProductType>,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  colorScheme: {
    type: String,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const currentIndex = ref(0);
const productList = computed(() => props.products ?? []);
const controlledSwiper = ref();
const skeletonItems = [0, 1, 2];

const containerClass = computed(() => {
  switch (props.colorScheme) {
    case "primaryHome":
      return "bg-accent-500 pt-10 pb-6";
    case "lightHome":
      return "bg-white pt-10 pb-6";
    default:
      return "";
  }
});

const titleClass = computed(() => {
  if (props.colorScheme == "primaryHome")
    return "text-white text-center w-full pb-4";

  return "text-accent-500 text-center w-full pb-4";
});

const setControlledSwiper = (swiper: Swiper) => {
  controlledSwiper.value = swiper;
};

const onSlideChange = () => {
  if (controlledSwiper.value) {
    //@ts-ignore
    currentIndex.value = controlledSwiper.value.activeIndex;
  }
};

function updateIndex(index: number) {
  currentIndex.value = index;
  //@ts-ignore
  controlledSwiper.value.slideTo(index);
}
</script>
