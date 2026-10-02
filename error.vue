<template>
  <main class="lost">
    <div class="lost__stars" aria-hidden="true"></div>
    <div class="lost__halo" aria-hidden="true"></div>

    <div class="lost__inner">
      <!-- Il codice in grande: ogni zero è la ball del logo, che dondola,
           si apre e resta vuota. Il Pokémon è scappato. -->
      <div class="lost__code" role="img" :aria-label="String(statusCode)">
        <template v-for="(char, index) in codeChars" :key="index">
          <span v-if="char !== '0'" class="lost__digit" aria-hidden="true">
            {{ char }}
          </span>
          <span v-else class="lost__ball" aria-hidden="true">
            <span class="lost__ball-inner">
              <img :src="logo" alt="" class="lost__half lost__half--top" />
              <img :src="logo" alt="" class="lost__half lost__half--bottom" />
            </span>
            <span class="lost__spark lost__spark--1"></span>
            <span class="lost__spark lost__spark--2"></span>
            <span class="lost__spark lost__spark--3"></span>
            <span class="lost__shadow"></span>
          </span>
        </template>
      </div>

      <p v-if="isDevMode" class="lost__dev">{{ error?.message }}</p>
      <h1 class="im-display lost__title">{{ title }}</h1>
      <p class="im-lead lost__lead">
        {{ t("common.errors.notFoundDescription") }}
      </p>

      <div class="lost__ctas">
        <nuxt-link to="/" class="im-btn im-btn--primary">
          <Icon name="heroicons:home-20-solid" size="18" />
          {{ t("common.errors.backHome") }}
        </nuxt-link>
        <nuxt-link to="/pokemon/all" class="im-btn im-btn--ghost">
          {{ t("home.immersive.hero.ctaPrimary") }}
          <Icon name="heroicons:arrow-right-20-solid" size="18" />
        </nuxt-link>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";
import logo from "~/assets/logo/logo_new.png";
const { t } = useI18n();

const props = defineProps({
  error: Object as () => NuxtError,
});

const isDevMode = process.env.NODE_ENV === "development";

const statusCode = computed(() => props.error?.statusCode || 404);
const codeChars = computed(() => String(statusCode.value).split(""));

// Il codice è già disegnato in grande: dal titolo tradotto
// ("404 - Pagina Non Trovata") si toglie il prefisso numerico.
const title = computed(() =>
  t("common.errors.notFoundTitle").replace(/^\s*\d{3}\s*[-–—:]\s*/, ""),
);
</script>

<style scoped>
.lost {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
  padding: 48px 16px;
  text-align: center;
  color: var(--im-ink);
}

/* Cielo stellato appena accennato, fermo. */
.lost__stars {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 12% 18%, rgba(255, 255, 255, 0.7), transparent),
    radial-gradient(1px 1px at 78% 12%, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(1.5px 1.5px at 64% 72%, rgba(247, 210, 216, 0.8), transparent),
    radial-gradient(1px 1px at 28% 82%, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(1.5px 1.5px at 90% 48%, rgba(92, 200, 224, 0.7), transparent),
    radial-gradient(1px 1px at 6% 56%, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(1px 1px at 44% 8%, rgba(255, 255, 255, 0.5), transparent);
  pointer-events: none;
}

.lost__halo {
  position: absolute;
  top: 18%;
  left: 50%;
  width: min(720px, 120vw);
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(236, 145, 160, 0.28), transparent 60%),
    radial-gradient(circle at 70% 70%, rgba(92, 200, 224, 0.16), transparent 55%);
  transform: translate(-50%, -30%);
  filter: blur(20px);
  pointer-events: none;
}

.lost__inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 680px;
}

