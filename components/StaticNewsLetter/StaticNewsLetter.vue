<template>
  <div class="border-t-2 border-main-90 mx-5"></div>
  <div class="mx-5 mt-5">
    <div class="flex flex-col items-center justify-center text-center mx-5">
      <h1 class="text-lg font-bold pb-2">{{ sconto10 }}</h1>
      <p>{{ headerNewsLetter }}</p>
      <input
        type="text"
        v-model="email"
        placeholder="Inserisci la tua email"
        class="mt-4 py-2 border border-gray-300 rounded text-center px-full mx-5 focus:border-main-600 focus:outline-none"
      />
      <button
        @click="mailAction"
        class="bg-main-500 text-white border-[1px] lg:px-30 py-2 mt-4 rounded min-w-40 hover:bg-main-600"
      >
        {{ buttonNewsLetter }}
      </button>
    </div>
    <div class="w-full flex flex-col items-center justify-center space-y-4">
      <p class="text-center mt-4 pb-4">
        {{ footerNewsLetter }}
      </p>
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

const sconto10 = t("sconto10");
const headerNewsLetter = t("headerNewsLetter");
const buttonNewsLetter = t("buttonNewsLetter");
const footerNewsLetter = t("footerNewsLetter");

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
  // client.customers.create({
  //   first_name: userName,
  //   last_name: userName,
  //   email: email.value,
  //   password: "ChangeMe24!",
  // });
};
</script>
