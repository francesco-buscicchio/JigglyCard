<template>
  <div
    class="pack"
    :class="{ 'pack--torn': torn, 'pack--idle': idle && !torn }"
    :style="{ '--tear': tearProgress }"
  >
    <div class="pack__strip" aria-hidden="true">
      <div class="pack__crimp"></div>
    </div>

    <div class="pack__body">
      <div
        class="pack__art"
        :style="art ? { backgroundImage: `url(${art})` } : undefined"
        aria-hidden="true"
      ></div>
      <div class="pack__sheen" aria-hidden="true"></div>
      <div class="pack__burst" aria-hidden="true"></div>

      <div class="pack__label">
        <img :src="logo" alt="" class="pack__logo" />
        <span class="pack__brand">{{ brand }}</span>
      </div>

      <div class="pack__footer">
        <span class="pack__title">{{ title }}</span>
        <span v-if="subtitle" class="pack__subtitle">{{ subtitle }}</span>
      </div>
    </div>

    <div class="pack__crimp pack__crimp--bottom" aria-hidden="true"></div>
  </div>
</template>

<script setup lang="ts">
import logo from "~/assets/logo/logo_new.png";

/**
 * Busta disegnata in CSS. L'illustrazione è un'immagine del catalogo (di
 * solito la copertina del set più recente), così la busta in vetrina cambia
 * da sola quando esce un'espansione nuova.
 *
 * `tearProgress` (0 → 1) strappa la linguetta in modo continuo, per legarla
 * allo scroll; `torn` la stacca del tutto con una transizione.
 */
withDefaults(
  defineProps<{
    art?: string;
    title?: string;
    subtitle?: string;
    brand?: string;
    torn?: boolean;
    tearProgress?: number;
    /** Leggera oscillazione d'attesa, per invitare al click. */
    idle?: boolean;
  }>(),
  {
    art: "",
    title: "",
    subtitle: "",
    brand: "Jigglycard",
    torn: false,
    tearProgress: 0,
    idle: false,
  },
);
</script>

<style scoped>
.pack {
  --tear: 0;
  --pack-a: #f7d2d8;
  --pack-b: #a78bfa;
  --pack-c: #1b1546;
  position: relative;
  aspect-ratio: 9 / 16;
  width: 100%;
  filter: drop-shadow(0 40px 50px rgba(0, 0, 0, 0.55));
}

.pack--idle {
  animation: pack-idle 3.2s ease-in-out infinite;
}

.pack__strip {
  position: absolute;
  inset: 0 0 auto 0;
  height: 8%;
  z-index: 2;
  transform-origin: 100% 100%;
  transform: translate(calc(var(--tear) * 18%), calc(var(--tear) * -120%))
    rotate(calc(var(--tear) * 14deg));
  opacity: calc(1 - var(--tear) * 0.9);
  transition:
    transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 0.6s ease;
}

.pack--torn .pack__strip {
  transform: translate(22%, -220%) rotate(22deg);
  opacity: 0;
}

.pack__crimp {
  height: 100%;
  border-radius: 6px 6px 2px 2px;
  background:
    repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.45) 0 2px,
      rgba(0, 0, 0, 0.18) 2px 5px
    ),
    linear-gradient(90deg, #d9d6e8, #ffffff 40%, #b9b3d4 70%, #f4f2fb);
}

.pack__crimp--bottom {
  position: absolute;
  inset: auto 0 0 0;
  height: 6%;
  border-radius: 2px 2px 6px 6px;
}

.pack__body {
  position: absolute;
  inset: 8% 0 6% 0;
  overflow: hidden;
  border-radius: 3px;
  background:
    radial-gradient(120% 70% at 50% 0%, var(--pack-a) 0%, transparent 60%),
    linear-gradient(160deg, var(--pack-b) 0%, var(--pack-c) 75%);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.25),
    inset 14px 0 22px -12px rgba(255, 255, 255, 0.45),
    inset -14px 0 22px -12px rgba(0, 0, 0, 0.5);
}

.pack__art {
  position: absolute;
  inset: 16% 8% 26% 8%;
  border-radius: 10px;
  background-size: cover;
  background-position: center 20%;
  box-shadow:
    0 0 0 2px rgba(255, 255, 255, 0.35),
    0 12px 30px rgba(0, 0, 0, 0.35);
  -webkit-mask-image: linear-gradient(to bottom, #000 70%, transparent);
  mask-image: linear-gradient(to bottom, #000 70%, transparent);
}

.pack__sheen {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 30%,
    rgba(255, 255, 255, 0.5) 46%,
    rgba(255, 255, 255, 0.1) 54%,
    transparent 70%
  );
  background-size: 260% 100%;
  mix-blend-mode: soft-light;
  animation: pack-sheen 4.5s ease-in-out infinite;
}

/* La luce che esce dalla busta appena aperta. */
.pack__burst {
  position: absolute;
  inset: -20% -10% auto -10%;
  height: 60%;
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(255, 244, 214, 0.95) 0%,
    rgba(255, 190, 210, 0.5) 30%,
    transparent 65%
  );
  opacity: var(--tear);
  transition: opacity 0.6s ease;
}

.pack--torn .pack__burst {
  opacity: 1;
}

.pack__label {
  position: absolute;
  top: 4%;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.pack__logo {
  width: 16%;
  max-width: 34px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.pack__brand {
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-weight: 800;
  font-size: clamp(9px, 1.1vw, 13px);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #2a0a14;
  cursor: inherit;
}

.pack__footer {
  position: absolute;
  left: 8%;
  right: 8%;
  bottom: 6%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: center;
}

.pack__title {
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-weight: 800;
  font-size: clamp(11px, 1.35vw, 17px);
  line-height: 1.05;
  color: #fff;
  text-transform: uppercase;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
  cursor: inherit;
}

.pack__subtitle {
  align-self: center;
  padding: 2px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.85);
  color: #2a0a14;
  font-size: clamp(8px, 0.8vw, 10px);
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: inherit;
}

@keyframes pack-sheen {
  0%,
  20% {
    background-position: 120% 0;
  }
  70%,
  100% {
    background-position: -40% 0;
  }
}

@keyframes pack-idle {
  0%,
  100% {
    transform: translateY(0) rotate(-2deg);
  }
  50% {
    transform: translateY(-10px) rotate(2deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pack--idle,
  .pack__sheen {
    animation: none;
  }
}
</style>
