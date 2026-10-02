<template>
  <section id="apri-una-busta" class="opening" :aria-labelledby="titleId">
    <div class="im-container opening__grid">
      <div class="opening__copy">
        <p v-reveal class="im-eyebrow">{{ t("home.immersive.opening.kicker") }}</p>
        <h2 :id="titleId" v-reveal="80" class="im-display im-title opening__title">
          <span class="block">{{ t("home.immersive.opening.title1") }}</span>
          <span class="block im-gradient-text">{{ t("home.immersive.opening.title2") }}</span>
        </h2>
        <p v-reveal="160" class="im-lead opening__lead">
          {{ t("home.immersive.opening.lead") }}
        </p>
        <ul v-reveal="240" class="opening__facts">
          <li v-for="fact in facts" :key="fact.label">
            <span class="im-display opening__fact-value">{{ fact.value }}</span>
            <span class="opening__fact-label">{{ fact.label }}</span>
          </li>
        </ul>
      </div>

      <div v-reveal="120" class="opening__stage im-glass">
        <p class="opening__status" aria-live="polite">{{ statusText }}</p>

        <Transition name="opening-pack">
          <button
            v-if="phase === 'idle' || phase === 'torn'"
            type="button"
            class="opening__pack"
            :aria-label="t('home.immersive.opening.tear')"
            :disabled="phase !== 'idle' || preparing"
            @click="tear"
          >
            <AtomsProductPack
              v-if="pack"
              :key="pack.key"
              :image="pack.image"
              :alt="pack.name"
              :torn="phase === 'torn'"
              :idle="phase === 'idle'"
            />
            <AtomsBoosterPack
              v-else
              :title="t('home.immersive.story.packTitleFallback')"
              :subtitle="t('home.immersive.opening.packSubtitle')"
              :torn="phase === 'torn'"
              :idle="phase === 'idle'"
            />
            <span class="opening__tap" aria-hidden="true">
              <Icon name="heroicons:hand-raised-20-solid" size="18" />
              {{ t("home.immersive.opening.tapHint") }}
            </span>
          </button>
        </Transition>

        <ul v-if="phase === 'dealt' || phase === 'done'" class="opening__cards">
          <li
            v-for="(card, index) in hand"
            :key="`${round}-${card.key}`"
            class="opening__card"
            :class="{
              'opening__card--hit': index === hand.length - 1,
              'is-open': opened[index],
            }"
            :style="{ animationDelay: `${index * 90}ms` }"
          >
            <button
              type="button"
              class="opening__card-btn"
              :aria-label="
                opened[index]
                  ? card.name
                  : t('home.immersive.opening.flip', { n: index + 1 })
              "
              @click="flip(index)"
            >
              <AtomsHoloCard
                :front="index === hand.length - 1 ? card.imageLarge : card.image"
                :alt="card.name"
                :flipped="!opened[index]"
                :foil="foilFor(card, index)"
                :interactive="opened[index]"
                :shimmer="index === hand.length - 1"
              />
            </button>
            <span v-if="opened[index] && card.rarity" class="opening__rarity">
              {{ card.rarity }}
            </span>
            <span
              v-if="index === hand.length - 1 && opened[index]"
              class="opening__burst"
              aria-hidden="true"
            >
              <span v-for="n in 10" :key="n" :style="{ '--i': n }"></span>
            </span>
          </li>
        </ul>

        <div class="opening__actions">
          <button
            v-if="phase === 'dealt'"
            type="button"
            class="im-btn im-btn--ghost"
            @click="revealAll"
          >
            {{ t("home.immersive.opening.revealAll") }}
          </button>

          <template v-if="phase === 'done'">
            <div class="opening__result">
              <span class="opening__result-kicker">{{ t("home.immersive.opening.yourHit") }}</span>
              <span class="opening__result-name">{{ hitCard?.name }}</span>
              <span v-if="hitCard?.price" class="opening__result-price">
                {{ hitCard.rarity }} · {{ hitCard.price }} €
              </span>
            </div>
            <div class="opening__result-ctas">
              <NuxtLink v-if="hitCard?.url" :to="hitCard.url" class="im-btn im-btn--primary">
                {{ t("home.immersive.opening.seeCard") }}
                <Icon name="heroicons:arrow-right-20-solid" size="20" />
              </NuxtLink>
              <NuxtLink v-if="pack" :to="pack.url" class="im-btn im-btn--ghost">
                <Icon name="heroicons:shopping-bag-20-solid" size="18" />
                {{ t("home.immersive.opening.buyPack", { price: pack.price }) }}
              </NuxtLink>
              <button type="button" class="im-btn im-btn--ghost" @click="reset">
                <Icon name="heroicons:arrow-path-20-solid" size="18" />
                {{ t("home.immersive.opening.again") }}
              </button>
            </div>
          </template>
        </div>

        <div v-if="phase === 'idle' && packs.length > 1" class="opening__picker">
          <p class="opening__picker-label">{{ t("home.immersive.opening.choosePack") }}</p>
          <ul class="opening__picker-list" role="radiogroup" :aria-label="t('home.immersive.opening.choosePack')">
            <li v-for="(item, index) in packs" :key="item.key">
              <button
                type="button"
                role="radio"
                class="opening__picker-item"
                :class="{ 'is-selected': index === selected }"
                :aria-checked="index === selected"
                @click="selectPack(index)"
              >
                <span class="opening__picker-thumb">
                  <img :src="item.image" :alt="''" loading="lazy" />
                </span>
                <span class="opening__picker-text">
                  <span class="opening__picker-name">{{ item.expansion }}</span>
                  <span class="opening__picker-meta">
                    {{ item.cardsInStock }} {{ t("home.immersive.opening.cardsShort") }} · {{ item.price }} €
                  </span>
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ShowcaseCard } from "~/types/showcaseCard.type";
import {
  FALLBACK_SHOWCASE_CARDS,
  drawPackHand,
  rarityRank,
} from "~/utils/showcaseCards";
import { PACK_HAND_SIZE, useBoosterPacks } from "~/composables/useBoosterPacks";

