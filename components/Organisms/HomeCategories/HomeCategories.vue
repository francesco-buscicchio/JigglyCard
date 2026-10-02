<template>
  <section class="games" :aria-labelledby="titleId">
    <div class="im-container">
      <header class="games__header">
        <p v-reveal class="im-eyebrow">{{ t("home.immersive.categories.kicker") }}</p>
        <h2 :id="titleId" v-reveal="80" class="im-display im-title games__title">
          {{ t("home.immersive.categories.title") }}
        </h2>
        <p v-reveal="160" class="im-lead games__lead">
          {{ t("home.immersive.categories.lead") }}
        </p>
      </header>

      <ul class="games__list" @mouseleave="active = null">
        <li
          v-for="(category, index) in categories"
          :key="category.to"
          v-reveal="index * 70"
          class="games__item"
          :class="{ 'is-active': (active ?? 0) === index }"
          :style="theme(category.to, index)"
          @mouseenter="active = index"
          @focusin="active = index"
        >
          <NuxtLink :to="category.to" class="games__link">
            <span class="games__art" aria-hidden="true">
              <img
                v-if="category.image"
                :src="category.image"
                alt=""
                loading="lazy"
                class="games__image"
              />
              <span v-else class="games__monogram im-display">
                {{ category.label.slice(0, 1) }}
              </span>
            </span>

            <span class="games__body">
              <span v-if="category.products" class="games__count">
                {{ formatCount(category.products) }} {{ t("home.immersive.categories.products") }}
              </span>
              <span class="im-display games__name">{{ category.label }}</span>
              <span class="games__enter">
                {{ t("home.immersive.categories.enter") }}
                <Icon name="heroicons:arrow-right-20-solid" size="16" />
              </span>
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { HomeCategory } from "~/types/homeCategory.type";

/**
 * Le categorie del negozio come pannelli che si allargano al passaggio del
 * mouse. Su mobile diventano una fila scorrevole con tutti i pannelli aperti.
 */
defineProps<{ categories: HomeCategory[] }>();

const { t, locale } = useI18n();
const titleId = useId();
const active = ref<number | null>(null);

/** Un colore per tipo di prodotto, riconosciuto dallo slug della categoria. */
const THEMES: [string, [string, string]][] = [
  ["single", ["#f7a8bd", "#3a1d5c"]],
  ["booster", ["#f2c94c", "#2d4fbf"]],
  ["box", ["#e8574a", "#3a1712"]],
  ["blister", ["#5cc8e0", "#0f3550"]],
  ["deck", ["#ff9d3c", "#47200b"]],
  ["storage", ["#b693ff", "#1f1650"]],
];

const theme = (to: string, index: number) => {
  const [glow, base] =
    THEMES.find(([key]) => to.includes(key))?.[1] ??
    THEMES[index % THEMES.length][1];
  return { "--game-glow": glow, "--game-base": base };
};

const formatCount = (value: number) =>
  value.toLocaleString(locale.value.startsWith("it") ? "it-IT" : "en-US");
</script>

<style scoped>
.games {
  position: relative;
  padding: 120px 0 100px;
  background: linear-gradient(180deg, #070a1f 0%, #0b0d2b 100%);
}

.games__header {
  max-width: 720px;
  margin: 0 auto 48px;
  text-align: center;
}

.games__title {
  margin-top: 14px;
}

.games__lead {
  margin-top: 16px;
}

.games__list {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 8px;
  margin-inline: -20px;
  padding-inline: 20px;
  scrollbar-width: none;
}

.games__list::-webkit-scrollbar {
  display: none;
}

.games__item {
  flex: 0 0 78%;
  scroll-snap-align: center;
  height: 420px;
}

@media (min-width: 640px) {
  .games__item {
    flex-basis: 46%;
  }
}

@media (min-width: 1024px) {
  .games__list {
    overflow: visible;
    margin-inline: 0;
    padding-inline: 0;
  }

  .games__item {
    flex: 1 1 0;
    min-width: 0;
    height: 480px;
    transition: flex-grow 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .games__item.is-active {
    flex-grow: 2.8;
  }
}

.games__link {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background:
    radial-gradient(90% 60% at 50% 20%, color-mix(in srgb, var(--game-glow) 55%, transparent) 0%, transparent 70%),
    linear-gradient(180deg, var(--game-base) 0%, #090b22 100%);
  transition:
    border-color 0.3s ease,
    transform 0.3s ease;
}

.games__link:hover,
.games__link:focus-visible {
  border-color: color-mix(in srgb, var(--game-glow) 70%, transparent);
}

.games__link:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 3px;
}

.games__art {
  position: absolute;
  inset: 0 0 38% 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.games__image {
  max-height: 78%;
  max-width: 70%;
  border-radius: 10px;
  object-fit: contain;
  box-shadow: 0 30px 50px -20px rgba(0, 0, 0, 0.8);
  transform: rotate(-4deg) translateY(10px) scale(0.92);
  transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.games__item.is-active .games__image {
  transform: rotate(0deg) translateY(0) scale(1);
}

.games__monogram {
  font-size: 120px;
  color: color-mix(in srgb, var(--game-glow) 70%, white);
  opacity: 0.35;
}

.games__body {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 22px;
  background: linear-gradient(0deg, rgba(5, 6, 22, 0.85) 0%, transparent 100%);
}

.games__count {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--game-glow);
}

.games__name {
  font-size: clamp(22px, 2.2vw, 30px);
  line-height: 1.05;
}

.games__enter {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* Su mobile i pannelli sono tutti aperti: niente hover da aspettare. */
@media (max-width: 1023px) {
  .games__image {
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .games__item,
  .games__image {
    transition: none;
  }
}
</style>
