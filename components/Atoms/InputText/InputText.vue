<template>
  <div class="relative">
    <!-- Se longText è true, usa un textarea a 5 righe -->
    <textarea
      v-if="props.longText"
      :class="inputClass"
      v-model="inputValue"
      :disabled="status === 'disabled'"
      :placeholder="placeholder"
      @blur="handleBlur"
      rows="5"
    />
    <!-- Altrimenti, usa un input singola riga -->
    <input
      v-else
      :type="type"
      :class="inputClass"
      v-model="inputValue"
      :disabled="status === 'disabled'"
      :placeholder="placeholder"
      :autocomplete="autocomplete || undefined"
      :inputmode="inputmode || undefined"
      :maxlength="maxlength || undefined"
      :name="name || undefined"
      @blur="handleBlur"
    />
    <span
      v-if="hasSlotContent"
      class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
    >
      <slot />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, defineEmits, useSlots } from "vue";

const emits = defineEmits(["updateValue", "blur"]);
const props = defineProps({
  status: {
    type: String,
    default: "default",
  },
  placeholder: {
    type: String,
    default: "",
  },
  longText: {
    type: Boolean,
    default: false,
  },
  // Attributi del campo vero e proprio: senza, finirebbero sul <div> esterno
  // e il browser non saprebbe come compilare il modulo da solo.
  type: {
    type: String,
    default: "text",
  },
  autocomplete: {
    type: String,
    default: "",
  },
  inputmode: {
    type: String,
    default: "",
  },
  maxlength: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    default: "",
  },
  // Valore iniziale: serve quando il campo ricompare (per esempio i dati di
  // fatturazione nascosti e riaperti) e deve mostrare quanto già scritto.
  modelValue: {
    type: String,
    default: "",
  },
});

const slots = useSlots();
const inputValue = ref(props.modelValue ?? "");

watch(
  () => props.modelValue,
  (value) => {
    if ((value ?? "") !== inputValue.value) inputValue.value = value ?? "";
  },
);

const hasSlotContent = computed(() => !!slots.default);

const inputClass = computed(() => {
  const baseClass =
    "jc-input form-input w-full rounded-2xl border px-4 py-3 focus:ring-0";
  const statusClasses = {
    success: "border-[#84CC16] focus:border-[#84CC16]",
    error: "border-[#DC2626] focus:border-[#DC2626]",
    warning: "border-[#FBBF24] focus:border-[#FBBF24]",
    newsletter: "",
    default: "",
    disabled:
      "border border-neutrals-500 bg-neutrals-200 focus:border-neutrals-500",
  };

  // Aggiunge padding destro extra se c'è uno slot
  const paddingRight = hasSlotContent.value ? "pr-10" : "";

  return `${baseClass} ${
    statusClasses[props.status as keyof typeof statusClasses] ||
    statusClasses.default
  } ${paddingRight}`;
});

watch(inputValue, (newValue) => {
  emits("updateValue", newValue);
});

const handleBlur = () => {
  emits("blur");
};
</script>

<style scoped>
/* Campo di vetro: fondo appena più chiaro, alone rosa quando è attivo. I
   colori degli stati (errore, successo) restano quelli delle classi. */
.jc-input {
  border-color: var(--im-line);
  background-color: rgba(255, 255, 255, 0.04);
  color: var(--im-ink);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.jc-input::placeholder {
  color: var(--im-muted);
  opacity: 0.7;
}

.jc-input:hover {
  border-color: rgba(255, 255, 255, 0.22);
}

.jc-input:focus {
  border-color: var(--im-pink-strong);
  background-color: rgba(255, 255, 255, 0.06);
  box-shadow: 0 0 0 4px rgba(236, 145, 160, 0.16);
  outline: none;
}
</style>
