<template>
  <div class="border-t-2 border-lightPink mx-5"></div>
  <div class="mx-5 mt-5">
    <div class="flex flex-col items-center justify-center text-center mx-5">
      <h1 class="text-lg font-bold pb-2">{{ sconto10 }}</h1>
      <p>{{ headerNewsLetter }}</p>
      <input
        type="text"
        v-model="email"
        placeholder="Inserisci la tua email"
        class="mt-4 py-2 border border-gray-300 rounded text-center px-full mx-5 focus:border-mediumPink focus:outline-none"
      />
      <button
        @click="mailAction"
        class="bg-lightPink text-white border-[1px] lg:px-30 py-2 mt-4 rounded min-w-40 hover:bg-mediumPink"
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
import newsletterToCustomer from "../../mailTemplate/newsletterToCustomer";
import newsletterToAdmin from "~/mailTemplate/newsletterToAdmin";
const { t } = useI18n();
const email = ref("");

const sconto10 = t("sconto10");
const headerNewsLetter = t("headerNewsLetter");
const buttonNewsLetter = t("buttonNewsLetter");
const footerNewsLetter = t("footerNewsLetter");

const mailAction = () => {
  const userName = getUsernameFromMail(email.value);
  // MANDA MAIL A CHI SI E' ISCRITTO
  sendMail({
    email: email.value,
    name: email.value,
    subject: "Avvenuta registrazione alla newsletter di Jigglycard",
    contentValue: newsletterToCustomer(userName),
  });

  //MANDA MAIL AL BACKOFFICE
  sendMail({
    email: useRuntimeConfig().public.NEWSLETTER_TO_MAIL,
    name: "Jigglycard Store",
    subject: "Avvenuta registrazione alla newsletter di Jigglycard",
    contentValue: newsletterToAdmin(userName, email.value),
  });
};
</script>
    