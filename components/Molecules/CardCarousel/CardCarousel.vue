<template>
  <div ref="carouselContainer" class="carousel relative max-w-lg mx-auto overflow-hidden">
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import type { PropType } from "vue";
import { type ProductType } from "~/components/Organisms/ProductCarousel/ProductCarousel.vue";

const props = defineProps({
  items: {
    type: Array as PropType<ProductType[]>,
    required: true,
  },
  activeIndex: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits<{
  (e: "update:index", index: number): void;
}>();

const carouselContainer = ref<HTMLElement | null>(null);
const activeIndex = ref(props.activeIndex);
const observer = ref<IntersectionObserver | null>(null);

watch(
  () => props.activeIndex,
  (newIndex) => {
    activeIndex.value = newIndex;
    resetTimer(true);
  }
);

function nextSlide() {
  activeIndex.value = (activeIndex.value + 1) % props.items.length;
  emit("update:index", activeIndex.value);
}

let interval: ReturnType<typeof setInterval>;

function resetTimer(shouldRestart: boolean = false) {
  clearInterval(interval);
  if (shouldRestart && carouselContainer.value && observer.value) {
    interval = setInterval(nextSlide, 5000);
  }
}

function handleIntersection(entries: IntersectionObserverEntry[]) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      resetTimer(true);
    } else {
      resetTimer();
    }
  });
}

onMounted(() => {
  observer.value = new IntersectionObserver(handleIntersection, {
    root: null,
    threshold: 0.1,
  });
  if (carouselContainer.value) {
    observer.value.observe(carouselContainer.value);
  }
});

onUnmounted(() => {
  if (carouselContainer.value && observer.value) {
    observer.value.unobserve(carouselContainer.value);
  }
  clearInterval(interval);
});

watch(
  () => props.items,
  () => {
    activeIndex.value = 0;
    emit("update:index", activeIndex.value);
    resetTimer(true);
  },
  { deep: true }
);
</script>

<style scoped>
.carousel-item {
  transition: opacity 0.5s ease-in-out;
}
</style>
