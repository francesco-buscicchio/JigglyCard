<template>
  <div
    class="holo"
    :class="[
      `holo--${foil}`,
      {
        'holo--active': active,
        'holo--flipped': flipped,
        'holo--shimmer': shimmer,
      },
    ]"
    :style="tiltStyle"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <div class="holo__body">
      <div class="holo__face holo__front">
        <img
          v-if="front"
          :src="front"
          :alt="alt"
          :loading="eager ? 'eager' : 'lazy'"
          :class="fit === 'contain' ? 'object-contain' : 'object-cover'"
          decoding="async"
          draggable="false"
        />
        <div v-if="foil !== 'none'" class="holo__foil" aria-hidden="true" />
        <div v-if="glare" class="holo__glare" aria-hidden="true" />
      </div>
      <div class="holo__face holo__back" aria-hidden="true">
        <img :src="back || cardBack" alt="" draggable="false" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import cardBack from "~/assets/img/default-card-image.png";

/**
 * Carta con inclinazione 3D che segue il puntatore e riflesso olografico.
 *
 * Il riflesso è solo CSS (gradienti in `color-dodge` sopra l'immagine), così
 * funziona con qualunque scansione del catalogo senza maschere dedicate. Con
 * `flipped` mostra il dorso: le sezioni lo usano sia come stato di
 * caricamento sia per i colpi di scena (la carta che si gira).
 */
const props = withDefaults(
  defineProps<{
    front?: string;
    back?: string;
    alt?: string;
    foil?: "none" | "holo" | "reverse" | "rainbow" | "gold";
    flipped?: boolean;
    interactive?: boolean;
    /** Riflesso che scorre da solo quando nessuno ci passa sopra. */
    shimmer?: boolean;
    eager?: boolean;
    /** `contain` per le immagini che non sono carte (buste, box). */
    fit?: "cover" | "contain";
    /** Inclinazione massima, in gradi. */
    maxTilt?: number;
    /** Bagliore che segue il puntatore; senza, la carta si inclina e basta. */
    glare?: boolean;
  }>(),
  {
    front: "",
    back: "",
    alt: "",
    foil: "holo",
    flipped: false,
    interactive: true,
    shimmer: false,
    eager: false,
    fit: "cover",
    maxTilt: 14,
    glare: true,
  },
);

const active = ref(false);
const pointer = reactive({ x: 0.5, y: 0.5 });
let frame = 0;
let pending: { x: number; y: number } | null = null;

const tiltStyle = computed(() => {
  const rx = active.value ? (0.5 - pointer.y) * 2 * props.maxTilt : 0;
  const ry = active.value ? (pointer.x - 0.5) * 2 * props.maxTilt : 0;
  return {
    "--rx": `${rx.toFixed(2)}deg`,
    "--ry": `${ry.toFixed(2)}deg`,
    "--mx": `${(pointer.x * 100).toFixed(1)}%`,
    "--my": `${(pointer.y * 100).toFixed(1)}%`,
    "--hyp": Math.min(
      1,
      Math.hypot(pointer.x - 0.5, pointer.y - 0.5) * 2,
    ).toFixed(3),
  };
});

const onPointerMove = (event: PointerEvent) => {
  if (!props.interactive) return;
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  pending = {
    x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
    y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
  };
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    if (!pending) return;
    pointer.x = pending.x;
    pointer.y = pending.y;
    active.value = true;
  });
};

const onPointerLeave = () => {
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
  pending = null;
  active.value = false;
  pointer.x = 0.5;
  pointer.y = 0.5;
};

onBeforeUnmount(() => {
  if (frame) cancelAnimationFrame(frame);
});
</script>

<style scoped>
.holo {
  --rx: 0deg;
  --ry: 0deg;
  --mx: 50%;
  --my: 50%;
  --hyp: 0;
  position: relative;
  aspect-ratio: 63 / 88;
  perspective: 1000px;
  /* Nessun vincolo sui gesti: con \`pan-y\` sul telefono le file di carte
     (vetrina della home) non scorrevano più in orizzontale. */
}

