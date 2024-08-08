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
    "bg-accent-50 text-accent-90 font-bold py-3 px-4 rounded-lg active:bg-accent-10":
      props.type === "primary",
    "bg-white text-accent-50 border border-accent-50 font-bold py-3 px-4 rounded-lg active:text-accent-10 active:border-accent-10":
      props.type === "secondary",
    "bg-[#E5E5E5] text-[#737373] py-3 px-4 rounded-lg":
      props.type === "disabled",
  };
});

const emitClick = () => {
  emit("buttonClicked");
};
</script>
