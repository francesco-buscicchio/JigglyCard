<template>
  <div>
    <AtomsLabel>{{ label }}</AtomsLabel>
    <AtomsInputText
      :status="status"
      :placeholder="placeholder"
      @updateValue="handleInput"
    >
      <slot />
    </AtomsInputText>
  </div>
</template>

<script setup lang="ts">
// Props
const props = defineProps({
  status: String,
  label: String,
  placeholder: String,
});

const emit = defineEmits(["inputUpdate"]);
const handleInput = (value: String) => {
  emit("inputUpdate", value);
};
</script>
