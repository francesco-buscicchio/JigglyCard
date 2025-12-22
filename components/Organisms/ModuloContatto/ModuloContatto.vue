<template>
  <h4 class="pb-6">{{ t("forms.contact.title") }}</h4>

  <FormKit type="form" class="w-full" :actions="false">
    <div class="w-full flex flex-row gap-x-5">
      <FormKit
        type="text"
        name="name"
        id="name"
        validation="required|not:Admin"
        :placeholder="t('forms.contact.placeholders.name')"
      />

      <FormKit
        type="email"
        validation-visibility="blur"
        validation="required|email"
        :placeholder="t('forms.contact.placeholders.email')"
      />
    </div>
    <FormKit
      type="tel"
      :placeholder="t('forms.contact.placeholders.phone')"
      validation="matches:/^[0-9]{3}[0-9]{3}[0-9]{4}$/"
      :validation-messages="{
        matches: t('forms.contact.phoneValidation'),
      }"
      validation-visibility="dirty"
      style="min-width: 100%"
    />

    <FormKit
      type="textarea"
      name="instructions"
      :placeholder="t('forms.contact.placeholders.message')"
      style="resize: none"
    />

    <FormKit
      type="button"
      :classes="{
        outer: {
          'my-button': true,
        },
        input: {
          $reset: true,
        },
      }"
      @click="submitForm"
      >{{ t("forms.contact.submit") }}</FormKit
    >
  </FormKit>
</template>

<script setup lang="ts">
const { t } = useI18n();
const submitForm = () => {};
</script>

<style scoped>
.my-button {
  background-color: #f94451;
  color: white;
  border-radius: 4px;
  text-align: center;
  padding: 5px;
  width: 50%;
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>
