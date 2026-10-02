<template>
  <section
    class="hero"
    :style="parallaxStyle"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <div class="hero__bg" aria-hidden="true">
      <div class="hero__aurora hero__aurora--pink"></div>
      <div class="hero__aurora hero__aurora--teal"></div>
      <div class="hero__aurora hero__aurora--violet"></div>
      <div class="hero__stars"></div>
      <div class="hero__horizon"></div>
    </div>

    <div class="hero__marquee" :aria-label="t('home.immersive.hero.marqueeLabel')">
      <div class="hero__marquee-track">
        <template v-for="copy in 2" :key="copy">
          <span
            v-for="item in marqueeItems"
            :key="`${copy}-${item}`"
            class="hero__marquee-item"
            :aria-hidden="copy === 2 ? 'true' : undefined"
          >
            {{ item }}
          </span>
        </template>
      </div>
    </div>

    <div class="im-container hero__inner">
      <div class="hero__copy">
        <p class="im-eyebrow hero__eyebrow hero-in" style="--d: 0.05s">
          <span class="hero__live-dot" aria-hidden="true"></span>
          {{ gamesLabel }}
        </p>

        <h1 class="im-display hero__title">
          <span class="hero__line"><span class="hero-in-line" style="--d: 0.1s">{{ t("home.immersive.hero.titleLine1") }}</span></span>
          <span class="hero__line"><span class="hero-in-line" style="--d: 0.2s">{{ t("home.immersive.hero.titleLine2") }}</span></span>
          <span class="hero__line"><span class="hero-in-line im-gradient-text" style="--d: 0.3s">{{ t("home.immersive.hero.titleHighlight") }}</span></span>
        </h1>

        <p class="im-lead hero__lead hero-in" style="--d: 0.45s">
          {{ t("home.immersive.hero.lead") }}
        </p>

        <div class="hero__ctas hero-in" style="--d: 0.55s">
          <NuxtLink :to="shopUrl" class="im-btn im-btn--primary">
            {{ t("home.immersive.hero.ctaPrimary") }}
            <Icon name="heroicons:arrow-right-20-solid" size="20" />
          </NuxtLink>
          <a href="#apri-una-busta" class="im-btn im-btn--ghost">
            {{ t("home.immersive.hero.ctaSecondary") }}
            <Icon name="heroicons:sparkles-20-solid" size="18" />
          </a>
        </div>

        <ul class="hero__trust hero-in" style="--d: 0.65s">
          <li v-for="item in trustItems" :key="item">
            <Icon name="heroicons:check-badge-20-solid" size="18" class="hero__trust-icon" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>

      <div class="hero__stage">
        <div class="hero__glow" aria-hidden="true"></div>

        <div
          v-for="(card, index) in stageCards"
          :key="card.key"
          class="hero__card"
          :class="`hero__card--${slots[index]}`"
        >
          <div class="hero__card-float">
            <component
              :is="card.url ? NuxtLink : 'div'"
              :to="card.url"
              class="block"
              :aria-label="card.url ? card.name : undefined"
            >
              <AtomsHoloCard
                :front="slots[index] === 'main' ? card.imageLarge : card.image"
                :alt="card.name"
                :flipped="index >= revealed"
                :foil="slots[index] === 'main' ? 'rainbow' : 'holo'"
                :eager="slots[index] === 'main'"
                shimmer
              />
            </component>
          </div>
        </div>

        <NuxtLink
          v-if="latest?.url"
          :to="latest.url"
          class="hero__latest im-glass"
        >
          <img :src="latest.image" :alt="latest.name" class="hero__latest-thumb" />
          <span class="hero__latest-body">
            <span class="hero__latest-kicker">
              <span class="hero__live-dot" aria-hidden="true"></span>
              {{ t("home.immersive.hero.latestKicker") }}
            </span>
            <span class="hero__latest-name">{{ latest.name }}</span>
            <span class="hero__latest-meta">
              <span v-if="latest.expansion" class="truncate">{{ latest.expansion }}</span>
              <span v-if="latest.price" class="hero__latest-price">{{ latest.price }} €</span>
            </span>
          </span>
        </NuxtLink>

        <span
          v-for="n in 6"
          :key="n"
          class="hero__sparkle"
          :class="`hero__sparkle--${n}`"
          aria-hidden="true"
        ></span>
      </div>
    </div>

    <div class="im-container">
      <dl ref="statsRef" class="hero__stats">
        <div v-for="stat in stats" :key="stat.label" class="hero__stat">
          <dt class="hero__stat-label">{{ stat.label }}</dt>
          <dd class="im-display hero__stat-value">
            {{ stat.animated ? formatNumber(animatedValues[stat.key] ?? 0) : stat.value }}{{ stat.suffix }}
          </dd>
        </div>
      </dl>
    </div>

    <a href="#storia" class="hero__scroll" :aria-label="t('home.immersive.hero.scroll')">
      <span class="hero__scroll-line" aria-hidden="true"></span>
      <span class="hero__scroll-label">{{ t("home.immersive.hero.scroll") }}</span>
    </a>
  </section>
