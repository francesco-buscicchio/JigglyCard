<template>
  <div class="relative">
    <input
      type="number"
      :class="inputClass"
      :value="inputValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="status === 'disabled'"
      :placeholder="placeholder"
      @input="handleInput"
      @blur="handleBlur"
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
import { computed, defineEmits, defineProps, useSlots } from "vue";

const emits = defineEmits(["updateValue", "blur"]);

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: undefined,
  },
  min: {
    type: Number,
    default: Number.NEGATIVE_INFINITY,
  },
  max: {
    type: Number,
    default: Number.POSITIVE_INFINITY,
  },
  step: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    default: "default",
  },
  placeholder: {
    type: String,
    default: "",
  },
});

const slots = useSlots();

const inputValue = computed(() => props.modelValue);

const hasSlotContent = computed(() => !!slots.default);

const inputClass = computed(() => {
  const baseClass =
    "form-input w-full pl-3 py-2 border-2 rounded-lg focus:ring-0 active:border-2";
  const statusClasses = {
    success: "border-[#84CC16] focus:border-[#84CC16]",
    error: "border-[#DC2626] focus:border-[#DC2626]",
    warning: "border-[#FBBF24] focus:border-[#FBBF24]",
    newsletter: "border-accent-950 focus:border-accent-950 py-3",
    default: "border-accent-950 focus:border-accent-950 bg-transparent",
    disabled:
      "border border-neutrals-500 bg-neutrals-200 focus:border-neutrals-500",
  };

  const paddingRight = hasSlotContent.value ? "pr-10" : "";

  return `${baseClass} ${
    statusClasses[props.status as keyof typeof statusClasses] ||
    statusClasses.default
  } ${paddingRight}`;
});

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  let value = parseFloat(target.value);

  if (isNaN(value)) {
    emits("updateValue", ""); // oppure undefined/null a seconda del tuo uso
    return;
  }

  value = Math.max(props.min, Math.min(value, props.max));
  emits("updateValue", value);
}

function handleBlur() {
  emits("blur");
}
</script>
