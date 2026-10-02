<template>
  <section class="sell" :aria-labelledby="titleId">
    <div class="im-container">
      <div v-reveal class="sell__panel">
        <div class="sell__cards" aria-hidden="true">
          <span v-for="n in 5" :key="n" class="sell__card" :style="{ '--n': n }">
            <img :src="cardBack" alt="" />
          </span>
        </div>

        <div class="sell__copy">
          <p class="im-eyebrow">{{ t("home.immersive.sell.kicker") }}</p>
          <h2 :id="titleId" class="im-display sell__title">
            {{ t("home.immersive.sell.title") }}
          </h2>
          <p class="im-lead sell__lead">{{ t("home.immersive.sell.lead") }}</p>
          <div class="sell__ctas">
            <NuxtLink to="/valuta-la-tua-collezione" class="im-btn im-btn--primary">
              {{ t("home.immersive.sell.cta") }}
              <Icon name="heroicons:calendar-days-20-solid" size="20" />
            </NuxtLink>
            <NuxtLink to="/regolamento-vendita-collezione" class="im-btn im-btn--ghost">
              {{ t("home.immersive.sell.rules") }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <ul class="sell__services">
        <li
          v-for="(service, index) in services"
          :key="service.key"
          v-reveal="index * 80"
          class="sell__service im-glass"
        >
          <span class="sell__service-icon">
            <Icon :name="service.icon" size="22" />
          </span>
          <span class="sell__service-title">{{ service.title }}</span>
          <span class="sell__service-text">{{ service.text }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import cardBack from "~/assets/img/default-card-image.png";

/**
 * Chiusura della home: l'altro lato del negozio (compriamo collezioni) e le
 * garanzie di servizio, con gli stessi testi del vecchio banner servizi.
 */
const { t } = useI18n();
const titleId = useId();

const services = computed(() => [
  {
    key: "shipping",
    icon: "heroicons:truck-20-solid",
    title: t("home.service.fastShipping.title"),
    text: t("home.service.fastShipping.description"),
  },
  {
    key: "support",
    icon: "heroicons:chat-bubble-left-right-20-solid",
    title: t("home.service.support.title"),
    text: t("home.service.support.description"),
  },
  {
    key: "prices",
    icon: "heroicons:tag-20-solid",
    title: t("home.service.prices.title"),
    text: t("home.service.prices.description"),
  },
  {
    key: "security",
    icon: "heroicons:lock-closed-20-solid",
    title: t("home.service.security.title"),
    text: t("home.service.security.description"),
  },
]);
</script>

<style scoped>
.sell {
  position: relative;
  padding: 40px 0 120px;
  background: linear-gradient(180deg, #120d33 0%, #070a1f 100%);
}

.sell__panel {
  position: relative;
  display: grid;
  gap: 32px;
  overflow: hidden;
  padding: 40px 24px;
  border-radius: 32px;
  background:
    radial-gradient(80% 120% at 100% 0%, rgba(92, 200, 224, 0.28), transparent 60%),
    radial-gradient(80% 120% at 0% 100%, rgba(236, 145, 160, 0.3), transparent 60%),
    linear-gradient(135deg, #1a1650 0%, #0e1238 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@media (min-width: 1024px) {
  .sell__panel {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    align-items: center;
    padding: 64px;
  }
}

.sell__cards {
  position: relative;
  height: 220px;
}

@media (min-width: 1024px) {
  .sell__cards {
    order: 2;
    height: 300px;
  }
}

.sell__card {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  aspect-ratio: 63 / 88;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 20px 40px -14px rgba(0, 0, 0, 0.7);
  transform: translate(-50%, -50%) rotate(calc((var(--n) - 3) * 9deg))
    translateX(calc((var(--n) - 3) * 38px));
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@media (min-width: 1024px) {
  .sell__card {
    width: 160px;
  }
}

.sell__panel:hover .sell__card {
  transform: translate(-50%, -54%) rotate(calc((var(--n) - 3) * 13deg))
    translateX(calc((var(--n) - 3) * 52px));
}

.sell__card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sell__title {
  margin-top: 14px;
  font-size: clamp(30px, 4vw, 52px);
}

.sell__lead {
  max-width: 520px;
  margin-top: 16px;
}

.sell__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.sell__services {
  display: grid;
  gap: 14px;
  margin-top: 28px;
}

@media (min-width: 640px) {
  .sell__services {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .sell__services {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.sell__service {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 22px;
  border-radius: 20px;
}

.sell__service-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  color: #2a0a14;
  background: linear-gradient(135deg, #fde4e8, var(--im-pink-strong));
}

.sell__service-title {
  margin-top: 6px;
  font-weight: 700;
  font-size: 16px;
}

.sell__service-text {
  font-size: 14px;
  line-height: 1.5;
  color: var(--im-muted);
}

@media (prefers-reduced-motion: reduce) {
  .sell__card {
    transition: none;
  }
}
</style>
