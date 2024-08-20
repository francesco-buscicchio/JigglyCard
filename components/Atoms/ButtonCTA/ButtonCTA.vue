<template>
  <button
    :class="buttonClass"
    class="flex items-center justify-center gap-2"
    @click="emitClick"
  >
    <span class="subtitle-m">{{ text }}</span>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  type: {
    type: String,
    default: "primary",
    validator: (value: string) =>
      ["primary", "secondary", "disabled"].includes(value),
  },
  text: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["buttonClicked"]);

const buttonClass = computed(() => {
  return {
    "bg-accent-500 text-accent-50 font-bold py-3 px-4 rounded-lg active:bg-accent-950":
      props.type === "primary",
    "bg-white text-accent-500 border border-accent-500 font-bold py-3 px-4 rounded-lg active:text-accent-950 active:border-accent-950":
      props.type === "secondary",
    "bg-neutrals-200 text-neutrals-500 py-3 px-4 rounded-lg rounded-lg":
      props.type === "disabled",
  };
});

const emitClick = () => {
  emit("buttonClicked");
};
</script>
