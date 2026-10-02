<template>
  <section id="storia" ref="sectionRef" class="story" :aria-label="t('home.immersive.story.label')">
    <div class="story__sticky">
      <div class="story__bg" aria-hidden="true">
        <div
          v-for="(chapter, index) in chapters"
          :key="chapter.key"
          class="story__bg-layer"
          :class="`story__bg-layer--${chapter.key}`"
          :style="{ opacity: activeChapter === index ? 1 : 0 }"
        ></div>
      </div>

      <div class="im-container story__grid">
        <div class="story__texts">
          <article
            v-for="(chapter, index) in chapters"
            :key="chapter.key"
            class="story__chapter"
            :class="{
              'is-active': activeChapter === index,
              'is-past': activeChapter > index,
            }"
          >
            <p class="im-eyebrow">
              {{ String(index + 1).padStart(3, "0") }} / {{ String(chapters.length).padStart(3, "0") }} ·
              {{ chapter.kicker }}
            </p>
            <h2 class="im-display story__title">
              <span v-for="line in chapter.title" :key="line" class="block">{{ line }}</span>
            </h2>
            <p class="im-lead story__text">{{ chapter.text }}</p>

            <NuxtLink
              v-if="chapter.cta"
              :to="chapter.cta.to"
              class="im-btn im-btn--primary story__cta"
              :tabindex="activeChapter === index ? 0 : -1"
            >
              {{ chapter.cta.label }}
              <Icon name="heroicons:arrow-right-20-solid" size="20" />
            </NuxtLink>
          </article>

          <div class="story__progress" aria-hidden="true">
            <span
              v-for="(chapter, index) in chapters"
              :key="chapter.key"
              class="story__progress-bar"
            >
              <span :style="{ transform: `scaleX(${chapterFill(index)})` }"></span>
            </span>
          </div>
        </div>

        <div class="story__stage" aria-hidden="true">
          <div class="story__halo" :style="haloStyle"></div>

          <div class="story__pack" :class="{ 'story__pack--real': pack }" :style="packStyle">
            <AtomsProductPack
              v-if="pack"
              :image="pack.image"
              :alt="pack.name"
              :tear-progress="tear"
            />
            <AtomsBoosterPack
              v-else
              :art="packArt"
              :title="packTitle"
              :subtitle="t('home.immersive.story.packSubtitle')"
              :tear-progress="tear"
            />
          </div>

          <div
            v-for="(card, index) in commons"
            :key="card.key"
            class="story__card"
            :style="commonStyle(index)"
          >
            <AtomsHoloCard
              :front="card.image"
              :alt="card.name"
              :foil="index === 2 ? 'reverse' : 'none'"
              :interactive="false"
            />
          </div>

          <div class="story__card story__card--hit" :style="hitStyle">
            <AtomsHoloCard
              :front="hit.imageLarge"
              :alt="hit.name"
              :flipped="hitFlipped"
              foil="rainbow"
              :interactive="activeChapter >= 2"
              shimmer
            />
            <div class="story__sleeve" :style="sleeveStyle"></div>
            <div class="story__toploader" :style="toploaderStyle">
              <span class="story__toploader-lip"></span>
            </div>
            <div class="story__badge im-glass" :style="badgeStyle">
              <Icon name="heroicons:shield-check-20-solid" size="18" />
              {{ t("home.immersive.story.badge") }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ShowcaseCard } from "~/types/showcaseCard.type";
import type { BoosterPack } from "~/types/boosterPack.type";
import { byPullValue, withFallbackCards } from "~/utils/showcaseCards";
import {
  easeOutCubic,
  lerp,
  scrollSegment,
  useScrollProgress,
} from "~/composables/useScrollProgress";

/**
 * Il racconto dell'apertura di una busta, scandito dallo scroll: la sezione è
 * alta diversi schermi e il palco resta fermo (sticky) mentre `progress`
 * avanza da 0 a 1. Ogni capitolo occupa un tratto di quell'intervallo.
 *
 * Se c'è una busta in vendita con abbastanza carte del suo set, il racconto
 * è tutto suo: la busta vera, le carte più comuni del set nel ventaglio e la
 * più rara come "hit". Altrimenti si ripiega sulle carte della vetrina.
 */
