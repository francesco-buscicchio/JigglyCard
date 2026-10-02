<template>
  <div class="prange">
    <div class="prange__track" :style="fillStyle">
      <input
        type="range"
        class="prange__thumb"
        :min="min"
        :max="max"
        :value="low"
        :aria-label="t('catalog.controls.min')"
        @input="onLow(($event.target as HTMLInputElement).valueAsNumber)"
      />
      <input
        type="range"
        class="prange__thumb"
        :min="min"
        :max="max"
        :value="high"
        :aria-label="t('catalog.controls.max')"
        @input="onHigh(($event.target as HTMLInputElement).valueAsNumber)"
      />
    </div>

    <div class="prange__fields">
      <label class="prange__field">
        <span>{{ t("catalog.controls.min") }}</span>
        <input
          type="number"
          inputmode="numeric"
          :min="min"
          :max="high"
          :value="low"
          @change="onLow(($event.target as HTMLInputElement).valueAsNumber)"
        />
        <span aria-hidden="true">€</span>
      </label>
      <span class="prange__dash" aria-hidden="true">–</span>
      <label class="prange__field">
        <span>{{ t("catalog.controls.max") }}</span>
        <input
          type="number"
          inputmode="numeric"
          :min="low"
          :max="max"
          :value="high"
          @change="onHigh(($event.target as HTMLInputElement).valueAsNumber)"
        />
        <span aria-hidden="true">€</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Fascia di prezzo: due cursori sulla stessa barra più due campi numerici,
 * sincronizzati fra loro. Emette sempre una coppia ordinata (min ≤ max).
 */
const props = defineProps<{
  min: number;
  max: number;
  low: number;
  high: number;
}>();

const emit = defineEmits<{ change: [range: { low: number; high: number }] }>();
const { t } = useI18n();

const clamp = (value: number, from: number, to: number) =>
  Math.min(to, Math.max(from, value));

const onLow = (value: number) => {
  if (Number.isNaN(value)) return;
  emit("change", { low: clamp(Math.round(value), props.min, props.high), high: props.high });
};

const onHigh = (value: number) => {
  if (Number.isNaN(value)) return;
  emit("change", { low: props.low, high: clamp(Math.round(value), props.low, props.max) });
};

const fillStyle = computed(() => {
  const span = Math.max(1, props.max - props.min);
  return {
    "--from": `${((props.low - props.min) / span) * 100}%`,
    "--to": `${((props.high - props.min) / span) * 100}%`,
  };
});
</script>

<style scoped>
.prange__track {
  position: relative;
  height: 28px;
  margin: 4px 0 14px;
}

.prange__track::before,
.prange__track::after {
  content: "";
  position: absolute;
  top: 50%;
  height: 4px;
  margin-top: -2px;
  border-radius: 4px;
}

.prange__track::before {
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.12);
}

.prange__track::after {
  left: var(--from);
  right: calc(100% - var(--to));
  background: linear-gradient(90deg, #fde4e8, var(--im-pink-strong));
}

/* Due range sovrapposti: la barra non riceve click, i pallini sì. */
.prange__thumb {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  margin: 0;
  background: none;
  pointer-events: none;
  -webkit-appearance: none;
  appearance: none;
}

.prange__thumb::-webkit-slider-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 3px solid var(--im-pink-strong);
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  cursor: grab;
  pointer-events: auto;
  -webkit-appearance: none;
  appearance: none;
}

.prange__thumb::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 3px solid var(--im-pink-strong);
  background: #fff;
  cursor: grab;
  pointer-events: auto;
}

.prange__thumb:focus-visible::-webkit-slider-thumb {
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
}

.prange__fields {
  display: flex;
  align-items: center;
  gap: 8px;
}

.prange__field {
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.04);
  font-size: 12px;
  color: var(--im-muted);
  transition: border-color 0.2s ease;
}

.prange__field:focus-within {
  border-color: var(--im-pink-strong);
}

.prange__field input {
  width: 100%;
  min-width: 0;
  border: 0;
  padding: 0;
  background: none;
  font-size: 14px;
  font-weight: 600;
  color: var(--im-ink);
  -moz-appearance: textfield;
}

.prange__field input:focus {
  outline: none;
  box-shadow: none;
}

.prange__field input::-webkit-outer-spin-button,
.prange__field input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.prange__dash {
  color: var(--im-muted);
}
</style>
