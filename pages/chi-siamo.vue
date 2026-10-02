<template>
  <div class="about">
    <header class="im-container about__hero">
      <p class="im-eyebrow">
        <span class="about__pulse" aria-hidden="true"></span>
        {{ t("layout.footer.links.about") }}
      </p>
      <h1 class="im-display about__title">
        <span class="im-gradient-text">{{ t("brand.name") }}</span>
      </h1>
      <p class="im-lead about__lead">{{ t("home.immersive.hero.lead") }}</p>
    </header>

    <div class="im-container about__grid">
      <div v-reveal class="about__form">
        <OrganismsModuloContatto />
      </div>

      <aside v-reveal="120" class="about__side">
        <div class="about__ball" aria-hidden="true">
          <img :src="logo" alt="" />
        </div>
        <ul class="about__facts">
          <li v-for="fact in facts" :key="fact.key" class="about__fact">
            <span class="about__fact-icon" aria-hidden="true">
              <Icon :name="fact.icon" size="18" />
            </span>
            <span>{{ fact.text }}</span>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import logo from "~/assets/logo/logo_new.png";

const { t } = useI18n();

// Accanto al modulo, le stesse garanzie della hero in home.
const facts = computed(() => [
  {
    key: "shipping",
    icon: "heroicons:truck-20-solid",
    text: t("home.immersive.hero.trust.shipping"),
  },
  {
    key: "payments",
    icon: "heroicons:lock-closed-20-solid",
    text: t("home.immersive.hero.trust.payments"),
  },
  {
    key: "marketplaces",
    icon: "heroicons:building-storefront-20-solid",
    text: t("home.immersive.hero.trust.marketplaces"),
  },
]);
</script>

<style scoped>
.about {
  padding-bottom: 96px;
}

.about__hero {
  padding-top: 48px;
  padding-bottom: 32px;
}

@media (min-width: 1024px) {
  .about__hero {
    padding-top: 72px;
    padding-bottom: 48px;
  }
}

/* Puntino acceso accanto all'eyebrow, come nella home. */
.about__pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--im-pink-strong);
  box-shadow: 0 0 0 4px rgba(236, 145, 160, 0.18);
}

.about__title {
  margin-top: 14px;
  font-size: clamp(36px, 7vw, 76px);
}

.about__title span {
  font-family: inherit;
}

.about__lead {
  max-width: 62ch;
  margin-top: 18px;
}

.about__grid {
  display: grid;
  gap: 24px;
  align-items: start;
}

@media (min-width: 1024px) {
  .about__grid {
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    gap: 32px;
  }
}

.about__form {
  min-width: 0;
}

.about__side {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  overflow: hidden;
  padding: 32px 20px;
  border-radius: 24px;
  border: 1px solid var(--im-line);
  background:
    radial-gradient(60% 50% at 50% 0%, rgba(236, 145, 160, 0.2), transparent 70%),
    radial-gradient(60% 50% at 50% 100%, rgba(92, 200, 224, 0.1), transparent 70%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
}

@media (min-width: 1024px) {
  .about__side {
    position: sticky;
    top: 120px;
    padding: 40px 32px;
  }
}

.about__ball {
  width: 128px;
  height: 128px;
  animation: about-float 4s ease-in-out infinite;
}

.about__ball img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 20px 30px rgba(236, 145, 160, 0.4));
}

.about__facts {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.about__fact {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.03);
  font-size: 15px;
  line-height: 1.4;
  color: var(--im-ink);
}

.about__fact-icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  color: #2a0a14;
  background: linear-gradient(135deg, #fde4e8, var(--im-pink-strong));
}

@keyframes about-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(-4deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .about__ball {
    animation: none;
  }
}
</style>
