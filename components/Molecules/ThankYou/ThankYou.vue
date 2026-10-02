<template>
  <section class="ty">
    <div v-reveal class="ty__panel">
      <!-- Scintille e anelli: festa, ma ferma per chi riduce le animazioni. -->
      <div class="ty__sparks" aria-hidden="true">
        <span v-for="n in 8" :key="n" class="ty__spark" :style="{ '--n': n }"></span>
      </div>

      <span class="ty__badge" aria-hidden="true">
        <span class="ty__ring"></span>
        <Icon name="heroicons:check-20-solid" size="34" />
      </span>

      <h1 class="im-display ty__title">
        <span class="im-gradient-text">{{ t("checkout.thanks.main") }}</span>
      </h1>
      <p class="im-lead ty__text">{{ t(`checkout.thanks.${props.type}`) }}</p>

      <!-- Spazio per i dettagli della pagina (es. il numero d'ordine). -->
      <slot />

      <div class="ty__art">
        <img class="ty__img" :src="thanksSrc" alt="Thank You" />
      </div>

      <AtomsButtonCTA
        type="primary"
        class="ty__cta"
        :text="t('checkout.thanks.backHome')"
        @button-clicked="goTo(PATH.HOME)"
      >
        <Icon name="heroicons:arrow-right-20-solid" size="18" />
      </AtomsButtonCTA>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import thanksSrc from "@/assets/img/thanks.png";
import { PATH } from "~/data/const";
import { goTo } from '@/utils/navigationUtils'

const { t } = useI18n();
const props = defineProps({
  type: {
    type: String,
    default: "order",
    validator: (value: string) => ["order", "newsletter"].includes(value),
  },
});
</script>

<style scoped>
.ty {
  width: 100%;
  padding: 24px 20px 64px;
}

.ty__panel {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 720px;
  margin: 0 auto;
  padding: 56px 22px 36px;
  overflow: hidden;
  text-align: center;
  border-radius: 32px;
  border: 1px solid var(--im-line);
  background:
    radial-gradient(70% 50% at 50% 0%, rgba(236, 145, 160, 0.22), transparent 70%),
    radial-gradient(60% 50% at 100% 100%, rgba(92, 200, 224, 0.14), transparent 70%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.02));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 40px 80px -50px rgba(236, 145, 160, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

@media (min-width: 768px) {
  .ty__panel {
    padding: 72px 56px 48px;
  }
}

/* --- Distintivo con la spunta ---------------------------------------- */

.ty__badge {
  position: relative;
  display: inline-grid;
  place-content: center;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  color: #2a0a14;
  background: linear-gradient(135deg, #fde4e8, var(--im-pink) 40%, var(--im-pink-strong));
  box-shadow:
    0 0 0 8px rgba(236, 145, 160, 0.12),
    0 18px 50px -10px rgba(236, 145, 160, 0.9);
  animation: ty-pop 0.7s cubic-bezier(0.2, 0.9, 0.3, 1.3) both;
}

.ty__ring {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 1px solid rgba(247, 210, 216, 0.6);
  animation: ty-ring 2.6s ease-out 0.4s infinite;
}

.ty__title {
  margin-top: 28px;
  font-size: clamp(44px, 9vw, 84px);
  line-height: 1.05;
}

.ty__text {
  max-width: 520px;
  margin-top: 16px;
}

.ty__art {
  position: relative;
  width: min(240px, 70%);
  margin-top: 28px;
}

/* Alone dietro l'illustrazione: sul blu notte il PNG scontornato
   altrimenti galleggia nel vuoto. */
.ty__art::before {
  content: "";
  position: absolute;
  inset: 8% 0 0;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(247, 210, 216, 0.28), transparent);
  filter: blur(6px);
}

@media (min-width: 1024px) {
  .ty__art {
    width: 300px;
  }
}

.ty__img {
  position: relative;
  width: 100%;
  height: auto;
}

.ty__panel .ty__cta {
  width: auto;
  margin-top: 32px;
  padding-inline: 28px;
}

/* --- Scintille ------------------------------------------------------- */

.ty__sparks {
  position: absolute;
  top: 92px;
  left: 50%;
  width: 0;
  height: 0;
  pointer-events: none;
}

/* Centro del distintivo: padding in alto più metà della sua altezza. */
@media (min-width: 768px) {
  .ty__sparks {
    top: 110px;
  }
}

.ty__spark {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--im-pink);
  box-shadow: 0 0 12px var(--im-pink);
  opacity: 0;
  transform: rotate(calc(var(--n) * 45deg)) translateY(-40px);
  animation: ty-spark 2.8s ease-out calc(var(--n) * 0.08s + 0.3s) infinite;
}

.ty__spark:nth-child(even) {
  width: 4px;
  height: 4px;
  background: var(--im-teal);
  box-shadow: 0 0 10px var(--im-teal);
}

@keyframes ty-pop {
  from {
    opacity: 0;
    transform: scale(0.4);
  }
}

@keyframes ty-ring {
  0% {
    opacity: 0.9;
    transform: scale(1);
  }
  70%,
  100% {
    opacity: 0;
    transform: scale(1.7);
  }
}

@keyframes ty-spark {
  0% {
    opacity: 0;
    transform: rotate(calc(var(--n) * 45deg)) translateY(-40px) scale(0.4);
  }
  20% {
    opacity: 1;
  }
  60%,
  100% {
    opacity: 0;
    transform: rotate(calc(var(--n) * 45deg)) translateY(-96px) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ty__badge,
  .ty__ring,
  .ty__spark {
    animation: none;
  }

  .ty__ring {
    opacity: 0.5;
  }

  /* Le scintille restano, ferme intorno al distintivo. */
  .ty__spark {
    opacity: 0.8;
    transform: rotate(calc(var(--n) * 45deg)) translateY(-66px);
  }
}
</style>
