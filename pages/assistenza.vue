<template>
  <h1 class="text-accent-500 text-center p-8">
    {{ t("forms.support.title") }}
  </h1>

  <div class="flex flex-col lg:items-center">
    <p class="lg:pb-12 pb-2 lg:w-120 px-4">
      {{ t("forms.support.mail") }}
      <!-- link mailto -->
      <a :href="`mailto:${email}`" class="text-blue-500 underline">
        {{ email }}
      </a>
      {{ t("forms.support.message") }}
      <!-- link tel -->
      <a :href="`tel:${phoneNumber}`" class="text-blue-500 underline">
        {{ phoneNumber }} </a
      >.
    </p>
    <p class="px-4">{{ t("forms.support.form") }}</p>
  </div>

  <div class="flex justify-center lg:pt-20 pt-12 pb-18 lg:26">
    <OrganismsSupportForm @updateFormValues="updateFormData" />
  </div>
</template>

<script setup lang="ts">
import { email, phoneNumber } from "~/data/const";
const { t } = useI18n();
</script>
