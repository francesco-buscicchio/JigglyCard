<template>
  <div class="relative flex items-center">
    <input type="checkbox" :id="id" :checked="modelValue" @change="handleCheckboxChange"
      class="checkbox-input w-4 h-4 border border-accent-500 relative cursor-pointer hover:shadow appearance-none" />
    <label :for="id" class="absolute cursor-pointer" v-if="modelValue">
      <Icon name="jig:check-accent" style="color: white"></Icon>
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  id: String,
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

function handleCheckboxChange(event: Event) {
  emit("update:modelValue", (event.target as HTMLInputElement).checked);
}
</script>

<style scoped>
.checkbox-input {
  transition: all 0.2s;
}
</style>
