<template>
  <div>
    <div class="flex flex-col items-center justify-center mx-5">
      <h1 class="text-lg font-bold pb-2 w-full " style="font-size: 28px;">{{ titleNewsLetter }}</h1>
      <p>{{ headerNewsLetter }}</p>
      <p class="mt-6">{{ headerNewsLetter }}</p>
      <input type="text " v-model="email" placeholder="e-mail"
        class="mt-2 py-2 border border-gray-300 rounded text-center px-full mx-5 focus:border-main-600 focus:outline-none w-full" />
      <button @click="mailAction"
        class="bg-main-500 text-white border-[1px] lg:px-30 py-2 mt-4 rounded min-w-40 hover:bg-main-600 w-full">
        {{ buttonNewsLetter }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { sendMail } from "../../utils/sendMail";
import getUsernameFromMail from "~/utils/getUsernameFromMail";

const client = useMedusaClient();
const { t, locale } = useI18n();
const email = ref("");

const titleNewsLetter = t("titleNewsLetter");
const headerNewsLetter = t("headerNewsLetter");
const buttonNewsLetter = t("buttonNewsLetter");

const loadTemplates = async () => {
  const customerTemplateModule =
    locale.value === "en"
      ? await import("../../mailTemplate/en/newsletterToCustomer")
      : await import("../../mailTemplate/it/newsletterToCustomer");

  const adminTemplateModule =
    locale.value === "en"
      ? await import("~/mailTemplate/en/newsletterToAdmin")
      : await import("~/mailTemplate/it/newsletterToAdmin");

  return {
    newsletterToCustomer: customerTemplateModule.default,
    newsletterToAdmin: adminTemplateModule.default,
  };
};

const mailAction = async () => {
  const userName = getUsernameFromMail(email.value);
  const { newsletterToCustomer, newsletterToAdmin } = await loadTemplates();

  // SEND MAIL TO SUBSCRIBER
  sendMail({
    email: email.value,
    name: email.value,
    subject: "Subscription to Jigglycard newsletter successful",
    contentValue: newsletterToCustomer(userName),
  });

  // SEND MAIL TO BACKOFFICE
  sendMail({
    email: "jigglycard@gmail.com",
    name: "Jigglycard Store",
    subject: "Subscription to Jigglycard newsletter successful",
    contentValue: newsletterToAdmin(userName, email.value),
  });

  // CREATE USER IN DB
  subscribeSendgrid(email.value);
};
</script>
