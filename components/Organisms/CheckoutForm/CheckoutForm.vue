<template>
  <div class="co-form">
    <!--
      Ogni campo sta dentro la sua <label>: InputText non accetta un id, e così
      l'etichetta resta comunque legata all'input (anche per i lettori di
      schermo) e un clic sul testo porta il cursore nel campo.
    -->
    <div
      class="field field--half"
      :class="{ 'is-invalid': touchedFields.name && formErrors.name }"
    >
      <label class="field__control">
        <span class="field__label">{{ t("forms.fields.name") }}</span>
        <AtomsInputText
          :modelValue="formValues.name"
          @updateValue="updateField('name', $event)"
          @blur="onBlur('name')"
        />
      </label>
      <p v-if="touchedFields.name && formErrors.name" class="field__error">
        <Icon name="heroicons:exclamation-circle-20-solid" size="16" />
        {{ formErrors.name }}
      </p>
    </div>

    <div
      class="field field--half"
      :class="{ 'is-invalid': touchedFields.surname && formErrors.surname }"
    >
      <label class="field__control">
        <span class="field__label">{{ t("forms.fields.surname") }}</span>
        <AtomsInputText
          :modelValue="formValues.surname"
          @updateValue="updateField('surname', $event)"
          @blur="onBlur('surname')"
        />
      </label>
      <p
        v-if="touchedFields.surname && formErrors.surname"
        class="field__error"
      >
        <Icon name="heroicons:exclamation-circle-20-solid" size="16" />
        {{ formErrors.surname }}
      </p>
    </div>

    <div
      class="field"
      :class="{ 'is-invalid': touchedFields.email && formErrors.email }"
    >
      <label class="field__control">
        <span class="field__label">{{ t("forms.fields.email") }}</span>
        <AtomsInputText
          :modelValue="formValues.email"
          @updateValue="updateField('email', $event)"
          @blur="onBlur('email')"
        />
      </label>
      <p v-if="touchedFields.email && formErrors.email" class="field__error">
        <Icon name="heroicons:exclamation-circle-20-solid" size="16" />
        {{ formErrors.email }}
      </p>
    </div>

    <div
      class="field field--cap"
      :class="{ 'is-invalid': touchedFields.cap && formErrors.cap }"
    >
      <label class="field__control">
        <span class="field__label">{{ t("forms.fields.cap") }}</span>
        <AtomsInputText
          :modelValue="formValues.cap"
          @updateValue="updateField('cap', $event)"
          @blur="onBlur('cap')"
        />
      </label>
      <p v-if="touchedFields.cap && formErrors.cap" class="field__error">
        <Icon name="heroicons:exclamation-circle-20-solid" size="16" />
        {{ formErrors.cap }}
      </p>
    </div>

    <div
      class="field field--city"
      :class="{ 'is-invalid': touchedFields.city && formErrors.city }"
    >
      <label class="field__control">
        <span class="field__label">{{ t("forms.fields.city") }}</span>
        <AtomsInputText
          :modelValue="formValues.city"
          @updateValue="updateField('city', $event)"
          @blur="onBlur('city')"
        />
      </label>
      <p v-if="touchedFields.city && formErrors.city" class="field__error">
        <Icon name="heroicons:exclamation-circle-20-solid" size="16" />
        {{ formErrors.city }}
      </p>
    </div>

    <div
      class="field"
      :class="{
        'is-invalid':
          touchedFields.streetAndHouseNumber && formErrors.streetAndHouseNumber,
      }"
    >
      <label class="field__control">
        <span class="field__label">
          {{ t("forms.fields.streetAndHouseNumber") }}
        </span>
        <AtomsInputText
          :modelValue="formValues.streetAndHouseNumber"
          @updateValue="updateField('streetAndHouseNumber', $event)"
          @blur="onBlur('streetAndHouseNumber')"
        />
      </label>
      <p
        v-if="
          touchedFields.streetAndHouseNumber && formErrors.streetAndHouseNumber
        "
        class="field__error"
      >
        <Icon name="heroicons:exclamation-circle-20-solid" size="16" />
        {{ formErrors.streetAndHouseNumber }}
      </p>
    </div>

    <div class="invoice">
      <AtomsCheckbox
        :modelValue="formValues.iWantTheInvoice"
        @click="toggleCheckbox"
      />
      <p class="invoice__text">{{ t("forms.fields.iWantTheInvoice") }}</p>
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

<style scoped>
/* Griglia a 6 colonne: nome e cognome affiancati da 640px, CAP stretto
   accanto alla città sempre (5 cifre non chiedono mezza riga). */
.co-form {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 18px 14px;
}

.field {
  grid-column: span 6;
  min-width: 0;
}

@media (min-width: 640px) {
  .field--half {
    grid-column: span 3;
  }
}

.field--cap {
  grid-column: span 2;
}

.field--city {
  grid-column: span 4;
}

.field__control {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 16px;
  line-height: 1.5;
  cursor: text;
}

.field__label {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 11px;
  line-height: 1.3;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--im-muted);
  cursor: inherit;
  transition: color 0.2s ease;
}

.field__control:focus-within .field__label {
  color: var(--im-pink);
}

/* Altezza e corpo uguali per tutti i campi; 16px evitano lo zoom di iOS. */
.field :deep(.jc-input) {
  min-height: 50px;
  font-size: 16px;
}

.field.is-invalid :deep(.jc-input) {
  border-color: rgba(255, 128, 150, 0.7);
  box-shadow: 0 0 0 3px rgba(255, 128, 150, 0.12);
}

.field__error {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.4;
  color: #ff9aab;
}

.invoice {
  grid-column: span 6;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 18px;
  border-top: 1px solid var(--im-line);
}

.invoice__text {
  font-size: 15px;
  line-height: 1.4;
  color: var(--im-ink);
}

@media (prefers-reduced-motion: reduce) {
  .field__label {
    transition: none;
  }
}
</style>
