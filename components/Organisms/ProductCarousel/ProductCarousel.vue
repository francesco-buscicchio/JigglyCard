<template>
  <div :class="containerClass">
    <h3 :class="titleClass">{{ title }}</h3>
    <div class="max-w-full">
      <Swiper
        ref="swiperRef"
        :grab-cursor="true"
        :space-between="50"
        @swiper="setControlledSwiper"
        @slideChange="onSlideChange"
      >
        <SwiperSlide
          v-for="product in productList"
          :key="product.code"
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
          />
        </SwiperSlide>
      </Swiper>

      <MoleculesCardCarousel
        :items="productList"
        @update:index="updateIndex"
        :activeIndex="currentIndex"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

export type ProductType = {
  id: string;
  productName: string;
  code: string;
  expansion: string;
  price: string;
  imageUrl: string;
  tcg: string;
  category: string;
};

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
});

const currentIndex = ref(0);
const productList = ref(props.products);
const controlledSwiper = ref(null);

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
  switch (props.colorScheme) {
    case "primaryHome":
      return "text-white text-center w-full pb-4";
    default:
      return "text-accent-500 text-center w-full pb-4";
  }
});

const setControlledSwiper = (swiper: any) => {
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
