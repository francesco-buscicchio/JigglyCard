<template>
  <div>
    <AtomsLabel>{{ label }}</AtomsLabel>
    <AtomsInputText :status="status">
      <slot />
    </AtomsInputText>
  </div>
</template>

<script setup lang="ts">
// Props
const props = defineProps({
  status: String,
  label: String,
});
</script>