</template>

<script setup lang="ts">
import type { ShowcaseCard } from "~/types/showcaseCard.type";
import { withFallbackCards } from "~/utils/showcaseCards";

/**
 * Prima schermata della home: promessa, prove e azioni principali sopra la
 * piega, con tre carte vere del catalogo che fluttuano a destra.
 *
 * Mentre il catalogo carica le carte mostrano il dorso e poi si girano una
 * alla volta: l'attesa diventa parte dell'animazione invece di uno skeleton.
 */
const props = withDefaults(
  defineProps<{
    cards: ShowcaseCard[];
    latest?: ShowcaseCard | null;
    /** Categorie del negozio, per la riga sopra il titolo. */
    categories?: string[];
    totalProducts?: number | null;
    singlesCount?: number | null;
    loading?: boolean;
    shopUrl?: string;
  }>(),
  {
    latest: null,
    categories: () => [],
    totalProducts: null,
    singlesCount: null,
    loading: true,
    shopUrl: "/pokemon/all",
  },
);

const NuxtLink = resolveComponent("NuxtLink");
const { t, locale } = useI18n();

const slots = ["main", "left", "right"] as const;
const stageCards = computed(() => withFallbackCards(props.cards, 3));

const gamesLabel = computed(() =>
  [t("home.immersive.hero.eyebrow"), ...props.categories.slice(0, 3)].join(" · "),
);

const marqueeItems = computed(() => [
  t("home.immersive.hero.marquee.shipping"),
  t("home.immersive.hero.marquee.payments"),
  t("home.immersive.hero.marquee.sell"),
  t("home.immersive.hero.marquee.games"),
]);

const trustItems = computed(() => [
  t("home.immersive.hero.trust.shipping"),
  t("home.immersive.hero.trust.payments"),
  t("home.immersive.hero.trust.marketplaces"),
]);

/* ---- Carte che si girano a catalogo pronto ---- */
const revealed = ref(0);
let revealTimer: ReturnType<typeof setInterval> | null = null;

const startReveal = () => {
  if (revealTimer) return;
  revealTimer = setInterval(() => {
    revealed.value += 1;
    if (revealed.value >= slots.length && revealTimer) {
      clearInterval(revealTimer);
      revealTimer = null;
    }
  }, 220);
};

/* ---- Parallasse leggera sul puntatore ---- */
const pointer = reactive({ x: 0, y: 0 });
let frame = 0;

const parallaxStyle = computed(() => ({
  "--px": pointer.x.toFixed(3),
  "--py": pointer.y.toFixed(3),
}));

const onPointerMove = (event: PointerEvent) => {
  if (event.pointerType !== "mouse") return;
  const { clientX, clientY } = event;
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    pointer.x = (clientX / window.innerWidth - 0.5) * 2;
    pointer.y = (clientY / window.innerHeight - 0.5) * 2;
  });
};

const onPointerLeave = () => {
  pointer.x = 0;
  pointer.y = 0;
};

/* ---- Numeri che contano fino al valore ---- */
const statsRef = ref<HTMLElement | null>(null);
const animatedValues = reactive<Record<string, number>>({});
let statsObserver: IntersectionObserver | null = null;
let countFrame = 0;
let countStarted = false;

const stats = computed(() => {
  const list: {
    key: string;
    label: string;
    value?: string;
    suffix?: string;
    animated?: boolean;
    target?: number;
  }[] = [];

  // Arrotondati per difetto: "oltre 12.300" invecchia meglio di "12.347".
  const counted = (key: string, label: string, value: number | null) => {
    if (!value) return;
    const rounded = value > 1000 ? Math.floor(value / 100) * 100 : value;
    list.push({
      key,
      label,
      animated: true,
      target: rounded,
      suffix: value > rounded ? "+" : "",
    });
  };

  counted("products", t("home.immersive.hero.stats.products"), props.totalProducts);
  counted("singles", t("home.immersive.hero.stats.singles"), props.singlesCount);

  list.push(
    {
      key: "shipping",
      label: t("home.immersive.hero.stats.shipping"),
      value: t("home.immersive.hero.stats.shippingValue"),
    },
    {
      key: "payments",
      label: t("home.immersive.hero.stats.payments"),
      value: "100%",
    },
  );

  return list;
});

