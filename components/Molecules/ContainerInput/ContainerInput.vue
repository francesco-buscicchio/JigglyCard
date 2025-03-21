<template>
  <div>
    <AtomsLabel>{{ label }}</AtomsLabel>
    <AtomsInputText
      :status="status"
      :placeholder="placeholder"
      @updateValue="handleInput"
      @blur="handleBlur"
    >
      <slot />
    </AtomsInputText>
    <div v-if="!isValid" style="color: red; font-size: 0.8rem">
      {{ notValidMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
const props = defineProps({
  status: String,
  label: String,
  placeholder: String,
  isValid: Boolean,
  notValidMessage: String,
});

const emit = defineEmits(["inputUpdate", "inputBlur"]);
const handleInput = (value: String) => {
  emit("inputUpdate", value);
};

const handleBlur = () => {
  emit("inputBlur");
};
</script>
