<template>
  <div
    v-if="mounted ? visible : true"
    class="intro"
    :class="{ 'intro--opening': opening }"
    role="dialog"
    aria-modal="true"
    :aria-label="t('home.immersive.intro.label')"
    @keydown.esc="finish"
  >
    <div class="intro__stars" aria-hidden="true"></div>
    <div class="intro__halo" aria-hidden="true"></div>

    <button
      ref="ballRef"
      type="button"
      class="intro__ball"
      :aria-label="t('home.immersive.intro.open')"
      @click="open"
    >
      <span class="intro__ball-inner">
        <img :src="logo" alt="" class="intro__half intro__half--top" />
        <img :src="logo" alt="" class="intro__half intro__half--bottom" />
      </span>
      <span class="intro__shadow" aria-hidden="true"></span>
    </button>

    <div class="intro__flash" aria-hidden="true"></div>

    <p class="intro__hint">
      <span class="intro__hint--pointer">{{ t("home.immersive.intro.hintClick") }}</span>
      <span class="intro__hint--touch">{{ t("home.immersive.intro.hintTap") }}</span>
    </p>

    <button type="button" class="intro__skip" @click="finish">
      {{ t("home.immersive.intro.skip") }}
    </button>
  </div>
</template>

<script setup lang="ts">
import logo from "~/assets/logo/logo_new.png";
import { INTRO_HTML_CLASS, INTRO_STORAGE_KEY } from "~/utils/homeIntro";

/**
 * Ingresso della home: la Jiggly-ball del logo che si apre al click.
 *
 * Si vede una volta per sessione e mai con "riduci movimento". La decisione
 * la prende uno script inline nell'<head> (vedi `INTRO_HEAD_SCRIPT`), che
 * mette la classe `jc-intro` su <html> prima del primo paint: così né chi la
 * vede ha un lampo della home, né chi l'ha già vista ha un lampo dell'intro.
 * Costanti e script stanno in `utils/homeIntro.ts`.
 */
const emit = defineEmits<{ done: [] }>();
const { t } = useI18n();

const mounted = ref(false);
const visible = ref(false);
const opening = ref(false);
const ballRef = ref<HTMLButtonElement | null>(null);
const timers: ReturnType<typeof setTimeout>[] = [];

const root = () => document.documentElement;

