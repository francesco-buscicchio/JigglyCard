<template>
  <button
    v-if="label"
    :class="typeClass"
    class="variant-tag"
    @click="emitClick"
  >
    <p>{{ label }}</p>
  </button>
</template>

<script setup lang="ts">
import { TagType } from "~/enum/tag.enum";
import type { TagCode } from "~/types/tagCode.type";

const props = defineProps({
  type: {
    type: String as () => TagType,
    default: "active",
    validator: (value: TagType) =>
      [TagType.ACTIVE, TagType.INACTIVE, TagType.DISABLED].includes(value),
  },
  text: {
    type: String,
    default: "",
  },
  code: {
    type: String as () => TagCode,
    required: true,
  },
});

const emit = defineEmits(["tagClicked"]);
const { t, te } = useI18n();

/**
 * Etichetta del tag.
 *
 * I prodotti sigillati non hanno lingua né condizione: senza controllo il tag
 * mostrava la chiave di traduzione grezza ("catalog.tags."). Un valore nuovo
 * arrivato da CardTrader e non ancora tradotto viene mostrato com'è, invece di
 * far affiorare la chiave.
 */
const label = computed(() => {
  const value = props.text?.trim();
  if (!value) return "";

  const key = `catalog.tags.${value}`;
  return te(key) ? t(key) : value;
});

const typeClass = computed(() => {
  switch (props.type) {
    case TagType.ACTIVE:
      return "variant-tag--active";
    case TagType.INACTIVE:
      return "variant-tag--inactive";
    case TagType.DISABLED:
      return "variant-tag--disabled";
    default:
      return "";
  }
});

const emitClick = () => {
  if (props.type !== TagType.DISABLED) emit("tagClicked", props.code);
};
</script>

<style scoped>
.variant-tag {
  min-width: 96px;
  padding: 9px 16px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.variant-tag p {
  font: inherit;
  color: inherit;
  cursor: inherit;
}

.variant-tag--active {
  color: #2a0a14;
  background: linear-gradient(135deg, #fde4e8, var(--im-pink-strong));
  box-shadow: 0 8px 22px -10px rgba(236, 145, 160, 0.9);
}

.variant-tag--inactive {
  color: var(--im-ink);
  border-color: var(--im-line);
  background: rgba(255, 255, 255, 0.05);
}

.variant-tag--inactive:hover {
  border-color: rgba(247, 210, 216, 0.5);
}

.variant-tag--disabled {
  color: var(--im-muted);
  border-color: var(--im-line);
  border-style: dashed;
  background: none;
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