const props = withDefaults(
  defineProps<{
    packArt?: string;
    packTitle?: string;
    cards: ShowcaseCard[];
    hitCard?: ShowcaseCard | null;
    /** Busta reale e carte del suo set: se bastano, hanno la precedenza. */
    pack?: BoosterPack | null;
    packCards?: ShowcaseCard[];
    singlesUrl?: string;
  }>(),
  {
    packArt: "",
    packTitle: "",
    hitCard: null,
    pack: null,
    packCards: () => [],
    singlesUrl: "/pokemon/all",
  },
);

const { t } = useI18n();
const sectionRef = ref<HTMLElement | null>(null);
const progress = useScrollProgress(sectionRef);

/** Carte del set della busta, dalla più ambita alla più comune. */
const packRanked = computed(() =>
  props.pack && props.packCards.length >= 5
    ? [...props.packCards].sort(byPullValue)
    : [],
);

const hit = computed(
  () => packRanked.value[0] ?? props.hitCard ?? withFallbackCards([], 1)[0],
);
const commons = computed(() =>
  packRanked.value.length
    ? packRanked.value.slice(-4)
    : withFallbackCards(props.cards, 4, [hit.value.key]),
);

const packTitle = computed(
  () => props.packTitle || t("home.immersive.story.packTitleFallback"),
);

const chapters = computed(() => [
  {
    key: "pack",
    kicker: t("home.immersive.story.pack.kicker"),
    title: [t("home.immersive.story.pack.title1"), t("home.immersive.story.pack.title2")],
    text: t("home.immersive.story.pack.text"),
    cta: null,
  },
  {
    key: "fan",
    kicker: t("home.immersive.story.fan.kicker"),
    title: [t("home.immersive.story.fan.title1"), t("home.immersive.story.fan.title2")],
    text: t("home.immersive.story.fan.text"),
    cta: null,
  },
  {
    key: "hit",
    kicker: t("home.immersive.story.hit.kicker"),
    title: [t("home.immersive.story.hit.title1"), t("home.immersive.story.hit.title2")],
    text: t("home.immersive.story.hit.text"),
    cta: null,
  },
  {
    key: "safe",
    kicker: t("home.immersive.story.safe.kicker"),
    title: [t("home.immersive.story.safe.title1"), t("home.immersive.story.safe.title2")],
    text: t("home.immersive.story.safe.text"),
    cta: { to: props.singlesUrl, label: t("home.immersive.story.safe.cta") },
  },
]);

/** Inizio di ogni capitolo dentro `progress`. */
const CHAPTER_STARTS = [0, 0.26, 0.52, 0.76];

const activeChapter = computed(() => {
  let current = 0;
  CHAPTER_STARTS.forEach((start, index) => {
    if (progress.value >= start) current = index;
  });
  return current;
});

const chapterFill = (index: number) => {
  const start = CHAPTER_STARTS[index];
  const end = CHAPTER_STARTS[index + 1] ?? 1;
  return scrollSegment(progress.value, start, end);
};

/* ---- Fasi dell'animazione ---- */
const tear = computed(() => easeOutCubic(scrollSegment(progress.value, 0.18, 0.3)));
const rise = computed(() => easeOutCubic(scrollSegment(progress.value, 0.26, 0.38)));
const packDrop = computed(() => scrollSegment(progress.value, 0.32, 0.44));
const fan = computed(() => easeOutCubic(scrollSegment(progress.value, 0.36, 0.5)));
const exit = computed(() => easeOutCubic(scrollSegment(progress.value, 0.52, 0.62)));
const focus = computed(() => easeOutCubic(scrollSegment(progress.value, 0.52, 0.64)));
const sleeve = computed(() => easeOutCubic(scrollSegment(progress.value, 0.78, 0.86)));
const toploader = computed(() => easeOutCubic(scrollSegment(progress.value, 0.84, 0.93)));

