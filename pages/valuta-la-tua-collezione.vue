<template>
  <div class="book">
    <header class="im-container book__hero">
      <p class="im-eyebrow">
        <span class="book__pulse" aria-hidden="true"></span>
        {{ t("home.immersive.sell.kicker") }}
      </p>
      <h1 class="im-display book__title">{{ t("home.immersive.sell.title") }}</h1>
      <p class="im-lead book__lead">{{ t("home.immersive.sell.lead") }}</p>
      <NuxtLink to="/regolamento-vendita-collezione" class="im-btn im-btn--ghost book__rules">
        <Icon name="heroicons:document-text-20-solid" size="18" />
        {{ t("home.immersive.sell.rules") }}
      </NuxtLink>
    </header>

    <div class="im-container">
      <section v-reveal class="book__card">
        <div class="book__head">
          <span class="book__badge" aria-hidden="true">
            <Icon name="heroicons:calendar-days-20-solid" size="20" />
          </span>
          <h2 class="book__card-title">{{ t("home.immersive.sell.cta") }}</h2>
        </div>
        <!-- Il calendario è un servizio esterno (sfondo chiaro): sta in una
             cornice arrotondata, come lo schermo di un dispositivo. -->
        <div class="book__frame">
          <iframe
            title="Valuta la tua Collezione"
            src="https://koalendar.com/e/valuta-la-tua-collezione?embed=true"
            width="100%"
            height="800px"
          ></iframe>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>

<style scoped>
.book {
  padding-bottom: 96px;
}

.book__hero {
  padding-top: 48px;
  padding-bottom: 32px;
}

@media (min-width: 1024px) {
  .book__hero {
    padding-top: 72px;
    padding-bottom: 48px;
  }
}

.book__pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--im-pink-strong);
  box-shadow: 0 0 0 4px rgba(236, 145, 160, 0.18);
}

.book__title {
  max-width: 18ch;
  margin-top: 14px;
  font-size: clamp(32px, 6vw, 68px);
  line-height: 1.02;
  overflow-wrap: break-word;
}

.book__lead {
  max-width: 60ch;
  margin-top: 18px;
}

.book__rules {
  margin-top: 26px;
}

.book__rules * {
  cursor: pointer;
}

.book__card {
  padding: 16px;
  border-radius: 28px;
  border: 1px solid var(--im-line);
  background:
    radial-gradient(70% 40% at 100% 0%, rgba(236, 145, 160, 0.14), transparent 70%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

@media (min-width: 768px) {
  .book__card {
    padding: 28px;
  }
}

.book__head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 4px 18px;
}

.book__badge {
  display: grid;
  flex: none;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  color: #2a0a14;
  background: linear-gradient(135deg, #fde4e8, var(--im-pink-strong));
}

.book__card-title {
  font-size: 20px;
  line-height: 1.25;
  color: var(--im-ink);
}

.book__frame {
  overflow: hidden;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: #fff;
  box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.8);
}

.book__frame iframe {
  display: block;
  border: 0;
}
</style>
