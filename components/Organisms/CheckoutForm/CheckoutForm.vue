<template>
  <div>
    <div class="mb-4">
      <p class="mb-1">{{ t("forms.fields.name") }}</p>
      <AtomsInputText
        :modelValue="formValues.name"
        @updateValue="updateField('name', $event)"
        @blur="onBlur('name')"
      />
      <p
        v-if="touchedFields.name && formErrors.name"
        class="text-red-500 text-sm mt-1"
      >
        {{ formErrors.name }}
      </p>
    </div>

    <div class="mb-4">
      <p class="mb-1">{{ t("forms.fields.surname") }}</p>
      <AtomsInputText
        :modelValue="formValues.surname"
        @updateValue="updateField('surname', $event)"
        @blur="onBlur('surname')"
      />
      <p
        v-if="touchedFields.surname && formErrors.surname"
        class="text-red-500 text-sm mt-1"
      >
        {{ formErrors.surname }}
      </p>
    </div>

    <div class="mb-4">
      <p class="mb-1">{{ t("forms.fields.email") }}</p>
      <AtomsInputText
        :modelValue="formValues.email"
        @updateValue="updateField('email', $event)"
        @blur="onBlur('email')"
      />
      <p
        v-if="touchedFields.email && formErrors.email"
        class="text-red-500 text-sm mt-1"
      >
        {{ formErrors.email }}
      </p>
    </div>

    <div class="flex">
      <div class="mb-4 mr-2 w-1/2">
        <p class="mb-1">{{ t("forms.fields.cap") }}</p>
        <AtomsInputText
          :modelValue="formValues.cap"
          @updateValue="updateField('cap', $event)"
          @blur="onBlur('cap')"
        />
        <p
          v-if="touchedFields.cap && formErrors.cap"
          class="text-red-500 text-sm mt-1"
        >
          {{ formErrors.cap }}
        </p>
      </div>

      <div class="mb-4 ml-2 w-1/2">
        <p class="mb-1">{{ t("forms.fields.city") }}</p>
        <AtomsInputText
          :modelValue="formValues.city"
          @updateValue="updateField('city', $event)"
          @blur="onBlur('city')"
        />
        <p
          v-if="touchedFields.city && formErrors.city"
          class="text-red-500 text-sm mt-1"
        >
          {{ formErrors.city }}
        </p>
      </div>
    </div>

    <div class="mb-4">
      <p class="mb-1">{{ t("forms.fields.streetAndHouseNumber") }}</p>
      <AtomsInputText
        :modelValue="formValues.streetAndHouseNumber"
        @updateValue="updateField('streetAndHouseNumber', $event)"
        @blur="onBlur('streetAndHouseNumber')"
      />
      <p
        v-if="
          touchedFields.streetAndHouseNumber && formErrors.streetAndHouseNumber
        "
        class="text-red-500 text-sm mt-1"
      >
        {{ formErrors.streetAndHouseNumber }}
      </p>
    </div>

    <div class="flex items-center">
      <AtomsCheckbox
        class="mr-2"
        :modelValue="formValues.iWantTheInvoice"
        @click="toggleCheckbox"
      />
      <p class="text-left">{{ t("forms.fields.iWantTheInvoice") }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
const { t } = useI18n();

const emit = defineEmits<{
  (
    e: "updateFormStatus",
    payload: { values: FormValues; isValid: boolean }
  ): void;
}>();

interface FormValues {
  name: string;
  surname: string;
  email: string;
  cap: string;
  city: string;
  streetAndHouseNumber: string;
  iWantTheInvoice: boolean;
}

const formValues = reactive<FormValues>({
  name: "",
  surname: "",
  email: "",
  cap: "",
  city: "",
  streetAndHouseNumber: "",
  iWantTheInvoice: false,
});

const formErrors = reactive<Record<keyof FormValues, string | null>>({
  name: null,
  surname: null,
  email: null,
  cap: null,
  city: null,
  streetAndHouseNumber: null,
  iWantTheInvoice: null,
});

const touchedFields = reactive<Record<keyof FormValues, boolean>>({
  name: false,
  surname: false,
  email: false,
  cap: false,
  city: false,
  streetAndHouseNumber: false,
  iWantTheInvoice: false,
});

function validateField<K extends keyof FormValues>(
  field: K,
  value: string | boolean
): string | null {
  if (["name", "surname", "streetAndHouseNumber", "city"].includes(field)) {
    return !value || String(value).trim() === ""
      ? t("forms.validation.required")
      : null;
  }

  if (field === "email") {
    if (!value || String(value).trim() === "")
      return t("forms.validation.required");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(String(value))
      ? t("forms.validation.invalidEmail")
      : null;
  }

  if (field === "cap") {
    if (!value || String(value).trim() === "")
      return t("forms.validation.required");
    const capRegex = /^\d{5}$/;
    return !capRegex.test(String(value))
      ? t("forms.validation.invalidCAP")
      : null;
  }

  return null;
}

function updateField<K extends keyof FormValues>(field: K, value: string) {
  formValues[field] = value as never;

  if (!touchedFields[field]) {
    touchedFields[field] = true;
  }

  if (touchedFields[field]) {
    formErrors[field] = validateField(field, value);
  }

  emitFormStatus();
}

function onBlur<K extends keyof FormValues>(field: K) {
  touchedFields[field] = true;
  formErrors[field] = validateField(field, formValues[field]);
  emitFormStatus();
}

function toggleCheckbox() {
  formValues.iWantTheInvoice = !formValues.iWantTheInvoice;
  touchedFields.iWantTheInvoice = true;
  emitFormStatus();
}

const isValid = computed(() => {
  return (Object.keys(formValues) as (keyof FormValues)[]).every((key) => {
    const error = validateField(key, formValues[key]);
    formErrors[key] = error;
    return error === null;
  });
});

function emitFormStatus() {
  emit("updateFormStatus", {
    values: { ...formValues },
    isValid: isValid.value,
  });
}
</script>
