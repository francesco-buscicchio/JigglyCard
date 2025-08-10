<template>
  <div>
    <h5 class="pb-2">{{ t("shippingMethod") }}</h5>
    <div v-for="(option, index) in shippingOptions" :key="index" class="py-1">
      <div class="flex items-center cursor-pointer" for="shippingOptions">
        <AtomsRadioButton
          :id="option.id"
          type="radio"
          :value="option"
          v-model="selectedOption"
          :name="'shippingOptions'"
          @change="emitSelectedOption"
        >
          <template #label>
            <span class="ml-2 text-base"
              >{{ option.label }}: {{ option.price }}€</span
            >
          </template>
        </AtomsRadioButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps } from "vue";

interface ShippingOption {
  id: string;
  label: string;
  price: number;
  [key: string]: any;
}

const props = defineProps<{
  shippingOptions: ShippingOption[];
}>();

const { t } = useI18n();
const selectedOption = ref(null);

const emit =
  defineEmits<
    (
      e: "update:selectedOption",
      option: { id: string; price: number }
    ) => void
  >();

const emitSelectedOption = () => {
  if (selectedOption.value) {
    emit("update:selectedOption", selectedOption.value);
  }
};
</script>
