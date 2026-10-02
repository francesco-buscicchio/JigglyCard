<template>
  <button
    :class="[buttonClass, ctaButtonDefaultClass]"
    class="flex items-center justify-center gap-2"
    @click="emitClick"
    :disabled="disabled"
  >
    <span
      class="subtitle-m"
      v-if="type !== 'text' && type !== 'underline-text'"
      >{{ text }}</span
    >
    <p v-if="type === 'text' || type === 'underline-text'">{{ text }}</p>

    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  type: {
    type: String,
    default: "primary",
    validator: (value: string) =>
      ["primary", "secondary", "disabled", "text", "underline-text"].includes(
        value
      ),
  },
  text: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["buttonClicked"]);
const ctaButtonDefaultClass = "cta w-full";
const disabled = computed(() => {
  return props.type === "disabled";
});

// Gli stili stanno nel CSS qui sotto: gli stessi bottoni della home
// (pillola sfumata con alone, vetro, link), validi in tutto il sito.
const baseClasses = {
  primary: "cta--primary",
  secondary: "cta--secondary",
  text: "cta--text",
  "underline-text": "cta--text",
  disabled: "cta--disabled",
};

const buttonClass = computed(() => {
  return (
    baseClasses[props.type as keyof typeof baseClasses] || baseClasses.disabled
  );
});

const emitClick = () => {
  emit("buttonClicked");
};
</script>

<style scoped>
.cta {
  display: inline-flex;
  min-height: 50px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 24px;
  border-radius: 999px;
  font-family: "Roboto Flex", sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

/* I testi dentro il bottone (span, p, h5 dagli slot) ne prendono lo stile:
   prima ognuno arrivava con il proprio font e la propria misura. */
.cta :deep(span),
.cta :deep(p),
.cta :deep(h5) {
  font: inherit;
  color: inherit;
  cursor: inherit;
}

.cta:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 3px;
}

.cta--primary {
  color: #2a0a14;
  background: linear-gradient(135deg, #fde4e8 0%, var(--im-pink) 35%, var(--im-pink-strong) 100%);
  box-shadow:
    0 10px 30px -10px rgba(236, 145, 160, 0.75),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.cta--primary:hover {
  transform: translateY(-2px);
  box-shadow:
    0 16px 36px -10px rgba(236, 145, 160, 0.95),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.cta--primary:active {
  transform: translateY(0);
}

.cta--secondary {
  color: var(--im-ink);
  border: 1px solid rgba(247, 210, 216, 0.45);
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(8px);
}

.cta--secondary:hover {
  border-color: var(--im-pink);
  background: rgba(247, 210, 216, 0.1);
}

.cta--text {
  min-height: 0;
  padding: 6px 4px;
  color: var(--im-pink);
  background: none;
}

.cta--text:hover {
  color: var(--im-ink);
}

.cta--disabled {
  color: var(--im-muted);
  background: rgba(255, 255, 255, 0.06);
  cursor: not-allowed;
}
</style>