const formatNumber = (value: number) =>
  Math.round(value).toLocaleString(locale.value.startsWith("it") ? "it-IT" : "en-US");

const runCountUp = () => {
  countStarted = true;
  if (countFrame) cancelAnimationFrame(countFrame);
  const targets = stats.value.filter((stat) => stat.animated);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    targets.forEach((stat) => (animatedValues[stat.key] = stat.target ?? 0));
    return;
  }
  const start = performance.now();
  const duration = 1400;
  const tick = (now: number) => {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    targets.forEach((stat) => {
      animatedValues[stat.key] = (stat.target ?? 0) * eased;
    });
    if (progress < 1) countFrame = requestAnimationFrame(tick);
  };
  countFrame = requestAnimationFrame(tick);
};

watch(
  () => props.loading,
  (loading) => {
    if (!loading) startReveal();
  },
  { immediate: true },
);

// I totali arrivano dopo: se i numeri sono già partiti, si riallineano.
watch(
  () => [props.totalProducts, props.singlesCount],
  () => {
    if (countStarted) runCountUp();
  },
);

onMounted(() => {
  if (!props.loading) startReveal();
  if (!statsRef.value || typeof IntersectionObserver === "undefined") {
    runCountUp();
    return;
  }
  statsObserver = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      statsObserver?.disconnect();
      statsObserver = null;
      runCountUp();
    },
    { threshold: 0.4 },
  );
  statsObserver.observe(statsRef.value);
});

onBeforeUnmount(() => {
  if (revealTimer) clearInterval(revealTimer);
  if (frame) cancelAnimationFrame(frame);
  if (countFrame) cancelAnimationFrame(countFrame);
  statsObserver?.disconnect();
});
</script>

