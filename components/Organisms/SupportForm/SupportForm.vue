<template>
  <div class="support-form">
    <div class="support-form__row">
      <div class="support-form__field">
        <!-- Il campo sta dentro la <label>: l'atomo non espone un id, così
             il click sull'etichetta porta comunque il focus nel campo. -->
        <label class="support-form__label">
          <span class="support-form__caption">{{ t("forms.fields.name") }}</span>
          <AtomsInputText
            :status="
              formErrors.name ? 'error' : formValues.name ? 'success' : 'default'
            "
            @updateValue="updateField('name', $event)"
            @blur="validateField('name')"
          />
        </label>
        <p v-if="formErrors.name" class="support-form__error" role="alert">
          <Icon name="heroicons:exclamation-triangle-20-solid" size="14" />
          {{ formErrors.name }}
        </p>
      </div>

      <div class="support-form__field">
        <label class="support-form__label">
          <span class="support-form__caption">{{ t("forms.fields.surname") }}</span>
          <AtomsInputText
            :status="
              formErrors.surname
                ? 'error'
                : formValues.surname
                ? 'success'
                : 'default'
            "
            @updateValue="updateField('surname', $event)"
            @blur="validateField('surname')"
          />
        </label>
        <p v-if="formErrors.surname" class="support-form__error" role="alert">
          <Icon name="heroicons:exclamation-triangle-20-solid" size="14" />
          {{ formErrors.surname }}
        </p>
      </div>
    </div>

    <div class="support-form__field">
      <label class="support-form__label">
        <span class="support-form__caption">{{ t("forms.fields.email") }}</span>
        <AtomsInputText
          :status="
            formErrors.email ? 'error' : formValues.email ? 'success' : 'default'
          "
          @updateValue="updateField('email', $event)"
          @blur="validateField('email')"
        />
      </label>
      <p v-if="formErrors.email" class="support-form__error" role="alert">
        <Icon name="heroicons:exclamation-triangle-20-solid" size="14" />
        {{ formErrors.email }}
      </p>
    </div>

    <div class="support-form__field">
      <label class="support-form__label">
        <span class="support-form__caption">{{ t("forms.fields.message") }}</span>
        <AtomsInputText
          :status="
            formErrors.message
              ? 'error'
              : formValues.message
              ? 'success'
              : 'default'
          "
          @updateValue="updateField('message', $event)"
          @blur="validateField('message')"
          :longText="true"
        />
      </label>
      <p v-if="formErrors.message" class="support-form__error" role="alert">
        <Icon name="heroicons:exclamation-triangle-20-solid" size="14" />
        {{ formErrors.message }}
      </p>
    </div>

    <div class="support-form__actions">
      <AtomsButtonCTA
        :text="t('forms.actions.submit')"
        :type="isFormValid === true ? 'primary' : 'disabled'"
        @click="confirmForm"
      >
        <Icon name="heroicons:paper-airplane-20-solid" size="18" />
      </AtomsButtonCTA>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const emit = defineEmits(["updateFormValues"]);
const config = useRuntimeConfig();

interface FormValues {
  name: string;
  surname: string;
  email: string;
  message: string;
}

const formValues = reactive<FormValues>({
  name: "",
  surname: "",
  email: "",
  message: "",
});

const formErrors = reactive<Record<keyof FormValues, string>>({
  name: "",
  surname: "",
  email: "",
  message: "",
});

const isValidEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

function validateField(field: keyof FormValues) {
  const value = formValues[field].trim();

  if (!value) {
    formErrors[field] = t("forms.validation.required");
  } else if (field === "email" && !isValidEmail(value)) {
    formErrors.email = t("forms.validation.invalidEmail");
  } else {
    formErrors[field] = "";
  }
}

const isFormValid = computed(() => {
  // ensure all fields have values and no errors
  return (
    Object.values(formValues).every((val) => val.trim() !== "") &&
    Object.values(formErrors).every((err) => err === "")
  );
});

const confirmForm = () => {
  // validate all fields before sending
  (Object.keys(formValues) as (keyof FormValues)[]).forEach((field) =>
    validateField(field)
  );

  if (!isFormValid.value) return;

  // send emails
  sendEmailToCustomer(
    formValues.email,
    `${formValues.name} ${formValues.surname}`,
    formValues.message
  );
  sendEmailToBackOffice(
    formValues.email,
    `${formValues.name} ${formValues.surname}`,
    formValues.message
  );

  // reset form
  (Object.keys(formValues) as (keyof FormValues)[]).forEach((field) => {
    formValues[field] = "";
  });

  emit("updateFormValues", { ...formValues });
};

const sendEmailToCustomer = (email: string, name: string, value: string) => {
  sendMail({
    email,
    name,
    subject: t("emails.support.subject"),
    contentValue: value,
  });
};

const sendEmailToBackOffice = (email: string, name: string, value: string) => {
  sendMail({
    email: config.public.ADMIN_MAIL,
    name: t("emails.newsletter.storeName"),
    subject: t("emails.support.adminSubject", { name, email }),
    contentValue: value,
  });
};

function updateField(field: keyof FormValues, value: string) {
  formValues[field] = value;
  emit("updateFormValues", { ...formValues });
}
</script>

<style scoped>
/* Campi con etichetta in monospace rosa, come gli eyebrow della home; il
   vetro e l'alone del focus li dà già AtomsInputText. */
.support-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
}

.support-form__row {
  display: grid;
  gap: 18px;
}

@media (min-width: 640px) {
  .support-form__row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.support-form__field {
  min-width: 0;
}

.support-form__label {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.support-form__caption {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--im-pink);
  cursor: pointer;
}

.support-form__label :deep(textarea) {
  min-height: 150px;
  resize: vertical;
}

.support-form__error {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.4;
  color: #fca5a5;
}

.support-form__actions {
  padding-top: 4px;
}

/* Su mobile l'invio occupa tutta la riga, da tablet in su torna una pillola. */
@media (min-width: 640px) {
  .support-form__actions {
    width: fit-content;
    min-width: 200px;
  }
}
</style>
