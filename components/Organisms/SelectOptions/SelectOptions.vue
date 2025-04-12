<template>
  <div class="p-4">
    <h5 class="pb-2">{{ t("shippingMethod") }}</h5>
    <div v-for="(option, index) in shippingOptions" :key="index" class="py-1">
      <label class="flex items-center cursor-pointer">
        <AtomsRadioButton
          type="radio"
          :value="option"
          v-model="selectedOption"
          :name="'shippingOptions'"
          @change="emitSelectedOption"
        />
        <span class="ml-2 text-base"
          >{{ option.name }}: {{ option.price }}€</span
        >
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps } from "vue";

const props = defineProps({
  shippingOptions: {
    type: Array,
    required: true,
  },
});

const { t } = useI18n();
const selectedOption = ref(null);

const emit = defineEmits<{
  (e: "update:selectedOption", option: { name: string; price: number }): void;
}>();

const emitSelectedOption = () => {
  emit("update:selectedOption", selectedOption.value);
};
</script>
