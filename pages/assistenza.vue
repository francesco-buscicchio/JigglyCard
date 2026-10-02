<template>
  <div class="support">
    <header class="im-container support__hero">
      <p class="im-eyebrow">
        <span class="support__pulse" aria-hidden="true"></span>
        {{ t("home.service.support.title") }}
      </p>
      <h1 class="im-display support__title">
        {{ t("forms.support.title") }}
      </h1>
      <p class="im-lead support__lead">
        {{ t("forms.support.mail") }}
        <!-- link mailto -->
        <a :href="`mailto:${email}`" class="support__chip">
          <Icon name="heroicons:envelope-20-solid" size="16" />
          {{ email }}
        </a>
        {{ t("forms.support.message") }}
        <!-- link tel -->
        <a :href="`tel:${phoneNumber}`" class="support__chip">
          <Icon name="heroicons:phone-20-solid" size="16" />
          {{ phoneNumber }} </a
        >.
      </p>
    </header>

    <div class="im-container">
      <section v-reveal class="support__card">
        <div class="support__card-head">
          <span class="support__badge" aria-hidden="true">
            <Icon name="heroicons:chat-bubble-left-right-20-solid" size="20" />
          </span>
          <p class="support__intro">{{ t("forms.support.form") }}</p>
        </div>
        <div class="support__rule" aria-hidden="true"></div>
        <OrganismsSupportForm @updateFormValues="updateFormData" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { email, phoneNumber } from "~/data/const";
const { t } = useI18n();
</script>

<style scoped>
.support {
  padding-bottom: 96px;
}

.support__hero {
  padding-top: 48px;
  padding-bottom: 32px;
}

@media (min-width: 1024px) {
  .support__hero {
    padding-top: 72px;
    padding-bottom: 48px;
  }
}

.support__pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #5ee0a0;
  box-shadow: 0 0 0 4px rgba(94, 224, 160, 0.18);
}

.support__title {
  margin-top: 14px;
  font-size: clamp(36px, 7vw, 76px);
}

.support__lead {
  max-width: 62ch;
  margin-top: 18px;
  line-height: 2;
}

/* Email e telefono come pillole: si toccano bene anche da telefono. */
.support__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  padding: 2px 12px;
  border-radius: 999px;
  border: 1px solid rgba(247, 210, 216, 0.35);
  background: rgba(247, 210, 216, 0.08);
  font-weight: 600;
  line-height: 1.6;
  color: var(--im-pink);
  overflow-wrap: anywhere;
  vertical-align: baseline;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.support__chip,
.support__chip * {
  cursor: pointer;
}

.support__chip:hover {
  border-color: var(--im-pink);
  background: rgba(247, 210, 216, 0.16);
  color: var(--im-ink);
}

.support__chip:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
}

.support__card {
  max-width: 820px;
  padding: 24px 20px;
  border-radius: 24px;
  border: 1px solid var(--im-line);
  background:
    radial-gradient(70% 60% at 100% 0%, rgba(236, 145, 160, 0.12), transparent 70%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

@media (min-width: 768px) {
  .support__card {
    padding: 36px;
  }
}

.support__card-head {
  display: flex;
  align-items: center;
  gap: 14px;
}

.support__badge {
  display: grid;
  flex: none;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  color: #2a0a14;
  background: linear-gradient(135deg, #fde4e8, var(--im-pink-strong));
}

.support__intro {
  color: var(--im-ink);
}

/* Filo sfumato rosa → petrolio, lo stesso sotto l'header. */
.support__rule {
  height: 1px;
  margin: 22px 0 26px;
  background: linear-gradient(
    90deg,
    rgba(247, 210, 216, 0.5),
    rgba(92, 200, 224, 0.4) 60%,
    transparent
  );
}

@media (prefers-reduced-motion: reduce) {
  .support__chip {
    transition: none;
  }
}
</style>
