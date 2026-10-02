<template>
  <label class="foption" :class="{ 'is-checked': modelValue, 'is-empty': !count && !modelValue }">
    <input
      type="checkbox"
      class="foption__input"
      :checked="modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span class="foption__box" aria-hidden="true">
      <Icon v-if="modelValue" name="heroicons:check-16-solid" size="14" />
    </span>
    <span class="foption__label">{{ label }}</span>
    <span v-if="count !== undefined" class="foption__count">{{ count }}</span>
  </label>
</template>

<script setup lang="ts">
/** Voce di un filtro: casella, etichetta e quanti prodotti restano. */
defineProps<{
  modelValue: boolean;
  label: string;
  count?: number;
}>();

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();
</script>

<style scoped>
.foption {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 7px 10px;
  margin: 0 -10px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.foption:hover {
  background: rgba(255, 255, 255, 0.05);
}

.foption__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.foption__box {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 1.5px solid rgba(255, 255, 255, 0.28);
  color: #2a0a14;
  transition: all 0.15s ease;
}

.foption__input:focus-visible + .foption__box {
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
}

.is-checked .foption__box {
  border-color: transparent;
  background: linear-gradient(135deg, #fde4e8, var(--im-pink-strong));
}

.foption__label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--im-ink);
  cursor: inherit;
}

.foption__count {
  flex: none;
  min-width: 28px;
  padding: 1px 7px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  font-size: 12px;
  text-align: center;
  color: var(--im-muted);
  cursor: inherit;
}

.is-empty {
  opacity: 0.45;
}
</style>
