<template>
  <div v-if="labels.length" class="flex flex-wrap items-center gap-1">
    <span
      v-for="label in labels"
      :key="label"
      class="rounded-full border border-neutrals-300 px-2 py-0.5 text-xs leading-tight text-neutrals-600"
    >
      {{ label }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from "vue";

/**
 * Lingue e condizioni disponibili di una carta, in pillole.
 *
 * Nel TCG lo stesso pezzo passa da pochi centesimi (giocato, giapponese) a
 * diversi euro (near mint, italiano): senza questo dato il prezzo "a partire
 * da" non dice a cosa si riferisce, e il cliente deve aprire ogni scheda.
 */
const props = defineProps({
  languages: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  conditions: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  /** Oltre questo numero si riassume con "+N" invece di allungare la riga. */
  max: {
    type: Number,
    default: 3,
  },
});

const { t, te } = useI18n();

const translate = (value: string) => {
  const key = `filter.${value}`;
  return te(key) ? t(key) : value;
};

const labels = computed(() => {
  const all = [
    ...props.languages.map(translate),
    ...props.conditions.map(translate),
  ].filter(Boolean);

  if (all.length <= props.max) return all;
  return [...all.slice(0, props.max), `+${all.length - props.max}`];
});
</script>
