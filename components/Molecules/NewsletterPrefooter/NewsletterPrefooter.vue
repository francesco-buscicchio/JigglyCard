<template>
  <MoleculesToastMessage
    :text="t('newsletter.toast')"
    type="success"
    :trigger-key="toastKey"
  />
  <!-- Un solo pannello per mobile e desktop: cambiano solo il testo (breve
       su mobile) e, come prima, il bottone che su desktop si spegne finché
       l'email non è valida. -->
  <section class="newsletter" :aria-labelledby="titleId">
    <!-- Dragonite sfuma nel pannello invece di stare in un riquadro. -->
    <div class="newsletter__art" aria-hidden="true">
      <img
        src="~/assets/img/dragonite-newsletter.avif"
        alt=""
        class="newsletter__img"
        loading="lazy"
      />
    </div>

    <div class="newsletter__copy">
      <span class="newsletter__badge" aria-hidden="true">
        <Icon name="heroicons:envelope-20-solid" size="20" />
      </span>
      <h2 :id="titleId" class="im-display newsletter__title">
        {{ t("newsletter.title") }}
      </h2>
      <p v-show="isMobileview" class="newsletter__lead">
        {{ t("newsletter.short") }}
      </p>
      <p v-show="!isMobileview" class="newsletter__lead">
        {{ t("newsletter.caption.first") }}
        <strong class="newsletter__highlight">
          {{ t("newsletter.caption.bold") }}
        </strong>
        {{ t("newsletter.caption.second") }}
      </p>

      <div class="newsletter__form">
        <MoleculesContainerInput
          class="newsletter__input"
          status="newsletter"
          :placeholder="t('newsletter.emailPlaceholder')"
          @inputUpdate="email = $event"
          :notValidMessage="t('newsletter.emailValidation')"
          :isValid="isValidEmail"
          @inputBlur="validateEmail"
        />
        <AtomsButtonCTA
          class="newsletter__cta"
          :type="isMobileview || isValidEmail ? 'primary' : 'disabled'"
          :text="buttonNewsLetter"
          @click="mailAction(email)"
        >
          <Icon name="heroicons:paper-airplane-20-solid" size="18" aria-hidden="true" />
        </AtomsButtonCTA>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t, locale } = useI18n();
const config = useRuntimeConfig();
const isMobileview = isMobile();
const titleId = useId();
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

<style scoped>
/* Stesso linguaggio del pannello "Vendi da noi" della home: blu notte con
   aloni rosa e petrolio, bordo sottile, angoli molto arrotondati. */
.newsletter {
  position: relative;
  display: grid;
  overflow: hidden;
  border-radius: 28px;
  border: 1px solid var(--im-line);
  background:
    radial-gradient(80% 120% at 100% 0%, rgba(92, 200, 224, 0.24), transparent 60%),
    radial-gradient(80% 120% at 0% 100%, rgba(236, 145, 160, 0.26), transparent 60%),
    linear-gradient(135deg, #1a1650 0%, #0e1238 100%);
  box-shadow: 0 40px 90px -50px rgba(0, 0, 0, 0.9);
}

@media (min-width: 1024px) {
  .newsletter {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    border-radius: 32px;
  }
}

/* Mobile: l'illustrazione fa da testata e sfuma verso il testo. */
.newsletter__art {
  position: relative;
  aspect-ratio: 2 / 1;
  -webkit-mask-image: linear-gradient(180deg, #000 55%, transparent);
  mask-image: linear-gradient(180deg, #000 55%, transparent);
}

/* Desktop: occupa la colonna destra a tutta altezza e sfuma a sinistra. */
@media (min-width: 1024px) {
  .newsletter__art {
    order: 2;
    aspect-ratio: auto;
    min-height: 100%;
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 38%);
    mask-image: linear-gradient(90deg, transparent, #000 38%);
  }
}

.newsletter__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 40% 50%;
}

.newsletter__copy {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  margin-top: -36px;
  padding: 0 20px 24px;
}

@media (min-width: 1024px) {
  .newsletter__copy {
    margin-top: 0;
    padding: 56px 0 56px 56px;
  }
}

.newsletter__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  color: #2a0a14;
  background: linear-gradient(135deg, #fde4e8, var(--im-pink-strong));
  box-shadow:
    0 10px 24px -12px rgba(236, 145, 160, 0.9),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.newsletter__title {
  font-size: clamp(28px, 3.6vw, 48px);
}

.newsletter__lead {
  max-width: 560px;
  font-size: 15px;
  line-height: 1.6;
  color: var(--im-muted);
}

@media (min-width: 1024px) {
  .newsletter__lead {
    font-size: 16px;
  }
}

.newsletter__highlight {
  font-weight: 700;
  color: var(--im-pink);
}

/* Campo e bottone affiancati dai 640px, impilati sotto. */
.newsletter__form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 520px;
  margin-top: 6px;
}

@media (min-width: 640px) {
  .newsletter__form {
    flex-direction: row;
    align-items: flex-start;
  }
}

.newsletter__input {
  flex: 1 1 auto;
  min-width: 0;
}

.newsletter__input :deep(.jc-input) {
  min-height: 52px;
  border-radius: 999px;
  padding-inline: 20px;
}

.newsletter__cta {
  flex: none;
  min-height: 52px;
}

@media (min-width: 640px) {
  .newsletter__cta {
    width: auto;
    padding-inline: 26px;
  }
}

.newsletter__cta :deep(.subtitle-m) {
  display: inline-block;
}

.newsletter__cta :deep(.subtitle-m)::first-letter {
  text-transform: uppercase;
}
</style>