.holo__body {
  position: absolute;
  inset: 0;
  border-radius: 4.6% / 3.3%;
  transform-style: preserve-3d;
  transform: rotateX(var(--rx)) rotateY(calc(var(--ry) + var(--flip, 0deg)));
  transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: transform;
}

.holo--active .holo__body {
  transition: transform 0.12s linear;
}

.holo--flipped {
  --flip: 180deg;
}

.holo__face {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  background: #11142e;
  box-shadow:
    0 28px 60px -24px rgba(0, 0, 0, 0.75),
    0 0 0 1px rgba(255, 255, 255, 0.08);
}

.holo__back {
  transform: rotateY(180deg);
}

.holo__face img {
  width: 100%;
  height: 100%;
  user-select: none;
  pointer-events: none;
}

.holo__back img {
  object-fit: cover;
}

/* Arcobaleno che scorre con il puntatore: è ciò che fa sembrare "vera" la
   carta, molto più della sola inclinazione. */
.holo__foil {
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: color-dodge;
  opacity: calc(0.18 + var(--hyp) * 0.45);
  background-image:
    repeating-linear-gradient(
      115deg,
      #ff77a9 0%,
      #ffd47a 7%,
      #8bffc9 14%,
      #79c6ff 21%,
      #c08bff 28%,
      #ff77a9 35%
    ),
    radial-gradient(
      farthest-corner circle at var(--mx) var(--my),
      rgba(255, 255, 255, 0.35) 0%,
      rgba(0, 0, 0, 0.6) 90%
    );
  background-blend-mode: overlay;
  background-size: 400% 400%, cover;
  background-position: var(--mx) var(--my), center;
  filter: brightness(0.75) contrast(1.4) saturate(1.1);
  transition: opacity 0.4s ease;
}

.holo--active .holo__foil {
  opacity: calc(0.3 + var(--hyp) * 0.55);
}

/* Reverse: il riflesso sta sulla cornice, non sull'illustrazione. */
.holo--reverse .holo__foil {
  -webkit-mask-image: radial-gradient(
    ellipse 62% 40% at 50% 34%,
    transparent 70%,
    #000 72%
  );
  mask-image: radial-gradient(
    ellipse 62% 40% at 50% 34%,
    transparent 70%,
    #000 72%
  );
}

.holo--rainbow .holo__foil {
  opacity: calc(0.35 + var(--hyp) * 0.5);
  filter: brightness(0.9) contrast(1.6) saturate(1.6);
  background-size: 250% 250%, cover;
}

.holo--gold .holo__foil {
  background-image:
    repeating-linear-gradient(
      120deg,
      #fff3c4 0%,
      #e2b34a 8%,
      #8a6417 14%,
      #f6dc8f 22%,
      #fff3c4 30%
    ),
    radial-gradient(
      farthest-corner circle at var(--mx) var(--my),
      rgba(255, 255, 255, 0.4) 0%,
      rgba(0, 0, 0, 0.55) 90%
    );
  opacity: calc(0.3 + var(--hyp) * 0.45);
}

.holo--shimmer:not(.holo--active) .holo__foil {
  animation: holo-shimmer 7s ease-in-out infinite alternate;
}

.holo__glare {
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: overlay;
  opacity: 0;
  background: radial-gradient(
    farthest-corner circle at var(--mx) var(--my),
    rgba(255, 255, 255, 0.85) 0%,
    rgba(255, 255, 255, 0.25) 25%,
    rgba(0, 0, 0, 0.35) 90%
  );
  transition: opacity 0.4s ease;
}

.holo--active .holo__glare {
  opacity: 0.8;
}

@keyframes holo-shimmer {
  from {
    background-position: 0% 0%, center;
  }
  to {
    background-position: 100% 100%, center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .holo__body,
  .holo--active .holo__body {
    transition: none;
    transform: rotateY(var(--flip, 0deg));
  }

  .holo--shimmer:not(.holo--active) .holo__foil {
    animation: none;
  }
}
</style>