/**
 * Busta virtuale. Si sceglie una delle buste in vendita e dentro escono solo
 * carte singole del suo set che abbiamo a magazzino: ogni apertura è diversa
 * e ogni carta trovata è acquistabile davvero, come la busta stessa.
 *
 * Le buste le carica la pagina (`useBoosterPacks().loadPacks`); qui si
 * leggono dallo stato condiviso. Senza catalogo resta un'apertura d'esempio.
 */
const { t } = useI18n();
const titleId = useId();
const { packs, loadCards } = useBoosterPacks();

type Phase = "idle" | "torn" | "dealt" | "done";
const phase = ref<Phase>("idle");
const selected = ref(0);
const preparing = ref(false);
const hand = ref<ShowcaseCard[]>([]);
const opened = ref<boolean[]>([]);
const round = ref(0);
const timers: ReturnType<typeof setTimeout>[] = [];

const pack = computed(() => packs.value[selected.value] ?? null);
const hitCard = computed(() => hand.value[hand.value.length - 1]);

const facts = computed(() => [
  { value: String(PACK_HAND_SIZE), label: t("home.immersive.opening.facts.cards") },
  pack.value
    ? { value: String(pack.value.cardsInStock), label: t("home.immersive.opening.facts.set") }
    : { value: "1", label: t("home.immersive.opening.facts.hit") },
  { value: "0 €", label: t("home.immersive.opening.facts.price") },
]);

const statusText = computed(() => {
  if (phase.value === "idle") {
    return pack.value
      ? t("home.immersive.opening.status.idlePack", { name: pack.value.name })
      : t("home.immersive.opening.status.idle");
  }
  if (phase.value === "torn") return t("home.immersive.opening.status.torn");
  if (phase.value === "dealt") {
    const left = opened.value.filter((open) => !open).length;
    return t("home.immersive.opening.status.dealt", { n: left });
  }
  return t("home.immersive.opening.status.done");
});

