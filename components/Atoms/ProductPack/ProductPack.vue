<template>
  <div
    class="ppack"
    :class="{ 'ppack--torn': torn, 'ppack--idle': idle && !torn }"
    :style="{ '--tear': tearProgress }"
  >
    <div class="ppack__piece ppack__body" :style="{ clipPath: bodyClip }">
      <img :src="image" :alt="alt" draggable="false" />
      <span class="ppack__sheen" aria-hidden="true"></span>
    </div>
    <div class="ppack__piece ppack__strip" :style="{ clipPath: stripClip }" aria-hidden="true">
      <img :src="image" alt="" draggable="false" />
    </div>
    <span class="ppack__burst" aria-hidden="true"></span>
  </div>
</template>

<script setup lang="ts">
/**
 * La foto di una busta del catalogo, trattata come una busta vera: ritagliata
 * sul formato (le foto CardTrader sono quadrate, con la busta al centro su
 * fondo bianco) e con la linguetta in alto che si strappa.
 *
 * Linguetta e corpo sono due copie della stessa immagine, tagliate lungo la
 * stessa linea a zig-zag: chiuse combaciano, aperte sembrano strappate.
 */
withDefaults(
  defineProps<{
    image: string;
    alt?: string;
    torn?: boolean;
    /** 0 → 1: strappo continuo, per legarlo allo scroll. */
    tearProgress?: number;
    idle?: boolean;
  }>(),
  { alt: "", torn: false, tearProgress: 0, idle: false },
);

/** Altezza della linea di strappo, in percentuale. */
const TEAR_LINE = 15;
const TEETH = 14;

const tearLine = Array.from({ length: TEETH + 1 }, (_, index) => {
  const x = (index / TEETH) * 100;
  const y = TEAR_LINE + (index % 2 === 0 ? -1 : 1);
  return `${x.toFixed(2)}% ${y}%`;
});

const stripClip = `polygon(0% 0%, 100% 0%, ${[...tearLine].reverse().join(", ")})`;
const bodyClip = `polygon(${tearLine.join(", ")}, 100% 100%, 0% 100%)`;
</script>

<style scoped>
.ppack {
  --tear: 0;
  position: relative;
  aspect-ratio: 11 / 20;
  width: 100%;
  filter: drop-shadow(0 34px 40px rgba(0, 0, 0, 0.55));
}

.ppack--idle {
  animation: ppack-idle 3.2s ease-in-out infinite;
}

.ppack__piece {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 4px;
}

/* Lo zoom toglie i margini bianchi della foto lasciando intera la busta. */
.ppack__piece img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.13);
  user-select: none;
  pointer-events: none;
}

.ppack__strip {
  transform-origin: 100% 15%;
  transform: translate(calc(var(--tear) * 14%), calc(var(--tear) * -18%))
    rotate(calc(var(--tear) * 16deg));
  opacity: calc(1 - var(--tear) * 0.85);
  transition:
    transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 0.6s ease;
}

.ppack--torn .ppack__strip {
  transform: translate(26%, -42%) rotate(24deg);
  opacity: 0;
}

.ppack__sheen {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 30%,
    rgba(255, 255, 255, 0.55) 46%,
    rgba(255, 255, 255, 0.1) 54%,
    transparent 70%
  );
  background-size: 260% 100%;
  mix-blend-mode: soft-light;
  animation: ppack-sheen 4.5s ease-in-out infinite;
}

/* La luce che esce dalla busta appena aperta. */
.ppack__burst {
  position: absolute;
  left: -15%;
  right: -15%;
  top: 0;
  height: 45%;
  background: radial-gradient(
    ellipse at 50% 30%,
    rgba(255, 246, 220, 0.95) 0%,
    rgba(255, 196, 214, 0.5) 30%,
    transparent 65%
  );
  opacity: var(--tear);
  pointer-events: none;
  transition: opacity 0.5s ease;
}

.ppack--torn .ppack__burst {
  opacity: 1;
}

@keyframes ppack-sheen {
  0%,
  20% {
    background-position: 120% 0;
  }
  70%,
  100% {
    background-position: -40% 0;
  }
}

@keyframes ppack-idle {
  0%,
  100% {
    transform: translateY(0) rotate(-2deg);
  }
  50% {
    transform: translateY(-10px) rotate(2deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ppack--idle,
  .ppack__sheen {
    animation: none;
  }
}
</style>