<style scoped>
.hero {
  --px: 0;
  --py: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: calc(100svh - 64px);
  padding-bottom: 72px;
  isolation: isolate;
  overflow: hidden;
  background:
    radial-gradient(120% 80% at 80% 0%, #1c1a5c 0%, transparent 55%),
    linear-gradient(180deg, #080b24 0%, #0d0b2b 60%, #120d33 100%);
}

@media (min-width: 1024px) {
  .hero {
    min-height: calc(100svh - 88px);
  }
}

/* ---------- Sfondo ---------- */
.hero__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}

.hero__aurora {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.55;
  animation: hero-aurora 18s ease-in-out infinite alternate;
}

.hero__aurora--pink {
  width: 46vw;
  height: 46vw;
  right: -8vw;
  top: -12vw;
  background: #ec91a0;
  opacity: 0.35;
}

.hero__aurora--teal {
  width: 34vw;
  height: 34vw;
  left: -10vw;
  bottom: -10vw;
  background: #1f8fae;
  animation-delay: -6s;
}

.hero__aurora--violet {
  width: 30vw;
  height: 30vw;
  right: 22vw;
  bottom: 0;
  background: #6d4bd8;
  opacity: 0.4;
  animation-delay: -11s;
}

.hero__stars {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 10% 20%, rgba(255, 255, 255, 0.8), transparent),
    radial-gradient(1px 1px at 30% 70%, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(1.5px 1.5px at 55% 15%, rgba(247, 210, 216, 0.9), transparent),
    radial-gradient(1px 1px at 75% 45%, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(1px 1px at 90% 80%, rgba(92, 200, 224, 0.8), transparent),
    radial-gradient(1px 1px at 45% 50%, rgba(255, 255, 255, 0.4), transparent);
  background-size: 420px 320px;
  opacity: 0.8;
  animation: hero-twinkle 5s ease-in-out infinite alternate;
}

/* Bagliore all'orizzonte: richiama il tramonto sulle nuvole del concept,
   ma nei colori del brand. */
.hero__horizon {
  position: absolute;
  left: -10%;
  right: -10%;
  bottom: -30%;
  height: 70%;
  background:
    radial-gradient(50% 60% at 70% 60%, rgba(255, 170, 120, 0.35), transparent 70%),
    radial-gradient(60% 50% at 40% 70%, rgba(236, 145, 160, 0.35), transparent 70%),
    radial-gradient(40% 40% at 85% 40%, rgba(167, 139, 250, 0.25), transparent 70%);
  filter: blur(30px);
}

/* ---------- Barra annunci ---------- */
.hero__marquee {
  position: relative;
  z-index: 2;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(90deg, #f7d2d8, #ec91a0 50%, #f7d2d8);
  color: #2a0a14;
}

.hero__marquee-track {
  display: flex;
  width: max-content;
  animation: hero-marquee 36s linear infinite;
}

.hero__marquee-item {
  display: inline-flex;
  align-items: center;
  gap: 28px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  color: #2a0a14;
}

.hero__marquee-item::after {
  content: "✦";
  opacity: 0.6;
}

/* ---------- Testo ---------- */
.hero__inner {
  position: relative;
  z-index: 1;
  display: grid;
  flex: 1;
  align-items: center;
  gap: 40px;
  padding-top: 48px;
}

@media (min-width: 1024px) {
  .hero__inner {
    grid-template-columns: minmax(0, 1.08fr) minmax(0, 1fr);
    gap: 24px;
    padding-top: 56px;
  }
}

.hero__live-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #5ee0a0;
  box-shadow: 0 0 0 0 rgba(94, 224, 160, 0.6);
  animation: hero-live 2s ease-out infinite;
}

.hero__title {
  margin-top: 20px;
  font-size: clamp(40px, 6.4vw, 84px);
  line-height: 0.98;
}

.hero__line {
  display: block;
  overflow: hidden;
  padding-bottom: 0.08em;
}

.hero__line > span {
  display: inline-block;
}

.hero__lead {
  max-width: 520px;
  margin-top: 24px;
}

.hero__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.hero__trust {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 22px;
  margin-top: 28px;
  font-size: 14px;
  color: var(--im-muted);
}

.hero__trust li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.hero__trust-icon {
  color: var(--im-pink-strong);
}

/* ---------- Carte ---------- */
.hero__stage {
  position: relative;
  height: 380px;
  margin-inline: auto;
  width: 100%;
  max-width: 560px;
}

@media (min-width: 768px) {
  .hero__stage {
    height: 500px;
  }
}

@media (min-width: 1024px) {
  .hero__stage {
    height: min(620px, 64svh);
    max-width: none;
  }
}

.hero__glow {
  position: absolute;
  inset: 12% 14%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(236, 145, 160, 0.55) 0%,
    rgba(92, 200, 224, 0.2) 45%,
    transparent 70%
  );
  filter: blur(40px);
  transform: translate3d(calc(var(--px) * -10px), calc(var(--py) * -10px), 0);
}

.hero__card {
  position: absolute;
  animation: hero-card-in 1.1s cubic-bezier(0.2, 0.8, 0.2, 1) both;
  transition: translate 0.4s ease-out;
}

.hero__card--main {
  z-index: 3;
  width: 42%;
  left: 29%;
  top: 4%;
  rotate: -4deg;
  animation-delay: 0.35s;
  translate: calc(var(--px) * 22px) calc(var(--py) * 16px);
}

.hero__card--left {
  z-index: 2;
  width: 32%;
  left: 2%;
  top: 22%;
  rotate: -15deg;
  animation-delay: 0.5s;
  translate: calc(var(--px) * 10px) calc(var(--py) * 8px);
  filter: brightness(0.85);
}

.hero__card--right {
  z-index: 2;
  width: 32%;
  right: 1%;
  top: 30%;
  rotate: 13deg;
  animation-delay: 0.6s;
  translate: calc(var(--px) * 14px) calc(var(--py) * 10px);
  filter: brightness(0.85);
}

.hero__card-float {
  animation: hero-float 6s ease-in-out infinite;
}

.hero__card--left .hero__card-float {
  animation-delay: -2s;
}

.hero__card--right .hero__card-float {
  animation-delay: -4s;
}

.hero__latest {
  position: absolute;
  z-index: 4;
  left: 0;
  bottom: 2%;
  display: flex;
  align-items: center;
  gap: 12px;
  width: min(300px, 78%);
  padding: 10px 14px 10px 10px;
  border-radius: 18px;
  box-shadow: 0 20px 40px -18px rgba(0, 0, 0, 0.7);
  animation: hero-card-in 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.9s both;
  transition: transform 0.25s ease, border-color 0.25s ease;
}

.hero__latest:hover {
  transform: translateY(-3px);
  border-color: rgba(247, 210, 216, 0.5);
}

.hero__latest-thumb {
  width: 46px;
  height: 64px;
  flex: none;
  border-radius: 6px;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.08);
}

.hero__latest-body {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}

