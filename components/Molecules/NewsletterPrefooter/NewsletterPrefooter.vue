<template>
  <MoleculesToastMessage
    :text="t('newsletter.toast')"
    type="success"
    :trigger-key="toastKey"
  />
  <!-- mobile -->
  <div class="bg-accent-50 p-4 flex flex-col gap-y-4" v-show="isMobileview">
    <h5>{{ t("newsletter.title") }}</h5>
    <p>{{ t("newsletter.short") }}</p>
    <MoleculesContainerInput
      status="newsletter"
      :placeholder="t('newsletter.emailPlaceholder')"
      @inputUpdate="email = $event"
      :notValidMessage="t('newsletter.emailValidation')"
      :isValid="isValidEmail"
      @inputBlur="validateEmail"
    />
    <AtomsButtonCTA
      type="primary"
      :text="buttonNewsLetter"
      @click="mailAction(email)"
    />
  </div>
  <!-- desktop -->
  <div
    class="bg-accent-50 flex py-8 xl:px-20 lg:px-12 gap-8 items-center justify-between"
    v-show="!isMobileview"
  >
    <div class="flex-1 max-w-[40%]">
      <h3 class="mb-4">{{ t("newsletter.title") }}</h3>
      <p class="mb-4">
        {{ t("newsletter.caption.first") }}
        <span class="bold">
          {{ t("newsletter.caption.bold") }}
        </span>
        {{ t("newsletter.caption.second") }}
      </p>
      <div class="flex gap-4">
        <div class="w-[70%]">
          <MoleculesContainerInput
            status="newsletter"
            :placeholder="t('newsletter.emailPlaceholder')"
            @inputUpdate="email = $event"
            :notValidMessage="t('newsletter.emailValidation')"
            :isValid="isValidEmail"
            @inputBlur="validateEmail"
          />
        </div>
        <div class="w-[30%]">
          <AtomsButtonCTA
            :type="isValidEmail ? 'primary' : 'disabled'"
            :text="buttonNewsLetter"
            @click="mailAction(email)"
          />
        </div>
      </div>
    </div>
    <div class="max-w-[50%] min-h-full">
      <img
        src="~/assets/img/dragonite-newsletter.avif"
        alt="newsletter"
        class="object-cover w-full h-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n();
const config = useRuntimeConfig();
const isMobileview = isMobile();
const isValidEmail = ref(true);
const email = ref("");
const buttonNewsLetter = t("newsletter.button");
const toastKey = ref(0);

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

  sendEmailToSubscriber(email, newsletterToCustomer(userName));

  sendEmailToBackOffice(newsletterToAdmin(userName, email));
  // CREATE USER IN DB
  subscribeSendgrid(email);
  // TODO: validare o meno la corretta sottoscrizione
  toastKey.value++;
};

const sendEmailToSubscriber = (email: string, value: string) => {
  sendMail({
    email: email,
    name: email,
    subject: t("emails.newsletter.subscriptionSubject"),
    contentValue: value,
  });
};

const sendEmailToBackOffice = (value: string) => {
  sendMail({
    email: config.public.ADMIN_MAIL,
    name: t("emails.newsletter.storeName"),
    subject: t("emails.newsletter.adminSubject"),
    contentValue: value,
  });
};

const validateEmail = () => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  isValidEmail.value = regex.test(email.value) || email.value === "";
};

watch(email, (newVal) => {
  if (newVal === "") {
    isValidEmail.value = true;
  }
});
</script>
