<template>
  <div class="co-form">
    <!--
      Ogni campo sta dentro la sua <label>, così l'etichetta resta legata
      all'input (anche per i lettori di schermo) e un clic sul testo porta il
      cursore nel campo. `autocomplete` lascia compilare il modulo al browser.
    -->
    <div
      v-for="field in contactFields"
      :key="field.key"
      class="field"
      :class="[field.span, { 'is-invalid': showError(field.key) }]"
    >
      <label class="field__control">
        <span class="field__label">{{ t(field.label) }}</span>
        <AtomsInputText
          :modelValue="formValues[field.key]"
          :type="field.type ?? 'text'"
          :autocomplete="field.autocomplete"
          :inputmode="field.inputmode ?? ''"
          :maxlength="field.maxlength ?? 0"
          @updateValue="updateField(field.key, $event)"
          @blur="onBlur(field.key)"
        />
      </label>
      <p v-if="showError(field.key)" class="field__error">
        <Icon name="heroicons:exclamation-circle-20-solid" size="16" />
        {{ formErrors[field.key] }}
      </p>
    </div>

    <div class="field field--half" :class="{ 'is-invalid': showError('province') }">
      <label class="field__control">
        <span class="field__label">{{ t("forms.fields.province") }}</span>
        <select
          class="field__select"
          autocomplete="address-level1"
          :value="formValues.province"
          @change="updateField('province', ($event.target as HTMLSelectElement).value)"
          @blur="onBlur('province')"
        >
          <option value="" disabled>{{ t("forms.fields.provincePlaceholder") }}</option>
          <option v-for="province in PROVINCES" :key="province.code" :value="province.code">
            {{ province.name }} ({{ province.code }})
          </option>
        </select>
      </label>
      <p v-if="showError('province')" class="field__error">
        <Icon name="heroicons:exclamation-circle-20-solid" size="16" />
        {{ formErrors.province }}
      </p>
    </div>

    <!-- Si spedisce solo in Italia (vedi pagina Spedizioni): il paese è fisso
         e lo si mostra, invece di lasciarlo indovinare. -->
    <div class="field field--half">
      <div class="field__control">
        <span class="field__label">{{ t("forms.fields.nation") }}</span>
        <p class="field__static">{{ t("forms.fields.countryItaly") }}</p>
      </div>
    </div>

    <div class="invoice">
      <div class="invoice__row">
        <AtomsCheckbox
          id="want-invoice"
          :modelValue="formValues.iWantTheInvoice"
          @click="toggleInvoice"
        />
        <label for="want-invoice" class="invoice__text">
          {{ t("forms.fields.iWantTheInvoice") }}
        </label>
      </div>

      <div v-if="formValues.iWantTheInvoice" class="invoice__body">
        <div class="kind" role="radiogroup" :aria-label="t('forms.fields.invoiceKind')">
          <label
            v-for="kind in invoiceKinds"
            :key="kind"
            class="kind__option"
            :class="{ 'is-active': formValues.invoiceKind === kind }"
          >
            <input
              type="radio"
              name="invoice-kind"
              class="kind__input"
              :value="kind"
              :checked="formValues.invoiceKind === kind"
              @change="setInvoiceKind(kind)"
            />
            {{ t(`forms.fields.invoiceKind_${kind}`) }}
          </label>
        </div>

        <div class="invoice__fields">
          <div
            v-for="field in invoiceFields"
            :key="field.key"
            class="field"
            :class="[field.span, { 'is-invalid': showError(field.key) }]"
          >
            <label class="field__control">
              <span class="field__label">
                {{ t(field.label) }}
                <span v-if="field.optional" class="field__optional">
                  ({{ t("forms.fields.optional") }})
                </span>
              </span>
              <AtomsInputText
                :modelValue="formValues[field.key]"
                :autocomplete="field.autocomplete"
                :maxlength="field.maxlength ?? 0"
                @updateValue="updateField(field.key, $event)"
                @blur="onBlur(field.key)"
              />
            </label>
            <p v-if="showError(field.key)" class="field__error">
              <Icon name="heroicons:exclamation-circle-20-solid" size="16" />
              {{ formErrors[field.key] }}
            </p>
          </div>
        </div>

        <p v-if="formValues.invoiceKind === 'company'" class="invoice__hint">
          {{ t("forms.fields.invoiceHint") }}
        </p>
      </div>
    </div>

    <!-- Accettazione delle condizioni prima del pagamento (Codice del
         Consumo, art. 49 e 51): senza la spunta il form non è valido. -->
    <div class="consent">
      <div class="consent__row">
        <AtomsCheckbox
          id="accept-terms"
          :modelValue="formValues.acceptTerms"
          @click="toggleAcceptTerms"
        />
        <i18n-t keypath="forms.fields.acceptTerms" tag="p" class="consent__text">
          <template #terms>
            <NuxtLink to="/condizioni-di-vendita" target="_blank" class="consent__link">
              {{ t("forms.fields.termsLink") }}
            </NuxtLink>
          </template>
          <template #privacy>
            <NuxtLink to="/privacy-policy" target="_blank" class="consent__link">
              {{ t("forms.fields.privacyLink") }}
            </NuxtLink>
          </template>
        </i18n-t>
      </div>
      <p v-if="showError('acceptTerms')" class="field__error">
        <Icon name="heroicons:exclamation-circle-20-solid" size="16" />
        {{ formErrors.acceptTerms }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import { PROVINCES } from "~/data/provinces";
import type { CheckoutFormData } from "~/pages/checkout.vue";

const { t } = useI18n();

const emit = defineEmits<{
  (e: "updateFormStatus", payload: { values: CheckoutFormData; isValid: boolean }): void;
}>();

type FieldKey = Exclude<
  keyof CheckoutFormData,
  "iWantTheInvoice" | "invoiceKind" | "acceptTerms"
>;
type ValidatedKey = FieldKey | "acceptTerms";

type FieldConfig = {
  key: FieldKey;
  label: string;
  span: string;
  autocomplete: string;
  type?: string;
  inputmode?: string;
  maxlength?: number;
  optional?: boolean;
};

const contactFields: FieldConfig[] = [
  { key: "name", label: "forms.fields.name", span: "field--half", autocomplete: "given-name", maxlength: 80 },
  { key: "surname", label: "forms.fields.surname", span: "field--half", autocomplete: "family-name", maxlength: 80 },
  { key: "email", label: "forms.fields.email", span: "field--half", autocomplete: "email", type: "email", inputmode: "email", maxlength: 160 },
  { key: "phone", label: "forms.fields.phone", span: "field--half", autocomplete: "tel", type: "tel", inputmode: "tel", maxlength: 20 },
  { key: "streetAndHouseNumber", label: "forms.fields.streetAndHouseNumber", span: "", autocomplete: "street-address", maxlength: 160 },
  { key: "cap", label: "forms.fields.cap", span: "field--cap", autocomplete: "postal-code", inputmode: "numeric", maxlength: 5 },
  { key: "city", label: "forms.fields.city", span: "field--city", autocomplete: "address-level2", maxlength: 80 },
];

const invoiceKinds = ["private", "company"] as const;

const invoiceFields = computed<FieldConfig[]>(() =>
  formValues.invoiceKind === "private"
    ? [{ key: "invoiceTaxCode", label: "forms.fields.taxCode", span: "", autocomplete: "off", maxlength: 16 }]
    : [
        { key: "invoiceCompanyName", label: "forms.fields.companyName", span: "", autocomplete: "organization", maxlength: 160 },
        { key: "invoiceVatNumber", label: "forms.fields.vatNumber", span: "field--half", autocomplete: "off", maxlength: 13 },
        { key: "invoiceTaxCode", label: "forms.fields.taxCode", span: "field--half", autocomplete: "off", maxlength: 16, optional: true },
        { key: "invoiceSdiCode", label: "forms.fields.sdiCode", span: "field--half", autocomplete: "off", maxlength: 7, optional: true },
        { key: "invoicePec", label: "forms.fields.pec", span: "field--half", autocomplete: "off", maxlength: 160, optional: true },
      ],
);

const formValues = reactive<CheckoutFormData>({
  name: "",
  surname: "",
  email: "",
  phone: "",
  streetAndHouseNumber: "",
  cap: "",
  city: "",
  province: "",
  iWantTheInvoice: false,
  invoiceKind: "private",
  invoiceTaxCode: "",
  invoiceCompanyName: "",
  invoiceVatNumber: "",
  invoiceSdiCode: "",
  invoicePec: "",
  acceptTerms: false,
});

const formErrors = reactive<Partial<Record<ValidatedKey, string | null>>>({});
const touchedFields = reactive<Partial<Record<ValidatedKey, boolean>>>({});

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const compact = (value: unknown) => String(value ?? "").replace(/[\s.\-/()]/g, "").toUpperCase();

/** Campi richiesti in questo momento: quelli della fattura solo se la si chiede. */
const activeKeys = computed<ValidatedKey[]>(() => [
  ...contactFields.map((field) => field.key),
  "province",
  ...(formValues.iWantTheInvoice ? invoiceFields.value.map((field) => field.key) : []),
  "acceptTerms",
]);

function validateField(field: ValidatedKey): string | null {
  const value = formValues[field];
  const textValue = String(value ?? "").trim();
  const required = t("forms.validation.required");

  switch (field) {
    case "acceptTerms":
      return value === true ? null : t("forms.validation.acceptTerms");
    case "email":
      if (!textValue) return required;
      return EMAIL.test(textValue) ? null : t("forms.validation.invalidEmail");
    case "phone":
      if (!textValue) return required;
      return /^\+?[0-9]{6,15}$/.test(compact(textValue))
        ? null
        : t("forms.validation.invalidPhone");
    case "cap":
      if (!textValue) return required;
      return /^\d{5}$/.test(textValue) ? null : t("forms.validation.invalidCAP");
    case "invoiceTaxCode": {
      const optional = formValues.invoiceKind === "company";
      if (!textValue) return optional ? null : required;
      const pattern = optional ? /^([A-Z0-9]{16}|[0-9]{11})$/ : /^[A-Z0-9]{16}$/;
      return pattern.test(compact(textValue)) ? null : t("forms.validation.invalidTaxCode");
    }
    case "invoiceVatNumber":
      if (!textValue) return required;
      return /^(IT)?[0-9]{11}$/.test(compact(textValue))
        ? null
        : t("forms.validation.invalidVatNumber");
    case "invoiceSdiCode":
      if (!textValue) return null;
      return /^[A-Z0-9]{7}$/.test(compact(textValue)) ? null : t("forms.validation.invalidSdi");
    case "invoicePec":
      if (!textValue) return null;
      return EMAIL.test(textValue) ? null : t("forms.validation.invalidEmail");
    default:
      return textValue ? null : required;
  }
}

const showError = (field: ValidatedKey) =>
  Boolean(touchedFields[field] && formErrors[field]);

const isValid = computed(() =>
  activeKeys.value.every((key) => validateField(key) === null),
);

function emitFormStatus() {
  emit("updateFormStatus", { values: { ...formValues }, isValid: isValid.value });
}

function updateField(field: ValidatedKey, value: string) {
  (formValues as Record<string, unknown>)[field] = value;
  touchedFields[field] = true;
  formErrors[field] = validateField(field);
  emitFormStatus();
}

function onBlur(field: ValidatedKey) {
  touchedFields[field] = true;
  formErrors[field] = validateField(field);
  emitFormStatus();
}

function toggleInvoice() {
  formValues.iWantTheInvoice = !formValues.iWantTheInvoice;
  emitFormStatus();
}

function setInvoiceKind(kind: CheckoutFormData["invoiceKind"]) {
  formValues.invoiceKind = kind;
  for (const field of ["invoiceTaxCode", "invoiceCompanyName", "invoiceVatNumber", "invoiceSdiCode", "invoicePec"] as const) {
    if (touchedFields[field]) formErrors[field] = validateField(field);
  }
  emitFormStatus();
}

function toggleAcceptTerms() {
  formValues.acceptTerms = !formValues.acceptTerms;
  touchedFields.acceptTerms = true;
  formErrors.acceptTerms = validateField("acceptTerms");
  emitFormStatus();
}

/**
 * Al clic su "Paga" con il modulo incompleto si segnano tutti i campi come
 * toccati: gli errori compaiono insieme invece di restare nascosti.
 */
function revealErrors() {
  for (const key of activeKeys.value) {
    touchedFields[key] = true;
    formErrors[key] = validateField(key);
  }
  return isValid.value;
}

defineExpose({ revealErrors });
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


.field__select {
  width: 100%;
  min-height: 50px;
  padding: 12px 16px;
  border-radius: 16px;
  border: 1px solid var(--im-line);
  background-color: rgba(255, 255, 255, 0.04);
  color: var(--im-ink);
  font-size: 16px;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.field__select:focus {
  border-color: var(--im-pink-strong);
  box-shadow: 0 0 0 4px rgba(236, 145, 160, 0.16);
  outline: none;
}

/* Le opzioni si aprono nel menu del sistema: fondo scuro esplicito, se no
   su Windows il testo chiaro finisce su bianco. */
.field__select option {
  color: var(--im-ink);
  background-color: #12163b;
}

.field.is-invalid .field__select {
  border-color: rgba(255, 128, 150, 0.7);
  box-shadow: 0 0 0 3px rgba(255, 128, 150, 0.12);
}

.field__static {
  display: flex;
  align-items: center;
  min-height: 50px;
  padding: 0 16px;
  border-radius: 16px;
  border: 1px dashed var(--im-line);
  color: var(--im-ink);
}

.field__optional {
  letter-spacing: 0.06em;
  text-transform: none;
  opacity: 0.8;
}

.invoice {
  grid-column: span 6;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 18px;
  border-top: 1px solid var(--im-line);
}

.invoice__row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.invoice__text {
  font-size: 15px;
  line-height: 1.4;
  color: var(--im-ink);
  cursor: pointer;
}

.invoice__body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.invoice__fields {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 18px 14px;
}

.invoice__hint {
  font-size: 13px;
  line-height: 1.5;
  color: var(--im-muted);
}

/* Privato / azienda: due pillole, come un interruttore. */
.kind {
  display: inline-flex;
  align-self: flex-start;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  border: 1px solid var(--im-line);
  background: rgba(7, 10, 31, 0.35);
}

.kind__option {
  position: relative;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  color: var(--im-muted);
  cursor: pointer;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}

.kind__option.is-active {
  color: #2a0a14;
  background: linear-gradient(135deg, #fde4e8, var(--im-pink-strong));
}

.kind__option:focus-within {
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
}

.kind__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.consent {
  grid-column: span 6;
}

.consent__row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.consent__text {
  font-size: 15px;
  line-height: 1.5;
  color: var(--im-ink);
}

.consent__link {
  font-weight: 600;
  color: var(--im-pink);
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .field__label,
  .field__select,
  .kind__option {
    transition: none;
  }
}
</style>
