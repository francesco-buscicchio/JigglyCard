<template>
  <div class="carousel-section" :class="containerClass">
    <!-- Titolo fra due fili di luce, come i divisori della home. -->
    <div class="carousel-section__head">
      <span class="carousel-section__line" aria-hidden="true"></span>
      <h3 :class="titleClass">{{ title }}</h3>
      <span class="carousel-section__line carousel-section__line--end" aria-hidden="true"></span>
    </div>
    <div class="max-w-full">
      <div
        v-if="loading || !productList.length"
        class="flex gap-4 px-6 pb-6 overflow-hidden"
      >
        <div
          v-for="item in skeletonItems"
          :key="item"
          class="w-56 h-80 bg-neutrals-100 rounded-2xl animate-pulse"
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
              :tcgSlug="product.tcgSlug"
              :categorySlug="product.categorySlug"
              :id="product.id"
              :available="product.available"
            :languages="product.languages"
            :conditions="product.conditions"
            :quantity="product.quantity"
            :product="product"
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

// Niente più fasce piene colorate: la sezione sta sul fondo notte del sito,
// e la variante "primary" diventa un pannello di vetro rosato.
const containerClass = computed(() => {
  switch (props.colorScheme) {
    case "primaryHome":
      return "carousel-section--primary";
    case "lightHome":
      return "carousel-section--light";
    default:
      return "";
  }
});

const titleClass = computed(() => "carousel-section__title");

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

<style scoped>
.carousel-section {
  position: relative;
}

.carousel-section--light,
.carousel-section--primary {
  padding: 32px 0 16px;
}

.carousel-section--primary {
  padding-inline: 12px;
  border-radius: 24px;
  border: 1px solid var(--im-line);
  background:
    radial-gradient(80% 120% at 100% 0%, rgba(92, 200, 224, 0.18), transparent 60%),
    radial-gradient(80% 120% at 0% 100%, rgba(236, 145, 160, 0.24), transparent 60%),
    linear-gradient(135deg, #1a1650 0%, #0e1238 100%);
}

/* Su mobile il titolo va spesso su due righe: i fili laterali resterebbero
   schiacciati, quindi diventano un'unica lineetta sopra il titolo. */
.carousel-section__head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 0 4px 18px;
}

.carousel-section__line {
  width: 48px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--im-pink-strong), var(--im-teal));
}

.carousel-section__line--end {
  display: none;
}

.carousel-section__title {
  flex: 0 1 auto;
  min-width: 0;
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-weight: 700;
  font-size: clamp(20px, 6vw, 26px);
  line-height: 1.15;
  letter-spacing: -0.02em;
  text-align: center;
  text-wrap: balance;
  color: var(--im-ink);
}
</style>
