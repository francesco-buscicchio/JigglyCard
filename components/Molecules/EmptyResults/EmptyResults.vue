<template>
  <div class="empty">
    <div class="empty__icon" aria-hidden="true">
      <span class="empty__ring"></span>
      <Icon name="heroicons:magnifying-glass-20-solid" size="30" />
    </div>
    <div>
      <h5 class="empty__title">{{ t("catalog.empty.title") }}</h5>
      <p class="empty__text">{{ t("catalog.empty.subtitle") }}</p>
    </div>

    <div class="empty__actions">
      <div v-if="hasFilters" class="empty__action">
        <AtomsButtonCTA
          :text="t('catalog.empty.clearFilters')"
          @button-clicked="$emit('clearFilters')"
        />
      </div>
      <NuxtLink :to="PATH.HOME" class="im-btn im-btn--ghost empty__home">
        <Icon name="heroicons:home-20-solid" size="18" />
        {{ t("catalog.empty.backHome") }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PATH } from "~/data/const";

/**
 * Nessun risultato: prima era una pagina completamente vuota, senza spiegazione
 * né via d'uscita. Capita spesso incrociando due o tre filtri.
 */
defineProps({
  hasFilters: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["clearFilters"]);

const { t } = useI18n();
</script>

<style scoped>
/* Pannello di vetro come quelli della home, con un alone rosa dietro
   all'icona: lo stato vuoto non deve sembrare un errore. */
.empty {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  overflow: hidden;
  padding: 56px 20px;
  border-radius: 24px;
  border: 1px solid var(--im-line);
  background:
    radial-gradient(60% 80% at 50% 0%, rgba(236, 145, 160, 0.14), transparent 70%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
  text-align: center;
}

@media (min-width: 768px) {
  .empty {
    padding: 72px 40px;
  }
}

.empty__icon {
  position: relative;
  display: grid;
  place-items: center;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  color: #2a0a14;
  background: linear-gradient(135deg, #fde4e8, var(--im-pink-strong));
  box-shadow: 0 16px 40px -12px rgba(236, 145, 160, 0.7);
}

/* Onda che si allarga, come un radar che cerca. */
.empty__ring {
  position: absolute;
  inset: -1px;
  border-radius: 50%;
  border: 1px solid rgba(247, 210, 216, 0.6);
  animation: empty-ping 2.6s ease-out infinite;
}

.empty__title {
  color: var(--im-ink);
}

.empty__text {
  max-width: 44ch;
  margin: 8px auto 0;
  color: var(--im-muted);
}

.empty__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding-top: 4px;
}

.empty__home {
  min-height: 50px;
  font-size: 15px;
}

/* Gli span hanno `cursor: default` dal CSS di base: dentro al link no. */
.empty__home * {
  cursor: pointer;
}

@keyframes empty-ping {
  from {
    transform: scale(1);
    opacity: 0.8;
  }
  to {
    transform: scale(1.7);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .empty__ring {
    animation: none;
    opacity: 0;
  }
}
</style>
