<template>
  <div class="relative flex items-center">
    <input
      type="checkbox"
      :id="id"
      :checked="modelValue"
      @change="handleCheckboxChange"
      class="checkbox-input relative cursor-pointer appearance-none"
    />
    <label :for="id" class="checkbox-check" v-if="modelValue">
      <Icon name="heroicons:check-16-solid" size="14" />
    </label>
  </div>
</template>

<script setup lang="ts">
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
/* Stessa casella dei filtri: angoli morbidi, sfumatura rosa quando spuntata. */
.checkbox-input {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.04);
  transition: all 0.2s ease;
}

.checkbox-input:checked {
  border-color: transparent;
  background: linear-gradient(135deg, #fde4e8, var(--im-pink-strong));
}

.checkbox-input:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
}

.checkbox-check {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  color: #2a0a14;
  cursor: pointer;
}
</style>
