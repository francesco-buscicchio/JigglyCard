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
      class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
    >
      <slot />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

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

const inputValue = ref("");

const inputClass = computed(() => {
  switch (props.status) {
    case "success":
      return "form-input w-full pl-3 pr-10 py-2 border-2 border-[#84CC16] rounded-lg focus:border-[#84CC16] focus:ring-0 active:border-2";
    case "error":
      return "form-input w-full pl-3 pr-10 py-2 border-2 border-[#DC2626] rounded-lg focus:border-[#DC2626] focus:ring-0 active:border-2";
    case "warning":
      return "form-input w-full pl-3 pr-10 py-2 border-2 border-[#FBBF24] rounded-lg focus:border-[#FBBF24] focus:ring-0 active:border-2";
    case "disabled":
      return "form-input w-full pl-3 pr-10 py-2 border border-neutrals-500 bg-neutrals-200 rounded-lg focus:border-neutrals-500 focus:ring-0";
    default:
      return "form-input w-full pl-3 pr-10 py-2 border border-accent-950 rounded-lg border-main-950 focus:border-main-950 focus:ring-0  active:border-2";
  }
});
</script>
