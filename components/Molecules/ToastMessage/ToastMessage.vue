<template>
  <Teleport to="#teleports">
    <!-- Teleport: il toast è `fixed`, ma dentro un pannello di vetro
         (backdrop-filter) o un elemento in entrata (transform) si sarebbe
         posizionato rispetto a quello invece che allo schermo. La regione
         aria-live resta sempre in pagina, così l'annuncio parte davvero. -->
    <div class="toast-region" aria-live="polite" aria-atomic="true">
      <transition name="toast">
        <div v-if="visible" class="toast-card" :class="toastStyle.background">
          <span class="toast-card__icon" aria-hidden="true">
            <Icon :name="toastStyle.iconName" size="18" />
          </span>
          <p class="toast-card__text">{{ text }}</p>
          <span :key="triggerKey" class="toast-card__timer" aria-hidden="true"></span>
        </div>
      </transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    default: "success",
    required: true,
    validator: (value: string) =>
      ["success", "warning", "error", "info"].includes(value),
  },
  text: {
    type: String,
    default: "",
  },
  triggerKey: Number,
});
const visible = ref(false);

// `background` ora è la variante di colore della card (vedi CSS): niente più
// fasce piene verde/giallo/rosso, ma un accento sul vetro scuro. Icone
// heroicons, già installate (le altre raccolte venivano scaricate a runtime).
const toastMap: Record<
  "success" | "warning" | "error" | "info",
  { iconName: string; background: string }
> = {
  success: {
    iconName: "heroicons:check-circle-20-solid",
    background: "toast-card--success",
  },
  warning: {
    iconName: "heroicons:exclamation-triangle-20-solid",
    background: "toast-card--warning",
  },
  error: {
    iconName: "heroicons:x-circle-20-solid",
    background: "toast-card--error",
  },
  info: {
    iconName: "heroicons:information-circle-20-solid",
    background: "toast-card--info",
  },
};

const toastStyle = computed(() => {
  return (
    toastMap[props.type as "success" | "warning" | "error" | "info"] ||
    toastMap.info
  );
});

let timeoutId: ReturnType<typeof setTimeout> | null = null;

watch(
  () => props.triggerKey,
  () => {
    visible.value = true;

    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      visible.value = false;
      timeoutId = null;
    }, 3000);
  }
);
</script>

<style scoped>
/* Fascia invisibile in cima allo schermo che centra il toast; non blocca
   i click sulla pagina sotto. */
.toast-region {
  position: fixed;
  top: 16px;
  left: 0;
  right: 0;
  z-index: 1001;
  display: flex;
  justify-content: center;
  padding: 0 16px;
  pointer-events: none;
}

.toast-card {
  --toast-accent: var(--im-teal);
  --toast-glow: rgba(92, 200, 224, 0.18);
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  width: max-content;
  max-width: min(480px, 100%);
  overflow: hidden;
  padding: 10px 18px 10px 10px;
  border-radius: 18px;
  border: 1px solid var(--im-line);
  background:
    radial-gradient(120% 160% at 0% 50%, var(--toast-glow), transparent 60%),
    rgba(17, 20, 52, 0.94);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow:
    0 24px 50px -16px rgba(0, 0, 0, 0.75),
    0 0 0 1px rgba(255, 255, 255, 0.04) inset;
  pointer-events: auto;
}

.toast-card--success {
  --toast-accent: #6ee7b7;
  --toast-glow: rgba(110, 231, 183, 0.18);
}

.toast-card--warning {
  --toast-accent: var(--im-gold);
  --toast-glow: rgba(255, 210, 122, 0.18);
}

.toast-card--error {
  --toast-accent: var(--im-rose);
  --toast-glow: rgba(224, 81, 104, 0.22);
}

.toast-card--info {
  --toast-accent: var(--im-violet);
  --toast-glow: rgba(167, 139, 250, 0.2);
}

.toast-card__icon {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  color: #070a1f;
  background: var(--toast-accent);
  box-shadow: 0 0 18px -4px var(--toast-accent);
}

.toast-card__text {
  font-size: 14px;
  line-height: 1.4;
  font-weight: 600;
  color: var(--im-ink);
}

/* Barra che si consuma nei 3 secondi in cui il toast resta visibile. */
.toast-card__timer {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 100%;
  transform-origin: left;
  background: var(--toast-accent);
  opacity: 0.7;
  animation: toast-timer 3s linear forwards;
}

@keyframes toast-timer {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.97);
}

.toast-enter-active {
  transition:
    opacity 0.3s ease-out,
    transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.toast-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.toast-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media (prefers-reduced-motion: reduce) {
  .toast-enter-from,
  .toast-leave-to {
    transform: none;
  }

  .toast-card__timer {
    animation: none;
    opacity: 0;
  }
}
</style>