/** Finitura per carta: la hit brilla tutta, le rare un po', le comuni no. */
const foilFor = (card: ShowcaseCard, index: number) => {
  if (index === hand.value.length - 1) {
    return rarityRank(card.rarity) <= 11 ? "rainbow" : "holo";
  }
  const rank = rarityRank(card.rarity);
  if (rank <= 16) return "holo";
  return index === hand.value.length - 2 ? "reverse" : "none";
};

const prefetch = () => {
  if (pack.value) loadCards(pack.value);
};

const selectPack = (index: number) => {
  selected.value = index;
  prefetch();
};

watch(
  () => packs.value.length,
  (length) => {
    if (selected.value >= length) selected.value = 0;
    prefetch();
  },
  { immediate: true },
);

const tear = async () => {
  if (phase.value !== "idle" || preparing.value) return;

  let cards: ShowcaseCard[] = FALLBACK_SHOWCASE_CARDS;
  if (pack.value) {
    preparing.value = true;
    const current = pack.value;
    const setCards = await loadCards(current);
    preparing.value = false;
    // Il set non bastava: la busta è uscita dalla scelta, si passa alla
    // prossima senza aprire nulla.
    if (setCards.length < PACK_HAND_SIZE) return;
    cards = setCards;
  }

  hand.value = drawPackHand(cards, PACK_HAND_SIZE);
  opened.value = hand.value.map(() => false);
  phase.value = "torn";
  timers.push(
    setTimeout(() => {
      round.value += 1;
      phase.value = "dealt";
    }, 750),
  );
};

const checkDone = () => {
  if (opened.value.every(Boolean)) {
    timers.push(setTimeout(() => (phase.value = "done"), 600));
  }
};

const flip = (index: number) => {
  if (phase.value !== "dealt" || opened.value[index]) return;
  opened.value[index] = true;
  checkDone();
};

const revealAll = () => {
  hand.value.forEach((_, index) => {
    timers.push(
      setTimeout(() => {
        opened.value[index] = true;
        if (index === hand.value.length - 1) checkDone();
      }, index * 220),
    );
  });
};

const reset = () => {
  timers.forEach(clearTimeout);
  timers.length = 0;
  phase.value = "idle";
  hand.value = [];
  opened.value = [];
};

onBeforeUnmount(() => timers.forEach(clearTimeout));
</script>

<style scoped>
.opening {
  position: relative;
  padding: 110px 0;
  background:
    radial-gradient(50% 60% at 80% 40%, rgba(236, 145, 160, 0.16), transparent 70%),
    linear-gradient(180deg, #0b0d2b 0%, #120d33 100%);
}

.opening__grid {
  display: grid;
  gap: 40px;
  align-items: center;
}

@media (min-width: 1024px) {
  .opening__grid {
    grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
    gap: 56px;
  }
}

.opening__title {
  margin-top: 14px;
}

.opening__lead {
  max-width: 480px;
  margin-top: 18px;
}

.opening__facts {
  display: flex;
  flex-wrap: wrap;
  gap: 18px 28px;
  margin-top: 28px;
}

.opening__facts li {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.opening__fact-value {
  font-size: 30px;
  color: var(--im-pink);
}

.opening__fact-label {
  font-size: 13px;
  color: var(--im-muted);
}

.opening__stage {
  position: relative;
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  min-height: 600px;
  padding: 56px 18px 24px;
  border-radius: 28px;
}

.opening__status {
  position: absolute;
  top: 18px;
  left: 22px;
  right: 22px;
  overflow: hidden;
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--im-muted);
}

.opening__pack {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  width: min(210px, 52%);
  background: none;
  border: 0;
}

.opening__pack:disabled {
  cursor: progress;
}

.opening__pack:focus-visible {
  outline: 2px dashed var(--im-pink);
  outline-offset: 12px;
  border-radius: 12px;
}

.opening__tap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  animation: opening-hint 1.8s ease-in-out infinite;
}

.opening-pack-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}

.opening-pack-leave-to {
  opacity: 0;
  transform: translateY(40px) scale(0.9);
}

