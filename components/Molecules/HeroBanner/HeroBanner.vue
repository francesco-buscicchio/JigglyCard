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
      <swiper-slide v-for="(slide, index) in slides" :key="slide.slug ?? index">
        <!-- Vetrina dell'espansione: la carta di copertina resta intera al
             centro (`bg-cover` la tagliava), sfocata a tutta larghezza dietro. -->
        <div
          class="hero-slide group relative flex h-75 cursor-pointer items-center overflow-hidden rounded-2xl md:h-125"
          @click="navigateToListing(slide)"
        >
          <!-- Trama diagonale invece dell'immagine sfocata: le copertine con
               fondo bianco (bustine, box) sfocate davano una macchia piatta. -->
          <div class="hero-pattern absolute inset-0" aria-hidden="true"></div>
          <div
            class="absolute inset-0 bg-gradient-to-r from-accent-950 via-accent-950/80 to-accent-950/20"
            aria-hidden="true"
          ></div>

          <div
            class="relative flex h-full w-full items-center gap-6 px-6 py-8 md:px-16"
          >
            <div class="max-w-md text-white">
              <p class="text-xs uppercase tracking-[0.2em] opacity-70">
                {{ slide.game }}
              </p>
              <h2 class="pt-2 text-white">{{ slide.name }}</h2>
              <p class="pt-3 opacity-80">
                {{ slide.products }} {{ t("home.hero.products") }} ·
                {{ t("home.hero.from") }}
                {{ (slide.fromPriceCents / 100).toFixed(2) }} €
              </p>
              <span
                class="mt-6 inline-block rounded-full bg-white px-6 py-2 font-semibold text-accent-950 transition group-hover:bg-main-500"
              >
                {{ t("home.hero.explore") }}
              </span>
            </div>

            <!-- Ventaglio di carte del set: riempie la metà destra e mostra
                 davvero cosa c'è dentro, invece di una sola immagine isolata. -->
            <div class="ml-auto hidden h-full items-center md:flex">
              <div
                v-for="(image, position) in coverImages(slide)"
                :key="image"
                class="hero-card"
                :style="fanStyle(position, coverImages(slide).length)"
              >
                <img
                  :src="image"
                  :alt="slide.name"
                  class="h-full w-auto rounded-xl object-contain shadow-2xl"
                />
              </div>
            </div>

            <img
              v-if="slide.coverImage"
              :src="slide.coverImage"
              :alt="slide.name"
              class="ml-auto h-full max-h-full w-auto max-w-[45%] rounded-xl object-contain shadow-2xl md:hidden"
            />
          </div>
        </div>
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
import type { CmsExpansion } from "~/types/shop";
import type { Swiper } from "swiper/types";

const props = defineProps({
  slides: {
    type: Array as PropType<CmsExpansion[]>,
    required: true,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const { t } = useI18n();
const router = useRouter();
const currentIndex = ref(0);
const controlledSwiper = ref();
const skeletonSlides = [0, 1, 2];
const hasSlides = computed(() => (props.slides?.length ?? 0) > 0);

/** Fino a quattro carte del set; se ne arriva una sola si usa quella. */
const coverImages = (slide: CmsExpansion) => {
  const images = (slide.coverImages ?? []).filter(Boolean);
  if (images.length) return images.slice(0, 4);
  return slide.coverImage ? [slide.coverImage] : [];
};

/**
 * Disposizione a ventaglio: le carte si sovrappongono leggermente e ruotano
 * verso l'esterno, con la prima davanti alle altre.
 */
const fanStyle = (position: number, total: number) => {
  const middle = (total - 1) / 2;
  const offset = position - middle;
  return {
    transform: `rotate(${offset * 7}deg) translateY(${Math.abs(offset) * 12}px)`,
    marginLeft: position === 0 ? "0" : "-3rem",
    zIndex: String(total - position),
  };
};

const navigateToListing = (slide: CmsExpansion) => {
  // La pagina listing legge `?expansion=` come slug del set.
  router.push(
    `/${slide.gameSlug}/${slide.categorySlug || "all"}?expansion=${slide.slug}`,
  );
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

<style scoped>
.hero-slide {
  background-color: #003849;
}

/* Trama geometrica leggera: dà profondità allo sfondo senza dipendere
   dall'immagine del prodotto, che spesso ha il fondo bianco. */
.hero-pattern {
  background-image:
    radial-gradient(
      circle at 20% 20%,
      rgba(255, 255, 255, 0.08),
      transparent 45%
    ),
    radial-gradient(
      circle at 80% 70%,
      rgba(244, 194, 202, 0.16),
      transparent 50%
    ),
    repeating-linear-gradient(
      -45deg,
      rgba(255, 255, 255, 0.035) 0px,
      rgba(255, 255, 255, 0.035) 2px,
      transparent 2px,
      transparent 14px
    );
}

.hero-card {
  height: 76%;
  transition: transform 0.35s ease;
}

/* Al passaggio del mouse il ventaglio si apre. */
.group:hover .hero-card {
  transform: rotate(0deg) translateY(0) !important;
}
</style>
