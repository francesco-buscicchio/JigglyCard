<template>
  <div class="bg-accent-50 p-4 flex flex-col gap-y-4">
    <h5>{{ $t("titleNewsLetter") }}</h5>
    <p>{{ $t("captionNewsletterShort") }}</p>
    <MoleculesContainerInput
      status="default"
      placeholder="e-mail"
      @inputUpdate="email = $event"
    />
    <AtomsButtonCTA
      type="primary"
      :text="buttonNewsLetter"
      @click="mailAction(email)"
    />
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n();

const email = ref("");
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

const mailAction = async (email: string) => {
  const userName = getUsernameFromMail(email);
  const { newsletterToCustomer, newsletterToAdmin } = await loadTemplates();

  // SEND MAIL TO SUBSCRIBER
  sendMail({
    email: email,
    name: email,
    subject: "Subscription to Jigglycard newsletter successful",
    contentValue: newsletterToCustomer(userName),
  });

  // SEND MAIL TO BACKOFFICE
  sendMail({
    email: "jigglycard@gmail.com",
    name: "Jigglycard Store",
    subject: "Subscription to Jigglycard newsletter successful",
    contentValue: newsletterToAdmin(userName, email),
  });

  // CREATE USER IN DB
  subscribeSendgrid(email);
};
</script>