const hitFlipped = computed(() => progress.value < 0.6);

/* Ventaglio: quattro comuni e, sopra, la hit ancora coperta. */
const FAN_ANGLES = [-26, -13, 0, 13, 26];
const FAN_X = [-92, -46, 0, 46, 92];
const FAN_ARC = [18, 5, 0, 5, 18];

const fanTransform = (index: number) => {
  const angle = lerp(0, FAN_ANGLES[index], fan.value);
  const x = lerp(0, FAN_X[index], fan.value);
  const y = lerp(30, -10, rise.value) + lerp(0, FAN_ARC[index], fan.value);
  return { angle, x, y };
};

const packStyle = computed(() => {
  // La busta oscilla appena, poi scende e sparisce mentre escono le carte.
  const sway = Math.sin(progress.value * Math.PI * 6) * (1 - tear.value) * 4;
  return {
    transform: `translate(-50%, calc(-50% + ${packDrop.value * 70}%)) rotate(${sway}deg) scale(${lerp(1, 0.9, packDrop.value)})`,
    opacity: String(1 - packDrop.value),
  };
});

const commonStyle = (index: number) => {
  const { angle, x, y } = fanTransform(index);
  const direction = index < 2 ? -1 : 1;
  const exitX = exit.value * direction * 160;
  return {
    transform: `translate(calc(-50% + ${x + exitX}%), calc(-50% + ${y}%)) rotate(${angle + exit.value * direction * 20}deg)`,
    opacity: String(rise.value > 0 ? 1 - exit.value : 0),
    zIndex: String(index + 1),
  };
};

const hitStyle = computed(() => {
  const { angle, x, y } = fanTransform(4);
  const scale = lerp(1, 1.6, focus.value) - sleeve.value * 0.12;
  return {
    transform: `translate(calc(-50% + ${lerp(x, 0, focus.value)}%), calc(-50% + ${lerp(y, 0, focus.value)}%)) rotate(${lerp(angle, 0, focus.value)}deg) scale(${scale})`,
    opacity: String(rise.value > 0 ? 1 : 0),
  };
});

const sleeveStyle = computed(() => ({
  transform: `translateY(${lerp(-130, 0, sleeve.value)}%)`,
  opacity: String(sleeve.value),
}));

const toploaderStyle = computed(() => ({
  transform: `translateY(${lerp(-150, 0, toploader.value)}%)`,
  opacity: String(toploader.value),
}));

const badgeStyle = computed(() => {
  const appear = scrollSegment(progress.value, 0.9, 0.96);
  return {
    transform: `translate(-50%, ${lerp(20, 0, appear)}px)`,
    opacity: String(appear),
  };
});

const haloStyle = computed(() => ({
  opacity: String(0.5 + focus.value * 0.5),
  transform: `translate(-50%, -50%) scale(${lerp(0.8, 1.25, focus.value)})`,
}));
</script>

<style scoped>
.story {
  position: relative;
  height: 460vh;
  background: #0b0b2a;
}

.story__sticky {
  position: sticky;
  top: 0;
  height: 100svh;
  overflow: hidden;
}

.story__bg,
.story__bg-layer {
  position: absolute;
  inset: 0;
}

.story__bg-layer {
  transition: opacity 0.9s ease;
}

