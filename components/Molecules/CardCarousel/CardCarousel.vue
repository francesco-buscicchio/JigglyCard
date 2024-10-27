<template>
  <div
    ref="carouselContainer"
    class="carousel relative max-w-lg mx-auto overflow-hidden"
  >
    <div class="carousel-indicators bottom-2 w-full text-center">
      <span
        v-for="(item, index) in items"
        :key="index"
        :class="[
          'dot h-4 w-4 mx-1 rounded-full inline-block border border-accent-950',
          {
            'bg-accent-950': index === activeIndex,
            'bg-accent-50': index !== activeIndex,
          },
        ]"
        @click="setActive(index)"
      ></span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import type { PropType } from "vue";
import type { ProductType } from "~/pages/[tcg]/[category]/[subcategory]/product.type";

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

function setActive(index: number) {
  activeIndex.value = index;
  emit("update:index", index);
  resetTimer(true);
}

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
