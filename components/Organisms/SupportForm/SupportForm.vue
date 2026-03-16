<template>
  <div class="lg:max-w-158 w-full px-5">
    <div class="lg:flex w-full gap-4">
      <div class="mb-4 w-full">
        <p class="mb-1">{{ t("forms.fields.name") }}</p>
        <AtomsInputText
          :status="
            formErrors.name ? 'error' : formValues.name ? 'success' : 'default'
          "
          @updateValue="updateField('name', $event)"
          @blur="validateField('name')"
        />
        <p v-if="formErrors.name" class="text-red-600 text-sm mt-1">
          {{ formErrors.name }}
        </p>
      </div>

      <div class="mb-4 w-full">
        <p class="mb-1">{{ t("forms.fields.surname") }}</p>
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
        <p v-if="formErrors.surname" class="text-red-600 text-sm mt-1">
          {{ formErrors.surname }}
        </p>
      </div>
    </div>

    <div class="mb-4">
      <p class="mb-1">{{ t("forms.fields.email") }}</p>
      <AtomsInputText
        :status="
          formErrors.email ? 'error' : formValues.email ? 'success' : 'default'
        "
        @updateValue="updateField('email', $event)"
        @blur="validateField('email')"
      />
      <p v-if="formErrors.email" class="text-red-600 text-sm mt-1">
        {{ formErrors.email }}
      </p>
    </div>

    <div class="mb-4 mr-2">
      <p class="mb-1">{{ t("forms.fields.message") }}</p>
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
      <p v-if="formErrors.message" class="text-red-600 text-sm mt-1">
        {{ formErrors.message }}
      </p>
    </div>

    <div class="w-40 mx-auto lg:mx-0">
      <AtomsButtonCTA
        :text="t('forms.actions.submit')"
        :type="isFormValid === true ? 'primary' : 'disabled'"
        @click="confirmForm"
      />
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