const shouldShow = () => {
  try {
    if (sessionStorage.getItem(INTRO_STORAGE_KEY)) return false;
  } catch {
    return false;
  }
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const open = () => {
  if (opening.value) return;
  opening.value = true;
  timers.push(setTimeout(finish, 1500));
};

const finish = () => {
  try {
    sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
  } catch {
    // Storage bloccato (navigazione privata): l'intro tornerà, pazienza.
  }
  root().classList.remove(INTRO_HTML_CLASS);
  root().style.removeProperty("overflow");
  visible.value = false;
  emit("done");
};

onMounted(() => {
  mounted.value = true;
  visible.value = shouldShow();

  if (!visible.value) {
    root().classList.remove(INTRO_HTML_CLASS);
    emit("done");
    return;
  }

  // Arrivando qui con la navigazione client lo script dell'<head> non gira:
  // la classe la mette il componente.
  root().classList.add(INTRO_HTML_CLASS);
  root().style.overflow = "hidden";
  nextTick(() => ballRef.value?.focus({ preventScroll: true }));
});

onBeforeUnmount(() => {
  timers.forEach(clearTimeout);
  if (visible.value) {
    root().classList.remove(INTRO_HTML_CLASS);
    root().style.removeProperty("overflow");
  }
});
</script>

<style scoped>
.intro {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: radial-gradient(
    ellipse 70% 60% at 50% 45%,
    #22337a 0%,
    #0f1747 40%,
    #050719 100%
  );
  transition: opacity 0.7s ease 0.75s;
}

.intro--opening {
  opacity: 0;
  pointer-events: none;
}

.intro__stars {
  position: absolute;
  inset: -50%;
  background-image:
    radial-gradient(1px 1px at 20px 30px, rgba(255, 255, 255, 0.8), transparent),
    radial-gradient(1px 1px at 120px 80px, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(1.5px 1.5px at 200px 160px, rgba(247, 210, 216, 0.9), transparent),
    radial-gradient(1px 1px at 60px 200px, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(1px 1px at 260px 40px, rgba(92, 200, 224, 0.8), transparent);
  background-size: 300px 240px;
  animation: intro-drift 60s linear infinite;
  opacity: 0.7;
}

.intro__halo {
  position: absolute;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(247, 210, 216, 0.22) 0%,
    rgba(92, 200, 224, 0.08) 40%,
    transparent 70%
  );
  animation: intro-pulse 3.2s ease-in-out infinite;
}

.intro__ball {
  position: relative;
  width: min(42vw, 190px);
  aspect-ratio: 549 / 455;
  border-radius: 40%;
  background: none;
  border: 0;
  padding: 0;
  outline: none;
}

.intro__ball:focus-visible {
  outline: 2px dashed rgba(247, 210, 216, 0.7);
  outline-offset: 18px;
}

.intro__ball-inner {
  position: absolute;
  inset: 0;
  animation:
    intro-float 3s ease-in-out infinite,
    intro-wobble 3.6s ease-in-out infinite;
}

.intro__half {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition:
    transform 0.85s cubic-bezier(0.6, -0.2, 0.2, 1),
    opacity 0.6s ease 0.25s;
  filter: drop-shadow(0 18px 30px rgba(0, 0, 0, 0.45));
}

/* La linea nera della ball cade a metà altezza: due copie del logo,
   ritagliate sopra e sotto, si aprono come una vera Poké Ball. */
.intro__half--top {
  clip-path: inset(0 0 49% 0);
}

.intro__half--bottom {
  clip-path: inset(51% 0 0 0);
}

.intro__shadow {
  position: absolute;
  left: 18%;
  right: 18%;
  bottom: -18%;
  height: 12%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  filter: blur(8px);
  animation: intro-shadow 3s ease-in-out infinite;
}

.intro__flash {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  margin: -40px 0 0 -40px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    #ffffff 0%,
    rgba(255, 236, 242, 0.9) 35%,
    rgba(247, 210, 216, 0) 70%
  );
  opacity: 0;
  transform: scale(0);
  pointer-events: none;
}

.intro--opening .intro__ball-inner {
  animation: intro-shake 0.45s ease-in-out;
}

.intro--opening .intro__half--top {
  transform: translateY(-46vh) rotate(-14deg) scale(1.25);
  opacity: 0;
}

.intro--opening .intro__half--bottom {
  transform: translateY(46vh) rotate(10deg) scale(1.25);
  opacity: 0;
}

.intro--opening .intro__shadow {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.intro--opening .intro__flash {
  animation: intro-flash 1.1s ease-out 0.35s forwards;
}

.intro__hint {
  position: absolute;
  bottom: 12vh;
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 12px;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  animation: intro-blink 2.4s ease-in-out infinite;
}

.intro__hint--touch {
  display: none;
}

@media (hover: none) {
  .intro__hint--pointer {
    display: none;
  }
  .intro__hint--touch {
    display: inline;
  }
}

.intro__skip {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.75);
  font-size: 13px;
  background: rgba(255, 255, 255, 0.05);
  transition: background-color 0.2s ease;
}

.intro__skip:hover {
  background: rgba(255, 255, 255, 0.12);
}

.intro--opening .intro__hint,
.intro--opening .intro__skip {
  opacity: 0;
  transition: opacity 0.2s ease;
}

@keyframes intro-float {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -12px;
  }
}

/* Il dondolio della Poké Ball "che sta per catturare". */
@keyframes intro-wobble {
  0%,
  62%,
  100% {
    rotate: 0deg;
  }
  68% {
    rotate: -14deg;
  }
  74% {
    rotate: 11deg;
  }
  80% {
    rotate: -6deg;
  }
  86% {
    rotate: 0deg;
  }
}

@keyframes intro-shake {
  0%,
  100% {
    rotate: 0deg;
  }
  25% {
    rotate: -10deg;
  }
  50% {
    rotate: 9deg;
  }
  75% {
    rotate: -5deg;
  }
}

@keyframes intro-shadow {
  0%,
  100% {
    transform: scaleX(1);
    opacity: 0.45;
  }
  50% {
    transform: scaleX(0.8);
    opacity: 0.3;
  }
}

@keyframes intro-flash {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  25% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(40);
  }
}

@keyframes intro-pulse {
  0%,
  100% {
    transform: scale(0.92);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.06);
    opacity: 1;
  }
}

@keyframes intro-drift {
  to {
    transform: translate3d(300px, 240px, 0);
  }
}

@keyframes intro-blink {
  0%,
  100% {
    opacity: 0.35;
  }
  50% {
    opacity: 0.9;
  }
}
</style>
