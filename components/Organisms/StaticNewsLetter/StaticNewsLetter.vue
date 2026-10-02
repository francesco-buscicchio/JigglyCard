<template>
  <div class="news">
    <div class="news__card">
      <span class="news__badge" aria-hidden="true">
        <Icon name="heroicons:envelope-20-solid" size="22" />
      </span>
      <h2 class="im-display news__title">
        <span class="im-gradient-text">{{ titleNewsLetter }}</span>
      </h2>

      <p class="news__lead">{{ headerNewsLetter }}</p>

      <p class="news__caption">
        <span>{{ captionNewsletterFirst }}</span>
        <span class="news__highlight">
          {{ captionNewsletterBold }}
        </span>
        <span>{{ captionNewsletterSecond }}</span>
      </p>

      <div class="news__form">
        <MoleculesContainerInput
          class="news__input"
          status="default"
          :placeholder="t('newsletter.emailPlaceholder')"
          @inputUpdate="email = $event"
        />
        <div class="news__submit">
          <AtomsButtonCTA
            type="primary"
            :text="buttonNewsLetter"
            @click="mailAction"
          >
            <Icon name="heroicons:arrow-right-20-solid" size="18" />
          </AtomsButtonCTA>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { sendMail } from "~/utils/sendMail";
import getUsernameFromMail from "~/utils/getUsernameFromMail";
const emit = defineEmits(["mailSended"]);
const config = useRuntimeConfig();
const { t, locale } = useI18n();
const email = ref("");

const titleNewsLetter = t("newsletter.title");
const headerNewsLetter = t("newsletter.header");

const captionNewsletterFirst = t("newsletter.caption.first");
const captionNewsletterBold = t("newsletter.caption.bold");
const captionNewsletterSecond = t("newsletter.caption.second");
const buttonNewsLetter = t("newsletter.button");

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
  if (!email.value) return;
  const userName = getUsernameFromMail(email.value);
  const { newsletterToCustomer, newsletterToAdmin } = await loadTemplates();

  // SEND MAIL TO SUBSCRIBER
  sendMail({
    email: email.value,
    name: email.value,
    subject: t("emails.newsletter.subscriptionSubject"),
    contentValue: newsletterToCustomer(userName),
  }).then(() => {
    emit("mailSended");
  });

  // SEND MAIL TO BACKOFFICE
  sendMail({
    email: config.public.ADMIN_MAIL,
    name: t("emails.newsletter.storeName"),
    subject: t("emails.newsletter.adminSubject"),
    contentValue: newsletterToAdmin(userName, email.value),
  });

  // CREATE USER IN DB
  subscribeSendgrid(email.value);
};
</script>

<style scoped>
/* Scheda di vetro: titolo display sfumato, sconto evidenziato come un
   badge e iscrizione su una riga da tablet in su. */
.news__card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
  padding: 28px 20px;
  border-radius: 28px;
  border: 1px solid var(--im-line);
  background:
    radial-gradient(80% 60% at 100% 0%, rgba(236, 145, 160, 0.18), transparent 70%),
    radial-gradient(70% 50% at 0% 100%, rgba(92, 200, 224, 0.1), transparent 70%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.02));
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

@media (min-width: 768px) {
  .news__card {
    padding: 40px;
  }
}

.news__badge {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  color: #2a0a14;
  background: linear-gradient(135deg, #fde4e8, var(--im-pink-strong));
  box-shadow: 0 14px 30px -12px rgba(236, 145, 160, 0.8);
}

.news__title {
  font-size: clamp(30px, 4vw, 44px);
  line-height: 1.05;
}

/* Il CSS di base dà Roboto a ogni span: qui deve restare il display. */
.news__title span {
  font-family: inherit;
}

.news__lead {
  font-size: 17px;
  line-height: 1.55;
  color: var(--im-ink);
}

.news__caption {
  max-width: 62ch;
  font-size: 15px;
  line-height: 1.65;
  color: var(--im-muted);
}

.news__caption span {
  color: inherit;
}

.news__highlight {
  display: inline-block;
  margin: 0 2px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid rgba(247, 210, 216, 0.4);
  background: rgba(247, 210, 216, 0.12);
  font-weight: 700;
  color: var(--im-pink) !important;
}

.news__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 6px;
}

@media (min-width: 640px) {
  .news__form {
    flex-direction: row;
    align-items: flex-end;
  }

  .news__input {
    flex: 1;
    min-width: 0;
  }

  .news__submit {
    flex: none;
    min-width: 170px;
  }
}

/* Il campo della molecola è un rettangolo arrotondato: qui diventa una
   pillola alta come il bottone accanto. */
.news__input :deep(input) {
  min-height: 50px;
  border-radius: 999px;
  padding-inline: 20px;
}
</style>