.story__bg-layer--pack {
  background: radial-gradient(70% 70% at 70% 50%, #2a1f6e 0%, #0b0b2a 70%);
}

.story__bg-layer--fan {
  background: radial-gradient(70% 70% at 70% 50%, #11406a 0%, #081430 70%);
}

.story__bg-layer--hit {
  background: radial-gradient(70% 70% at 70% 50%, #5a2350 0%, #170b2a 70%);
}

.story__bg-layer--safe {
  background: radial-gradient(70% 70% at 70% 50%, #1b2c5e 0%, #070a1f 70%);
}

.story__grid {
  position: relative;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  height: 100%;
  padding-top: 72px;
  padding-bottom: 24px;
}

@media (min-width: 1024px) {
  .story__grid {
    grid-template-rows: none;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: center;
    padding-top: 88px;
  }
}

/* ---------- Testi ---------- */
.story__texts {
  position: relative;
  display: grid;
  min-height: 210px;
}

@media (min-width: 1024px) {
  .story__texts {
    min-height: 420px;
    align-content: center;
  }
}

.story__chapter {
  grid-area: 1 / 1;
  align-self: start;
  opacity: 0;
  transform: translateY(40px);
  filter: blur(10px);
  pointer-events: none;
  transition:
    opacity 0.6s ease,
    transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1),
    filter 0.6s ease;
}

@media (min-width: 1024px) {
  .story__chapter {
    align-self: center;
  }
}

.story__chapter.is-past {
  transform: translateY(-40px);
}

.story__chapter.is-active {
  opacity: 1;
  transform: none;
  filter: none;
  pointer-events: auto;
}

.story__title {
  margin-top: 14px;
  font-size: clamp(30px, 4.6vw, 64px);
}

.story__text {
  max-width: 460px;
  margin-top: 16px;
  font-size: 15px;
}

@media (min-width: 1024px) {
  .story__text {
    font-size: 18px;
  }
}

.story__cta {
  margin-top: 24px;
}

.story__progress {
  position: absolute;
  left: 0;
  bottom: -8px;
  display: none;
  gap: 6px;
  width: 220px;
}

@media (min-width: 1024px) {
  .story__progress {
    display: flex;
    bottom: -40px;
  }
}

.story__progress-bar {
  position: relative;
  flex: 1;
  height: 3px;
  overflow: hidden;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.14);
}

.story__progress-bar > span {
  position: absolute;
  inset: 0;
  transform-origin: left;
  background: var(--im-pink);
}

/* ---------- Palco ---------- */
.story__stage {
  position: relative;
  height: 100%;
  min-height: 0;
}

.story__halo {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 70%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(247, 210, 216, 0.45) 0%,
    rgba(167, 139, 250, 0.18) 40%,
    transparent 70%
  );
  filter: blur(30px);
}

.story__pack,
.story__card {
  position: absolute;
  top: 50%;
  left: 50%;
  will-change: transform, opacity;
}

.story__pack {
  z-index: 10;
  width: min(34%, 30svh);
}

.story__card {
  width: min(28%, 22svh);
}

@media (min-width: 1024px) {
  .story__pack {
    width: min(38%, 34svh);
  }

  .story__card {
    width: min(30%, 26svh);
  }
}

.story__card--hit {
  z-index: 6;
}

.story__sleeve,
.story__toploader {
  position: absolute;
  pointer-events: none;
}

/* Bustina morbida: appena più grande della carta, lucida. */
.story__sleeve {
  inset: -2.5% -3%;
  border-radius: 5%;
  background: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0.28) 0%,
    rgba(255, 255, 255, 0.05) 30%,
    rgba(255, 255, 255, 0.02) 60%,
    rgba(255, 255, 255, 0.2) 100%
  );
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35);
}

/* Toploader rigido, con il labbro d'inserimento in alto. */
.story__toploader {
  inset: -9% -8% -6% -8%;
  border-radius: 4%;
  background: linear-gradient(
    135deg,
    rgba(210, 230, 255, 0.22) 0%,
    rgba(255, 255, 255, 0.04) 40%,
    rgba(210, 230, 255, 0.16) 100%
  );
  box-shadow:
    inset 0 0 0 2px rgba(220, 235, 255, 0.55),
    inset 0 0 24px rgba(255, 255, 255, 0.12),
    0 30px 60px -20px rgba(0, 0, 0, 0.6);
  backdrop-filter: brightness(1.05);
}

.story__toploader-lip {
  position: absolute;
  top: 2.5%;
  left: 38%;
  right: 38%;
  height: 3%;
  border-radius: 0 0 999px 999px;
  background: rgba(220, 235, 255, 0.5);
}

.story__badge {
  position: absolute;
  left: 50%;
  bottom: -26%;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  color: var(--im-ink);
  scale: 0.62;
}
</style>