/* ---------- Carte ---------- */
/* Su mobile sei colonne con ogni carta larga due: tre carte sopra e due
   sotto, centrate e tutte della stessa misura. Da 640px in su, una riga. */
.opening__cards {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
  width: 100%;
  max-width: 640px;
}

.opening__card {
  grid-column: span 2;
}

@media (min-width: 640px) {
  .opening__cards {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  .opening__card {
    grid-column: auto;
  }
}

.opening__card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  animation: opening-deal 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

@media (max-width: 639px) {
  .opening__card:nth-child(4) {
    grid-column: 2 / span 2;
  }

  .opening__card:nth-child(5) {
    grid-column: 4 / span 2;
  }
}

.opening__card-btn {
  display: block;
  width: 100%;
  background: none;
  border: 0;
  padding: 0;
  transition: transform 0.25s ease;
}

.opening__card:not(.is-open) .opening__card-btn:hover {
  transform: translateY(-6px);
}

.opening__card-btn:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 4px;
  border-radius: 8px;
}

.opening__card--hit.is-open .opening__card-btn {
  filter: drop-shadow(0 0 22px rgba(247, 210, 216, 0.75));
  animation: opening-hit 0.8s ease-out;
}

.opening__rarity {
  max-width: 100%;
  overflow: hidden;
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--im-muted);
  animation: opening-rise 0.4s ease both;
}

.opening__card--hit .opening__rarity {
  color: var(--im-pink);
  font-weight: 700;
}

.opening__burst {
  position: absolute;
  top: 45%;
  left: 50%;
  pointer-events: none;
}

.opening__burst span {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #fff;
  clip-path: polygon(50% 0, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0 50%, 40% 40%);
  animation: opening-burst 0.9s ease-out forwards;
  rotate: calc(var(--i) * 36deg);
}

.opening__burst span:nth-child(even) {
  background: var(--im-pink);
}

/* ---------- Azioni ---------- */
.opening__actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.opening__result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  animation: opening-rise 0.6s ease both;
}

.opening__result-kicker {
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--im-pink);
}

.opening__result-name {
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-weight: 700;
  font-size: 20px;
}

.opening__result-price {
  font-size: 14px;
  color: var(--im-muted);
}

.opening__result-ctas {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  animation: opening-rise 0.6s ease 0.1s both;
}

/* ---------- Scelta della busta ---------- */
.opening__picker {
  width: 100%;
  margin-top: 6px;
}

.opening__picker-label {
  margin-bottom: 10px;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-align: center;
  color: var(--im-muted);
}

.opening__picker-list {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 2px 2px 8px;
  scroll-snap-type: x proximity;
  scrollbar-width: thin;
}

.opening__picker-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 190px;
  padding: 8px 12px 8px 8px;
  border-radius: 14px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.04);
  scroll-snap-align: start;
  text-align: left;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.opening__picker-item:hover {
  border-color: rgba(255, 255, 255, 0.3);
}

.opening__picker-item.is-selected {
  border-color: var(--im-pink);
  background: rgba(247, 210, 216, 0.1);
}

.opening__picker-item:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
}

.opening__picker-thumb {
  width: 34px;
  aspect-ratio: 11 / 20;
  flex: none;
  overflow: hidden;
  border-radius: 4px;
}

.opening__picker-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.13);
}

.opening__picker-text {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}

.opening__picker-name {
  overflow: hidden;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.opening__picker-meta {
  font-size: 11px;
  color: var(--im-muted);
}

@keyframes opening-deal {
  from {
    opacity: 0;
    transform: translateY(-80px) rotate(-8deg) scale(0.8);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes opening-hit {
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.08);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes opening-burst {
  from {
    opacity: 1;
    transform: rotate(0deg) translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-110px) scale(0.3);
  }
}

@keyframes opening-hint {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.75;
  }
  50% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

@keyframes opening-rise {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .opening__card,
  .opening__tap,
  .opening__burst span,
  .opening__card--hit.is-open .opening__card-btn,
  .opening__result,
  .opening__result-ctas,
  .opening__rarity {
    animation: none;
  }
}
</style>