.hero__latest-kicker {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--im-pink);
}

.hero__latest-name {
  overflow: hidden;
  font-weight: 600;
  font-size: 15px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.hero__latest-meta {
  display: flex;
  gap: 8px;
  justify-content: space-between;
  font-size: 12px;
  color: var(--im-muted);
}

.hero__latest-price {
  flex: none;
  font-weight: 700;
  color: var(--im-ink);
}

.hero__sparkle {
  position: absolute;
  width: 14px;
  height: 14px;
  background: #fff;
  clip-path: polygon(50% 0, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0 50%, 40% 40%);
  opacity: 0;
  animation: hero-sparkle 3.6s ease-in-out infinite;
}

.hero__sparkle--1 { top: 6%; left: 22%; animation-delay: 0.2s; }
.hero__sparkle--2 { top: 18%; right: 8%; animation-delay: 1.1s; width: 10px; height: 10px; }
.hero__sparkle--3 { bottom: 26%; left: 6%; animation-delay: 2s; }
.hero__sparkle--4 { bottom: 12%; right: 20%; animation-delay: 2.7s; width: 18px; height: 18px; background: #f7d2d8; }
.hero__sparkle--5 { top: 44%; left: 48%; animation-delay: 1.6s; width: 9px; height: 9px; background: #5cc8e0; }
.hero__sparkle--6 { top: 2%; right: 30%; animation-delay: 3.1s; width: 11px; height: 11px; }

/* ---------- Numeri ---------- */
.hero__stats {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  margin-top: 40px;
  overflow: hidden;
  border: 1px solid var(--im-line);
  border-radius: 20px;
  background: var(--im-line);
}

@media (min-width: 768px) {
  .hero__stats {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.hero__stat {
  display: flex;
  flex-direction: column-reverse;
  gap: 6px;
  padding: 18px 20px;
  background: rgba(10, 12, 38, 0.85);
}

.hero__stat-value {
  font-size: clamp(24px, 3vw, 36px);
}

.hero__stat-label {
  font-size: 13px;
  color: var(--im-muted);
}

/* ---------- Invito allo scroll ---------- */
.hero__scroll {
  position: absolute;
  left: 50%;
  bottom: 16px;
  display: none;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transform: translateX(-50%);
  font-size: 11px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--im-muted);
}

@media (min-width: 1024px) and (min-height: 760px) {
  .hero__scroll {
    display: flex;
  }
}

.hero__scroll-line {
  position: relative;
  width: 1px;
  height: 36px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.15);
}

.hero__scroll-line::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent, var(--im-pink));
  animation: hero-scroll 2s ease-in-out infinite;
}

@keyframes hero-scroll {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(100%);
  }
}

/* ---------- Entrate ---------- */
.hero-in {
  animation: hero-rise 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) var(--d, 0s) both;
}

.hero-in-line {
  animation: hero-line 1s cubic-bezier(0.2, 0.8, 0.2, 1) var(--d, 0s) both;
}

@keyframes hero-rise {
  from {
    opacity: 0;
    transform: translateY(24px);
    filter: blur(6px);
  }
  to {
    opacity: 1;
    transform: none;
    filter: none;
  }
}

@keyframes hero-line {
  from {
    transform: translateY(110%);
  }
  to {
    transform: none;
  }
}

@keyframes hero-card-in {
  from {
    opacity: 0;
    transform: translateY(120px) scale(0.7);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes hero-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-14px);
  }
}

@keyframes hero-aurora {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(4vw, 3vw, 0) scale(1.15);
  }
}

@keyframes hero-twinkle {
  from {
    opacity: 0.5;
  }
  to {
    opacity: 0.9;
  }
}

@keyframes hero-marquee {
  to {
    transform: translateX(-50%);
  }
}

@keyframes hero-live {
  0% {
    box-shadow: 0 0 0 0 rgba(94, 224, 160, 0.6);
  }
  100% {
    box-shadow: 0 0 0 10px rgba(94, 224, 160, 0);
  }
}

@keyframes hero-sparkle {
  0%,
  100% {
    opacity: 0;
    transform: scale(0.4) rotate(0deg);
  }
  50% {
    opacity: 0.9;
    transform: scale(1) rotate(45deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-in,
  .hero-in-line,
  .hero__card,
  .hero__latest,
  .hero__card-float,
  .hero__aurora,
  .hero__stars,
  .hero__sparkle,
  .hero__marquee-track {
    animation: none;
  }

  .hero__card {
    translate: none;
  }
}
</style>
