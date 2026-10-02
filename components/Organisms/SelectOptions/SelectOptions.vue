<template>
  <div class="ship">
    <h2 :id="titleId" class="ship__title">
      <Icon name="heroicons:truck-20-solid" size="20" class="ship__title-icon" />
      {{ t("cart.shipping.heading") }}
    </h2>
    <!-- Tessere selezionabili con il radio nativo dentro: stessa resa del
         riepilogo carrello. -->
    <div class="ship__options" role="radiogroup" :aria-labelledby="titleId">
      <div v-for="(option, index) in shippingOptions" :key="index">
        <AtomsRadioButton
          class="ship-option"
          :id="option.id"
          :value="option"
          :selectedValue="selectedOption.id"
          :name="'shippingOptions'"
          @update:modelValue="emitSelectedOption"
        >
          <template #label>
            <span class="ship-option__name">{{ option.label }}</span>
            <span class="ship-option__price">{{ Number(option.price).toFixed(2) }} €</span>
          </template>
        </AtomsRadioButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface ShippingOption {
  id: string;
  label: string;
  price: number;
  [key: string]: any;
}

const { t } = useI18n();
const titleId = useId();
const props = defineProps<{
  shippingOptions: ShippingOption[];
  selectedOption: ShippingOption | null;
}>();

const emit = defineEmits<{
  (e: "update:selectedOption", value: ShippingOption): void;
}>();

const selectedId = ref<string | null>(props.selectedOption?.id || null);

// Aggiorna selectedId se il genitore cambia selectedOption
watch(
  () => props.selectedOption,
  (newVal) => {
    selectedId.value = newVal?.id || null;
  },
  { immediate: true }
);

// Quando selezioni un'opzione
function emitSelectedOption(option: ShippingOption) {
  emit("update:selectedOption", option);
}
</script>

<style scoped>
.ship {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ship__title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-size: 19px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--im-ink);
}

@media (min-width: 1024px) {
  .ship__title {
    font-size: 22px;
  }
}

.ship__title-icon {
  color: var(--im-pink);
}

.ship__options {
  display: grid;
  gap: 10px;
}

@media (min-width: 640px) {
  .ship__options {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}

.ship-option {
  gap: 12px;
  height: 100%;
  padding: 16px 18px;
  border-radius: 18px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.03);
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.ship-option:hover {
  border-color: rgba(255, 255, 255, 0.22);
}

.ship-option:has(input:checked) {
  border-color: rgba(236, 145, 160, 0.6);
  background: linear-gradient(135deg, rgba(247, 210, 216, 0.12), rgba(236, 145, 160, 0.04));
  box-shadow: 0 10px 28px -18px rgba(236, 145, 160, 0.8);
}

/* L'anello di focus va sulla tessera intera, non solo sul pallino. */
.ship-option:has(input:focus-visible) {
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
}

.ship-option__name {
  flex: 1;
  min-width: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--im-ink);
  cursor: inherit;
}

.ship-option__price {
  flex: none;
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-size: 15px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--im-pink);
  cursor: inherit;
}

@media (prefers-reduced-motion: reduce) {
  .ship-option {
    transition: none;
  }
}
</style>
