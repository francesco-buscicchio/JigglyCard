<template>
  <div
    class="px-6 py-4 max-w-sm rounded-lg border border-gray-200 shadow-md bg-white"
  >
    <div class="flex flex-col gap-4" v-if="type === 'checkboxList'">
      <h3 class="text-xl font-bold">{{ title }}</h3>
      <div
        v-for="filter in filters"
        :key="filter.name"
        class="flex items-center"
      >
        <div
          class="min-w-5 min-h-5 border-2 cursor-pointer transition-colors duration-300 mr-4 relative rounded-md"
          :class="
            filter.enabled
              ? 'bg-darkPink border-darkPink'
              : 'bg-ultralitePink border-lightPink'
          "
          @click="toggleFilter(filter)"
        >
          <span
            class="absolute inset-0 flex justify-center items-center"
            v-show="filter.enabled"
          >
            <svg viewBox="0 0 24 24" fill="none" class="h-3 w-3 text-white">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9 19a1 1 0 01-.707-.293l-5-5a1 1 0 111.414-1.414L9 16.586 18.293 7.293a1 1 0 111.414 1.414l-10 10A1 1 0 019 19z"
                fill="currentColor"
              />
            </svg>
          </span>
        </div>
        <span>{{ filter.label }}</span>
      </div>
    </div>

    <div class="flex flex-col gap-4 relative" v-if="type === 'rangeSelector'">
      <h3 class="text-xl font-bold">{{ title }}</h3>
      <div>
        <span>{{ rangeLabel }}</span>
        <input
          type="range"
          class="range-slider w-full h-2 rounded-lg cursor-pointer"
          :style="{
            'accent-color': '#fba2a9',
            cursor: 'pointer',
          }"
          :min="range.min"
          :max="range.max"
          v-model="range.value"
          @input="updateRange"
          @mousemove="updateTooltipPosition($event)"
          ref="slider"
        />
        <div class="tooltip" :style="{ left: tooltipPosition + 'px' }">
          {{ range.value + " €" }}
        </div>
        <div class="flex justify-between text-xs px-2">
          <span>{{ range.min + " €" }}</span>
          <span>{{ range.max + " €" }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";

defineProps({
  title: String,
  filters: Array,
  type: String,
  rangeLabel: String,
});

const range = reactive({
  min: 0,
  max: 100,
  value: 50,
});

const emit = defineEmits(["update:filters", "update:range"]);
const slider = ref(null);
const tooltipPosition = ref("0%");

function toggleFilter(filter) {
  console.log("click");
  filter.enabled = !filter.enabled;
  emit("update:filters", filter.name);
}

function updateRange() {
  emit("update:range", range.value);
  updateTooltipPosition();
}

function updateTooltipPosition(event) {
  const sliderElement = slider.value;
  if (!sliderElement) return;

  const rect = sliderElement.getBoundingClientRect();
  const percent = ((range.value - range.min) / (range.max - range.min)) * 100;
  tooltipPosition.value = `calc(${percent}% - ${event.clientX - rect.left}px)`;
}

watch(() => range.value, updateTooltipPosition);
</script>

<style scoped>
.tooltip {
  position: absolute;
  top: -25px;
  transform: translateX(-50%);
  background-color: #fba2a9;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  user-select: none;
}

.range-slider::-webkit-slider-thumb {
  appearance: none;
  margin-top: 0;
}
</style>
