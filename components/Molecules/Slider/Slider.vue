<template>
  <div class="flex flex-col items-start w-full">
    <div class="relative w-full mb-2" v-if="sliderReady" :key="min + '-' + max">
      <input
        type="range"
        :min="min"
        :max="max"
        v-model="price1"
        @input="updatePrices"
        class="slider-range"
        @mousedown="startDragging('price1')"
        @touchstart="startDragging('price1')"
      />
      <input
        type="range"
        :min="min"
        :max="max"
        v-model="price2"
        @input="updatePrices"
        class="slider-range"
        @mousedown="startDragging('price2')"
        @touchstart="startDragging('price2')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed, watch } from "vue";

const props = defineProps({
  min: Number,
  max: Number,
  initialMinPrice: Number,
  initialMaxPrice: Number,
});

const emit = defineEmits(["update:minPrice", "update:maxPrice"]);

const price1 = ref(props.initialMinPrice);
const price2 = ref(props.initialMaxPrice);
const dragging = ref<string | null>(null);

const sliderReady = computed(() => {
  return props.max! != 0 && props.min! != 0;
});

const minPrice = computed(() => Math.min(price1.value ?? 0, price2.value ?? 0));
const maxPrice = computed(() => Math.max(price1.value ?? 0, price2.value ?? 0));

watch(
  () => [props.initialMinPrice, props.initialMaxPrice],
  ([newMin, newMax]) => {
    if (props.max! != 0 && props.min! != 0) {
      price1.value = newMin;
      price2.value = newMax;
    }
  }
);

const updatePrices = () => {
  emit("update:minPrice", minPrice.value);
  emit("update:maxPrice", maxPrice.value);
};

const startDragging = (type: "price1" | "price2") => {
  dragging.value = type;
  window.addEventListener("mouseup", stopDragging);
  window.addEventListener("touchend", stopDragging);
};

const stopDragging = () => {
  dragging.value = null;
  window.removeEventListener("mouseup", stopDragging);
  window.removeEventListener("touchend", stopDragging);
};
</script>

<style scoped>
.slider-range {
  position: absolute;
  width: 100%;
  pointer-events: auto;
  -webkit-appearance: none;
  appearance: none;
  background: #003849;
  height: 4px;
}

.slider-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #003849;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  z-index: 2;
}

.slider-range::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #003849;
  border-radius: 50%;
  cursor: pointer;
}
</style>
