<template>
  <div class="relative">
    <div class="bg-accent-50 rounded-xl p-4 pr-12">
      <p>{{ text }}</p>
    </div>
    <span
      class="absolute inset-y-0 right-0 flex items-center pr-4"
      @click="emitClick"
    >
      <Icon name="jig:close-filter" size="10" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from "vue";

const emit = defineEmits(["removeFilter"]);
const props = defineProps({
  text: {
    type: String,
    default: "",
  },
});

const emitClick = () => {
  emit("removeFilter", props.text);
};
</script>
