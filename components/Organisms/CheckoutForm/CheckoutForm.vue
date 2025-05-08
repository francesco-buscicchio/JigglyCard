<template>
  <div class="mx-4">
    <div class="mb-4">
      <p class="mb-1">{{ t("name") }}</p>
      <AtomsInputText @updateValue="updateField('name', $event)" />
    </div>

    <div class="mb-4">
      <p class="mb-1">{{ t("surname") }}</p>
      <AtomsInputText @updateValue="updateField('surname', $event)" />
    </div>

    <div class="mb-4">
      <p class="mb-1">{{ t("email") }}</p>
      <AtomsInputText @updateValue="updateField('email', $event)" />
    </div>

    <div class="flex">
      <div class="mb-4 mr-2">
        <p class="mb-1">{{ t("cap") }}</p>
        <AtomsInputText @updateValue="updateField('cap', $event)" />
      </div>

      <div class="mb-4 ml-2">
        <p class="mb-1">{{ t("city") }}</p>
        <AtomsInputText @updateValue="updateField('city', $event)" />
      </div>
    </div>

    <div class="mb-4">
      <p class="mb-1">{{ t("streetAndHouseNumber") }}</p>
      <AtomsInputText
        @updateValue="updateField('streetAndHouseNumber', $event)"
      />
    </div>

    <div class="flex items-center">
      <AtomsCheckbox
        class="mr-2"
        :modelValue="formValues.iWantTheInvoice"
        @click="toggleCheckbox"
      />
      <p class="text-left">{{ t("iWantTheInvoice") }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, defineEmits } from "vue";

const { t } = useI18n();
const emit = defineEmits(["updateFormValues"]);

interface FormValues {
  name: string;
  surname: string;
  email: string;
  cap: string;
  city: string;
  streetAndHouseNumber: string;
  iWantTheInvoice: boolean;
}

const formValues: FormValues = reactive({
  name: "",
  surname: "",
  email: "",
  cap: "",
  city: "",
  streetAndHouseNumber: "",
  iWantTheInvoice: false,
});

function updateField(field: string, value: any) {
  formValues[field] = value;
  emit("updateFormValues", { ...formValues });
}

function toggleCheckbox() {
  formValues.iWantTheInvoice = !formValues.iWantTheInvoice;
  emit("updateFormValues", { ...formValues });
}
</script>
