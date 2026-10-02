<template>
  <section class="showcase" :aria-labelledby="titleId">
    <div class="im-container">
      <header class="showcase__header">
        <div>
          <p v-reveal class="im-eyebrow">{{ t("home.immersive.showcase.kicker") }}</p>
          <h2 :id="titleId" v-reveal="80" class="im-display im-title showcase__title">
            {{ t("home.immersive.showcase.title") }}
          </h2>
        </div>

        <div v-reveal="160" class="showcase__tabs" role="tablist">
          <button
            v-for="(tab, index) in visibleTabs"
            :id="`${titleId}-tab-${tab.key}`"
            :key="tab.key"
            type="button"
            role="tab"
            class="showcase__tab"
            :class="{ 'is-selected': selected === index }"
            :aria-selected="selected === index"
            :aria-controls="`${titleId}-panel`"
            @click="select(index)"
          >
            {{ tab.label }}
            <span class="showcase__tab-count">{{ tab.cards.length }}</span>
          </button>
        </div>
      </header>

      <div class="showcase__rail-wrap">
        <ul
          :id="`${titleId}-panel`"
          ref="railRef"
          class="showcase__rail"
          role="tabpanel"
          :aria-labelledby="currentTab ? `${titleId}-tab-${currentTab.key}` : undefined"
        >
          <template v-if="loading">
            <li v-for="n in 5" :key="`skeleton-${n}`" class="showcase__item">
              <AtomsHoloCard flipped :interactive="false" foil="none" />
              <span class="showcase__skeleton"></span>
            </li>
          </template>

          <li
            v-for="(card, index) in currentTab?.cards ?? []"
            v-else
            :key="`${currentTab?.key}-${card.key}`"
            class="showcase__item showcase__item--in"
            :style="{ animationDelay: `${index * 60}ms` }"
          >
            <NuxtLink :to="card.url" class="showcase__link">
              <AtomsHoloCard
                :front="card.imageLarge"
                :alt="card.name"
                fit="contain"
                foil="holo"
              />
              <span class="showcase__info">
                <span v-if="card.expansion" class="showcase__expansion">{{ card.expansion }}</span>
                <span class="showcase__name">{{ card.name }}</span>
                <span class="showcase__row">
                  <span class="showcase__price">
                    <small>{{ t("home.immersive.showcase.from") }}</small>
                    {{ card.price }} €
                  </span>
                  <span class="showcase__go" aria-hidden="true">
                    <Icon name="heroicons:arrow-up-right-20-solid" size="18" />
                  </span>
                </span>
              </span>
            </NuxtLink>
          </li>
        </ul>

        <div class="showcase__controls">
          <button
            type="button"
            class="showcase__arrow"
            :aria-label="t('home.immersive.showcase.previous')"
            @click="scrollRail(-1)"
          >
            <Icon name="heroicons:arrow-left-20-solid" size="20" />
          </button>
          <button
            type="button"
            class="showcase__arrow"
            :aria-label="t('home.immersive.showcase.next')"
            @click="scrollRail(1)"
          >
            <Icon name="heroicons:arrow-right-20-solid" size="20" />
          </button>
          <NuxtLink :to="allUrl" class="im-btn im-btn--ghost showcase__all">
            {{ t("home.immersive.showcase.all") }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ShowcaseCard } from "~/types/showcaseCard.type";

/**
 * Le tre vetrine della vecchia home (in evidenza, novità, offerte) riunite in
 * una sola fila a schede: meno scroll, stesso contenuto.
 */
const props = withDefaults(
  defineProps<{
    tabs: { key: string; label: string; cards: ShowcaseCard[] }[];
    loading?: boolean;
    allUrl?: string;
  }>(),
  { loading: false, allUrl: "/pokemon/all" },
);

const { t } = useI18n();
const titleId = useId();
const selected = ref(0);
const railRef = ref<HTMLElement | null>(null);

