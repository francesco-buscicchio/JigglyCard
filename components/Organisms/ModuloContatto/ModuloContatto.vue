<template>
  <div class="contact">
    <div class="contact__head">
      <span class="contact__badge" aria-hidden="true">
        <Icon name="heroicons:chat-bubble-left-right-20-solid" size="20" />
      </span>
      <h2 class="contact__title">{{ t("forms.contact.title") }}</h2>
    </div>

    <!-- Su un FormKit `form` l'attributo `class` non arriva al <form>: la
         classe si passa alla sezione `form`. -->
    <FormKit
      type="form"
      :classes="{ form: { contact__form: true } }"
      :actions="false"
    >
      <div class="contact__row">
        <FormKit
          type="text"
          name="name"
          id="name"
          validation="required|not:Admin"
          :label="t('forms.fields.name')"
          :placeholder="t('forms.contact.placeholders.name')"
          :classes="fieldClasses"
        />

        <FormKit
          type="email"
          validation-visibility="blur"
          validation="required|email"
          :label="t('forms.fields.email')"
          :placeholder="t('forms.contact.placeholders.email')"
          :classes="fieldClasses"
        />
      </div>
      <FormKit
        type="tel"
        :label="t('forms.contact.placeholders.phone')"
        :placeholder="t('forms.contact.placeholders.phone')"
        validation="matches:/^[0-9]{3}[0-9]{3}[0-9]{4}$/"
        :validation-messages="{
          matches: t('forms.contact.phoneValidation'),
        }"
        validation-visibility="dirty"
        :classes="fieldClasses"
        style="min-width: 100%"
      />

      <FormKit
        type="textarea"
        name="instructions"
        :label="t('forms.fields.message')"
        :placeholder="t('forms.contact.placeholders.message')"
        :classes="fieldClasses"
        style="resize: none"
      />

      <FormKit
        type="button"
        :classes="{
          outer: {
            $reset: true,
            contact__actions: true,
          },
          wrapper: {
            $reset: true,
          },
          input: {
            $reset: true,
            'im-btn': true,
            'im-btn--primary': true,
            contact__submit: true,
          },
        }"
        @click="submitForm"
        >{{ t("forms.contact.submit") }}
        <Icon name="heroicons:paper-airplane-20-solid" size="18" />
      </FormKit>
    </FormKit>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const submitForm = () => {};

// Il tema FormKit generato è chiaro, con il focus blu: sui campi si azzera
// e si usano le classi di vetro definite nello stile qui sotto.
const fieldClasses = {
  outer: { $reset: true, contact__outer: true },
  wrapper: { $reset: true, contact__wrapper: true },
  label: { $reset: true, contact__label: true },
  inner: { $reset: true, contact__inner: true },
  input: { $reset: true, contact__input: true },
  messages: { $reset: true, contact__messages: true },
  message: { $reset: true, contact__message: true },
};
</script>

<style scoped>
/* Scheda di vetro con campi etichettati e invio a pillola sfumata. Gli
   elementi li disegna FormKit, fuori dallo scope: da qui `:deep`. */
.contact {
  position: relative;
  overflow: hidden;
  padding: 24px 20px;
  border-radius: 24px;
  border: 1px solid var(--im-line);
  background:
    radial-gradient(70% 60% at 100% 0%, rgba(236, 145, 160, 0.12), transparent 70%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

@media (min-width: 768px) {
  .contact {
    padding: 36px;
  }
}

.contact__head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.contact__badge {
  display: grid;
  flex: none;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  color: #2a0a14;
  background: linear-gradient(135deg, #fde4e8, var(--im-pink-strong));
}

.contact__title {
  font-size: 22px;
  line-height: 1.2;
  color: var(--im-ink);
}

.contact__form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.contact__row {
  display: grid;
  gap: 18px;
}

@media (min-width: 640px) {
  .contact__row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.contact :deep(.contact__outer) {
  min-width: 0;
}

.contact :deep(.contact__outer[data-disabled]) {
  opacity: 0.5;
}

.contact :deep(.contact__wrapper) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact :deep(.contact__label) {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--im-pink);
}

.contact :deep(.contact__inner) {
  display: flex;
  width: 100%;
  border-radius: 16px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.04);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.contact :deep(.contact__inner:hover) {
  border-color: rgba(255, 255, 255, 0.22);
}

.contact :deep(.contact__inner:focus-within) {
  border-color: var(--im-pink-strong);
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 0 0 4px rgba(236, 145, 160, 0.16);
}

.contact :deep(.contact__outer[data-invalid] .contact__inner) {
  border-color: #f87171;
}

.contact :deep(.contact__input) {
  width: 100%;
  min-width: 0;
  padding: 13px 16px;
  border: 0;
  background: none;
  font-size: 16px;
  color: var(--im-ink);
  appearance: none;
}

.contact :deep(textarea.contact__input) {
  min-height: 140px;
}

.contact :deep(.contact__input::placeholder) {
  color: var(--im-muted);
  opacity: 0.7;
}

.contact :deep(.contact__input:focus) {
  outline: none;
  box-shadow: none;
}

.contact :deep(.contact__messages) {
  margin-top: 6px;
}

.contact :deep(.contact__message) {
  font-size: 13px;
  color: #fca5a5;
}

.contact :deep(.contact__actions) {
  padding-top: 4px;
}

.contact :deep(.contact__submit) {
  width: 100%;
}

@media (min-width: 640px) {
  .contact :deep(.contact__submit) {
    width: auto;
    min-width: 200px;
  }
}

.contact :deep(.contact__submit *) {
  cursor: pointer;
}

@media (prefers-reduced-motion: reduce) {
  .contact :deep(.contact__inner) {
    transition: none;
  }
}
</style>
