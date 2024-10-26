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
  let baseClass =
    "form-input w-full pl-3 py-2 border-2 rounded-lg focus:ring-0 active:border-2";

  if (hasSlotContent.value) {
    baseClass += " pr-10";
  }

  switch (props.status) {
    case "success":
      return `${baseClass} border-[#84CC16] focus:border-[#84CC16]`;
    case "error":
      return `${baseClass} border-[#DC2626] focus:border-[#DC2626]`;
    case "warning":
      return `${baseClass} border-[#FBBF24] focus:border-[#FBBF24]`;
    case "disabled":
      return `form-input w-full pl-3 pr-10 py-2 border border-neutrals-500 bg-neutrals-200 rounded-lg focus:border-neutrals-500`;
    case "newsletter":
      return `${baseClass} border-accent-950 focus:border-accent-950`;
    default:
      return `${baseClass} border-accent-950 focus:border-accent-950 bg-transparent`;
  }
});

watch(inputValue, (newValue) => {
  emits("updateValue", newValue);
});
</script>