const visibleTabs = computed(() =>
  props.loading ? props.tabs : props.tabs.filter((tab) => tab.cards.length),
);
const currentTab = computed(() => visibleTabs.value[selected.value]);

watch(visibleTabs, (tabs) => {
  if (selected.value >= tabs.length) selected.value = 0;
});

const select = (index: number) => {
  selected.value = index;
  railRef.value?.scrollTo({ left: 0, behavior: "smooth" });
};

const scrollRail = (direction: 1 | -1) => {
  const rail = railRef.value;
  if (!rail) return;
  rail.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: "smooth" });
};
</script>

<style scoped>
.showcase {
  position: relative;
  padding: 100px 0 110px;
  background:
    radial-gradient(60% 50% at 15% 10%, rgba(92, 200, 224, 0.12), transparent 70%),
    #0b0d2b;
}

.showcase__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 36px;
}

.showcase__title {
  margin-top: 14px;
}

.showcase__tabs {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.04);
}

.showcase__tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  color: var(--im-muted);
  transition: all 0.25s ease;
}

.showcase__tab:hover {
  color: var(--im-ink);
}

.showcase__tab.is-selected {
  color: #2a0a14;
  background: linear-gradient(135deg, #fde4e8, var(--im-pink-strong));
}

.showcase__tab-count {
  min-width: 22px;
  padding: 1px 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  font-size: 11px;
  text-align: center;
  color: inherit;
}

.showcase__tab.is-selected .showcase__tab-count {
  background: rgba(42, 10, 20, 0.12);
}

.showcase__rail {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  margin-inline: -20px;
  padding: 20px 20px 28px;
  scrollbar-width: none;
}

.showcase__rail::-webkit-scrollbar {
  display: none;
}

@media (min-width: 768px) {
  .showcase__rail {
    margin-inline: -40px;
    padding-inline: 40px;
  }
}

.showcase__item {
  flex: 0 0 62%;
  scroll-snap-align: start;
}

@media (min-width: 640px) {
  .showcase__item {
    flex-basis: 36%;
  }
}

@media (min-width: 1024px) {
  .showcase__item {
    flex-basis: calc((100% - 80px) / 5);
  }
}

.showcase__item--in {
  animation: showcase-in 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.showcase__link {
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
}

.showcase__link:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 6px;
  border-radius: 12px;
}

.showcase__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.showcase__expansion {
  overflow: hidden;
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--im-muted);
}

.showcase__name {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 2.6em;
  font-weight: 600;
  font-size: 15px;
  line-height: 1.3;
}

.showcase__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}

.showcase__price {
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-weight: 700;
  font-size: 18px;
}

.showcase__price small {
  margin-right: 2px;
  font-family: "Roboto Flex", sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: var(--im-muted);
}

.showcase__go {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--im-line);
  transition: all 0.25s ease;
}

.showcase__link:hover .showcase__go {
  border-color: transparent;
  color: #2a0a14;
  background: var(--im-pink);
  transform: rotate(45deg);
}

.showcase__skeleton {
  display: block;
  height: 54px;
  margin-top: 14px;
  border-radius: 10px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  background-size: 200% 100%;
  animation: showcase-skeleton 1.4s linear infinite;
}

.showcase__controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

.showcase__arrow {
  display: none;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid var(--im-line);
  color: var(--im-ink);
  transition: background-color 0.2s ease;
}

.showcase__arrow:hover {
  background: rgba(255, 255, 255, 0.08);
}

@media (min-width: 1024px) {
  .showcase__arrow {
    display: inline-flex;
  }
}

.showcase__all {
  margin-left: auto;
}

@keyframes showcase-in {
  from {
    opacity: 0;
    transform: translateY(30px) rotate(2deg);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes showcase-skeleton {
  to {
    background-position: -200% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .showcase__item--in,
  .showcase__skeleton {
    animation: none;
  }
}
</style>
