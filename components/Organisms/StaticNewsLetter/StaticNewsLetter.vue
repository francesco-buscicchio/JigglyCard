<template>
  <div>
    <div class="flex flex-col items-center justify-center mx-5">
      <h2 class="font-bold pb-2 md:pb-5 w-full">
        {{ titleNewsLetter }}
      </h2>
      <p>{{ headerNewsLetter }}</p>
      <p class="mt-6 md:mt-20">{{ captionNewsletter }}</p>
      <div class="mt-6 w-full flex flex-col gap-y-4">
        <MoleculesContainerInput
          status="default"
          placeholder="e-mail"
          @inputUpdate="email = $event"
        />
        <AtomsButtonCTA
          type="primary"
          :text="buttonNewsLetter"
          @click="mailAction"
        >
        </AtomsButtonCTA>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { sendMail } from "~/utils/sendMail";
import getUsernameFromMail from "~/utils/getUsernameFromMail";

const client = useMedusaClient();
const emit = defineEmits(["mailSended"]);
const config = useRuntimeConfig();
const { t, locale } = useI18n();
const email = ref("");

const titleNewsLetter = t("titleNewsLetter");
const headerNewsLetter = t("headerNewsLetter");
const captionNewsletter = t("captionNewsletter");
const buttonNewsLetter = t("buttonNewsLetter");

const loadTemplates = async () => {
  const customerTemplateModule =
    locale.value === "en"
      ? await import("~/mailTemplate/en/newsletterToCustomer")
      : await import("~/mailTemplate/it/newsletterToCustomer");

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
  }).then((val) => {
    emit("mailSended");
  });

  // SEND MAIL TO BACKOFFICE
  sendMail({
    email: config.public.useRuntimeConfig,
    name: "Jigglycard Store",
    subject: "Subscription to Jigglycard newsletter successful",
    contentValue: newsletterToAdmin(userName, email.value),
  });

  // CREATE USER IN DB
  subscribeSendgrid(email.value);
};
</script>