/* ---------- Codice con la ball ---------- */
.lost__code {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.06em;
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-size: clamp(92px, 26vw, 200px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
}

.lost__digit {
  font-family: inherit;
  background: linear-gradient(180deg, #ffffff 0%, var(--im-pink) 55%, var(--im-pink-strong) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.lost__ball {
  position: relative;
  display: inline-block;
  width: 0.8em;
  height: 0.8em;
  margin: 0 0.04em;
}

/* L'ombra sta sul contenitore: messa sulle due metà ritagliate, il
   `clip-path` la tagliava in un rettangolo scuro quando la ball si apre. */
.lost__ball-inner {
  position: absolute;
  inset: 0;
  filter: drop-shadow(0 14px 24px rgba(0, 0, 0, 0.5));
  animation: lost-wobble 4.8s ease-in-out infinite;
}

.lost__half {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* La linea nera della ball cade a metà: due copie del logo ritagliate. */
.lost__half--top {
  clip-path: inset(0 0 49% 0);
  transform-origin: 12% 50%;
  animation: lost-open 4.8s ease-in-out infinite;
}

.lost__half--bottom {
  clip-path: inset(51% 0 0 0);
}

/* Scintille che scappano verso l'alto quando la ball si apre. */
.lost__spark {
  position: absolute;
  top: 40%;
  left: 50%;
  width: 0.08em;
  height: 0.08em;
  border-radius: 50%;
  background: #fff;
  box-shadow:
    0 0 10px 2px rgba(247, 210, 216, 0.9),
    0 0 22px 6px rgba(236, 145, 160, 0.5);
  opacity: 0;
  animation: lost-flee 4.8s ease-out infinite;
}

.lost__spark--1 {
  --x: 0.9em;
  --y: -1em;
}

.lost__spark--2 {
  --x: 0.35em;
  --y: -1.3em;
  animation-delay: 0.08s;
}

.lost__spark--3 {
  --x: 1.25em;
  --y: -0.6em;
  width: 0.05em;
  height: 0.05em;
  animation-delay: 0.16s;
}

.lost__shadow {
  position: absolute;
  left: 18%;
  right: 18%;
  bottom: -0.12em;
  height: 0.08em;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  filter: blur(6px);
}

/* ---------- Testi ---------- */
.lost__dev {
  max-width: 100%;
  margin-top: 20px;
  padding: 6px 12px;
  border-radius: 10px;
  border: 1px solid rgba(248, 113, 113, 0.4);
  background: rgba(248, 113, 113, 0.08);
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 12px;
  line-height: 1.5;
  color: #fca5a5;
  overflow-wrap: anywhere;
}

.lost__title {
  margin-top: 28px;
  font-size: clamp(28px, 5vw, 48px);
  line-height: 1.05;
  overflow-wrap: break-word;
}

.lost__lead {
  max-width: 48ch;
  margin-top: 16px;
}

.lost__ctas {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
}

.lost__ctas a,
.lost__ctas a * {
  cursor: pointer;
}

@media (max-width: 420px) {
  .lost__ctas {
    flex-direction: column;
    width: 100%;
  }

  .lost__ctas a {
    white-space: normal;
  }
}

/* Dondola tre volte come durante una cattura... */
@keyframes lost-wobble {
  0%,
  8% {
    rotate: 0deg;
  }
  13% {
    rotate: -14deg;
  }
  19% {
    rotate: 11deg;
  }
  25%,
  31% {
    rotate: 0deg;
  }
  36% {
    rotate: -12deg;
  }
  42% {
    rotate: 9deg;
  }
  48%,
  100% {
    rotate: 0deg;
  }
}

/* ...poi si apre di colpo e si richiude vuota. */
@keyframes lost-open {
  0%,
  52% {
    transform: none;
  }
  56% {
    transform: translateY(-14%) rotate(-24deg);
  }
  72% {
    transform: translateY(-14%) rotate(-24deg);
  }
  78%,
  100% {
    transform: none;
  }
}

@keyframes lost-flee {
  0%,
  53% {
    opacity: 0;
    transform: translate(0, 0) scale(0.4);
  }
  57% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  74% {
    opacity: 0;
    transform: translate(var(--x), var(--y)) scale(0.6);
  }
  100% {
    opacity: 0;
    transform: translate(var(--x), var(--y)) scale(0.6);
  }
}

@media (prefers-reduced-motion: reduce) {
  .lost__ball-inner,
  .lost__half--top,
  .lost__spark {
    animation: none;
  }
}
</style>
