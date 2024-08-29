<template>
  <h3 class="text-accent-500 text-center w-full pb-4">{{ title }}</h3>
  <div class="max-w-full">
    <Swiper
      ref="swiperRef"
      :grab-cursor="true"
      @swiper="setControlledSwiper"
      @slideChange="onSlideChange"
    >
      <SwiperSlide v-for="product in productList" :key="product.code">
        <MoleculesProductCard
          :productName="product.productName"
          :code="product.code"
          :expansion="product.expansion"
          :price="product.price"
          :imageUrl="product.imageUrl"
        />
      </SwiperSlide>
    </Swiper>
  </div>

  <MoleculesCardCarousel
    :items="productList"
    @update:index="updateIndex"
    :activeIndex="currentIndex"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

export type ProductType = {
  productName: string;
  code: string;
  expansion: string;
  price: string;
  imageUrl: string;
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
});

const currentIndex = ref(0);
const productList = ref(props.products);
const controlledSwiper = ref(null);

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
