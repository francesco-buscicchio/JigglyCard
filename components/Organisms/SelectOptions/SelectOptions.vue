<template>
  <div>
    <h5 class="pb-2">{{ t("shippingMethod") }}</h5>
    <div v-for="(option, index) in shippingOptions" :key="index" class="py-1">
      <div class="flex items-center cursor-pointer">
        <AtomsRadioButton
          :id="option.id"
          :value="option"
          :selectedValue="selectedOption.id"
          :name="'shippingOptions'"
          @change="emitSelectedOption"
        >
          <template #label>
            <span class="ml-2 text-base">
              {{ option.label }}: {{ option.price }}€
            </span>
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
