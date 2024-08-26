<template>
  <div class="carousel relative max-w-lg mx-auto overflow-hidden">
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

const props = defineProps({
  items: {
    type: Array as PropType<string[]>,
    required: true,
  },
});

const emit = defineEmits<{
  (e: "update:index", index: number): void;
}>();

const activeIndex = ref(0);

function setActive(index: number) {
  activeIndex.value = index;
  emit("update:index", index);
  resetTimer();
}

function nextSlide() {
  activeIndex.value = (activeIndex.value + 1) % props.items.length;
  emit("update:index", activeIndex.value);
}

let interval: ReturnType<typeof setInterval>;

function resetTimer() {
  clearInterval(interval);
  interval = setInterval(nextSlide, 5000);
}

onMounted(() => {
  resetTimer();
});

onUnmounted(() => {
  clearInterval(interval);
});

watch(
  () => props.items,
  () => {
    activeIndex.value = 0;
    emit("update:index", activeIndex.value);
    resetTimer();
  },
  { deep: true }
);
</script>

<style scoped>
.carousel-item {
  transition: opacity 0.5s ease-in-out;
}
</style>
