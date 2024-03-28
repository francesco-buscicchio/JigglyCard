<template>
  <div
    class="px-6 py-4 max-w-sm rounded-lg border border-gray-200 shadow-md bg-white"
  >
    <div class="flex flex-col gap-4" v-if="type === 'checkboxList'">
      <h3 class="text-xl font-bold">{{ title }}</h3>
      <div
        v-for="filter in filters"
        :key="filter.name"
        class="flex items-center justify-between"
      >
        <span>{{ filter.label }}</span>
        <div
          class="min-w-4 min-h-4 rounded-full border-lightPink border-2 cursor-pointer transition-colors duration-300 ml-4"
          :class="filter.enabled ? 'bg-darkPink' : 'bg-ultralitePink'"
          @click="toggleFilter(filter)"
        ></div>
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
  top: -25px; /* Adjust this value to position the tooltip */
  transform: translateX(-50%);
  background-color: #fba2a9;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  user-select: none;
}

.range-slider::-webkit-slider-thumb {
  appearance: none;
  margin-top: 0; /* Necessary to align the tooltip properly */
}
</style>
