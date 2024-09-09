<template>
  <div
    class="px-6 py-4 max-w-sm rounded-lg border border-gray-200 shadow-md bg-white"
  >
    <div class="flex flex-col gap-4" v-if="data.type === 'checkboxList'">
      <h5 class="font-bold">{{ title }}</h5>
      <div
        v-for="filter in data.filters"
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

    <div
      class="flex flex-col gap-4 relative"
      v-if="data.type === 'rangeSelector'"
    >
      <h5>{{ data.title }}</h5>
      <div>
        <span>{{ data.rangeLabel }}</span>
        <Slider
          v-model="rangeValue"
          range
          class="w-full px-6 my-4 bg-black"
          @change="rangeValueChanged"
        />
        <div class="flex justify-between text-xs">
          <div class="max-w-20">
            <InputNumber
              v-model="rangeStart"
              inputId="currency-germany"
              mode="currency"
              currency="EUR"
              locale="it-IT"
              @update:model-value="rangeInputChanged"
            />
          </div>
          <InputNumber
            v-model="rangeEnd"
            inputId="currency-germany"
            mode="currency"
            currency="EUR"
            locale="it-IT"
            class="max-w-20"
            @update:model-value="rangeInputChanged"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type FilterCardType = {
  title: string;
  filters?: any;
  type: string;
  rangeLabel?: string;
  range?: number[];
};

const props = defineProps<{ data: FilterCardType }>();
const rangeValue = ref(props.data.range);
const rangeStart = ref(0);
const rangeEnd = ref(0);

if (props.data.range) {
  rangeStart.value = props.data.range[0];
  rangeEnd.value = props.data.range[1];
}

const rangeValueChanged = () => {
  if (rangeValue.value) {
    rangeStart.value = rangeValue.value[0];
    rangeEnd.value = rangeValue.value[1];
  }
};

const rangeInputChanged = () => {
  if (rangeValue.value) {
    rangeValue.value[0] = rangeStart.value;
    rangeValue.value[1] = rangeEnd.value;
  }
};

const emit = defineEmits(["update:filters", "update:range"]);

function toggleFilter(filter: any) {
  filter.enabled = !filter.enabled;
  emit("update:filters", filter.name);
}

function updateRange() {
  emit("update:range", props.range.value);
}
</script>

<style scoped>
::v-deep .p-slider-range {
  background: #f94451 !important;
}

::v-deep .p-inputtext {
  max-width: 80px !important;
  min-height: 30px !important;
}
</style>
