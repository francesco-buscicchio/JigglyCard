<template>
  <div class="relative">
    <input
      type="text"
      :class="inputClass"
      v-model="inputValue"
      :disabled="status === 'disabled'"
      :placeholder="placeholder"
    />
    <span
      v-if="hasSlotContent"
      class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
    >
      <slot />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, defineEmits, useSlots } from "vue";

const emits = defineEmits(["updateValue"]);
const props = defineProps({
  status: {
    type: String,
    default: "default",
  },
  placeholder: {
    type: String,
    default: "Placeholder",
  },
});

const slots = useSlots();
const inputValue = ref("");

const hasSlotContent = computed(() => {
  return !!slots.default;
});

const inputClass = computed(() => {
  const baseClass =
    "form-input w-full pl-3 py-2 border-2 rounded-lg focus:ring-0 active:border-2";
  const statusClasses = {
    success: "border-[#84CC16] focus:border-[#84CC16]",
    error: "border-[#DC2626] focus:border-[#DC2626]",
    warning: "border-[#FBBF24] focus:border-[#FBBF24]",
    newsletter: "border-accent-950 focus:border-accent-950",
    default: "border-accent-950 focus:border-accent-950 bg-transparent",
    disabled:
      "border border-neutrals-500 bg-neutrals-200 focus:border-neutrals-500",
  };

  return `${baseClass} ${
    statusClasses[props.status as keyof typeof statusClasses] ||
    statusClasses.default
  } ${hasSlotContent.value ? "pr-10" : ""}`;
});

watch(inputValue, (newValue) => {
  emits("updateValue", newValue);
});
</script>
