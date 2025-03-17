<template>
  <button
    :class="[buttonClass, ctaButtonDefaultClass]"
    class="flex items-center justify-center gap-2"
    @click="emitClick"
  >
    <span class="subtitle-m" v-if="type !== 'text' && type !== 'cart-drop'">{{
      text
    }}</span>
    <p v-if="type === 'text' || type === 'cart-drop'">{{ text }}</p>

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
      ["primary", "secondary", "disabled", "text"].includes(value),
  },
  text: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["buttonClicked"]);
const ctaButtonDefaultClass = "py-3 px-4 rounded-lg w-full";

const baseClasses = {
  primary: "bg-accent-500 text-accent-50 font-bold active:bg-accent-950",
  secondary:
    "bg-white text-accent-500 border-[2px] border-accent-500 active:text-accent-950 active:border-accent-950",
  text: "bg-none text-accent-500 font-bold active:text-accent-950",
  "cart-drop":
    "bg-none text-accent-500 font-bold underline active:text-accent-950",
  disabled: "bg-neutrals-200 text-neutrals-500",
};

const buttonClass = computed(() => {
  return (
    baseClasses[props.type as keyof typeof baseClasses] || baseClasses.disabled
  );
});

const emitClick = () => {
  emit("buttonClicked");
};
</script>
