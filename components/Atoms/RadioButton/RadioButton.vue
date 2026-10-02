<template>
  <label :for="id" class="flex items-center cursor-pointer">
    <input
      type="radio"
      :value="value"
      :name="name"
      :disabled="disabled"
      :id="id"
      :checked="isChecked"
      @change="handleChange"
    />
    <slot name="label">
      <span v-if="label" class="pl-2 text-base">{{ label }}</span>
    </slot>
  </label>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  id: { type: String, required: true },
  value: { type: [String, Number, Object], required: true },
  name: { type: String, required: true },
  disabled: { type: Boolean, default: false },
  label: { type: String, required: false },
  selectedValue: { type: String, required: false },
});

const emit = defineEmits(["update:modelValue"]);

const handleChange = () => {
  emit("update:modelValue", props.value);
};

const isChecked = computed(() => {
  if (props.selectedValue) {
    return props.selectedValue === props.id;
  }
});
</script>

<style>
/* Radio del sito: anello sottile e punto rosa luminoso quando è scelto. Non
   scoped di proposito: vale per tutti i radio, anche quelli dei form. */
input[type="radio"] {
  display: inline-grid;
  place-content: center;
  width: 20px;
  height: 20px;
  flex: none;
  margin: 0;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.04);
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

input[type="radio"]::before {
  content: "";
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fde4e8, #ec91a0);
  box-shadow: 0 0 10px rgba(236, 145, 160, 0.9);
  transform: scale(0);
  transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}

input[type="radio"]:checked {
  border-color: #ec91a0;
}

input[type="radio"]:checked::before {
  transform: scale(1);
}

input[type="radio"]:hover:not(:disabled) {
  border-color: rgba(247, 210, 216, 0.7);
}

input[type="radio"]:focus-visible {
  outline: 2px solid #5cc8e0;
  outline-offset: 2px;
}

input[type="radio"]:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
