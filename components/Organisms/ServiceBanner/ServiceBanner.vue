<template>
  <section class="services">
    <!-- Le quattro garanzie del negozio in una griglia di vetro, come in
         fondo alla home (HomeSell): un solo markup, l'impaginazione la fa
         il CSS. -->
    <div class="im-container">
      <ul class="services__grid">
        <li
          v-for="(section, sectionIndex) in sections"
          :key="'section-' + sectionIndex"
          v-reveal="sectionIndex * 80"
          class="services__item"
        >
          <!-- Il sollevamento al passaggio sta qui e non sul <li>: lì la
               transizione di v-reveal lo rallenterebbe. -->
          <div class="services__card im-glass">
            <span v-if="section.imgUrl" class="services__icon" aria-hidden="true">
              <Icon :name="section.imgUrl" size="22" />
            </span>
            <p class="services__title">{{ section.title }}</p>
            <div class="services__text">
              <template v-if="Array.isArray(section.sections)">
                <template v-for="(item, index) in section.sections" :key="index">
                  <template v-if="typeof item === 'object'">
                    <a v-if="item.link" :href="item.link" class="services__link">{{ item.value }}</a>
                    <span v-else class="services__line">{{ item.value }}</span>
                  </template>
                  <span v-else class="services__line">{{ item }}</span>
                </template>
              </template>
              <span v-else class="services__line">{{ section.sections }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
// Stesse icone di HomeSell, così le garanzie sono riconoscibili ovunque.
const sections = [
  {
    title: t("home.service.fastShipping.title"),
    sections: [
      { value: t("home.service.fastShipping.description"), link: "" },
    ],
    imgUrl: "heroicons:truck-20-solid",
  },
  {
    title: t("home.service.prices.title"),
    sections: [t("home.service.prices.description")],
    imgUrl: "heroicons:tag-20-solid",
  },
  {
    title: t("home.service.security.title"),
    sections: [t("home.service.security.description")],
    imgUrl: "heroicons:lock-closed-20-solid",
  },
  {
    title: t("home.service.support.title"),
    sections: [t("home.service.support.description")],
    imgUrl: "heroicons:chat-bubble-left-right-20-solid",
  },
];
</script>

<style scoped>
.services {
  position: relative;
  padding: 40px 0 64px;
}

@media (min-width: 768px) {
  .services {
    padding: 72px 0 72px;
  }
}

/* Filo di luce in testa alla sezione. */
.services::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: min(720px, 80%);
  height: 1px;
  transform: translateX(-50%);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(247, 210, 216, 0.4) 30%,
    rgba(92, 200, 224, 0.4) 70%,
    transparent
  );
}

.services__grid {
  display: grid;
  gap: 12px;
}

@media (min-width: 640px) {
  .services__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }
}

@media (min-width: 1024px) {
  .services__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.services__item {
  display: flex;
}

/* Mobile: icona a sinistra e testo a destra, più compatto; dai 640px le
   card diventano verticali come in home. */
.services__card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  column-gap: 16px;
  row-gap: 4px;
  align-content: start;
  width: 100%;
  padding: 18px;
  border-radius: 20px;
  transition:
    transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.services__icon {
  grid-row: span 2;
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
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@media (min-width: 640px) {
  .services__card {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 8px;
    padding: 24px;
  }

  .services__icon {
    grid-row: auto;
    margin-bottom: 8px;
  }
}

.services__card:hover {
  transform: translateY(-4px);
  border-color: rgba(247, 210, 216, 0.35);
  box-shadow: 0 24px 50px -28px rgba(236, 145, 160, 0.55);
}

.services__card:hover .services__icon {
  transform: rotate(-6deg) scale(1.05);
}

.services__title {
  font-weight: 700;
  font-size: 16px;
  line-height: 1.35;
  color: var(--im-ink);
}

.services__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.services__line,
.services__link {
  font-size: 14px;
  line-height: 1.55;
  color: var(--im-muted);
}

.services__link {
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: rgba(247, 210, 216, 0.4);
  text-underline-offset: 3px;
}

.services__link:hover {
  color: var(--im-pink);
}

.services__link:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
  border-radius: 4px;
}

@media (prefers-reduced-motion: reduce) {
  .services__card,
  .services__icon {
    transition: none;
  }

  .services__card:hover,
  .services__card:hover .services__icon {
    transform: none;
  }
}
</style>
