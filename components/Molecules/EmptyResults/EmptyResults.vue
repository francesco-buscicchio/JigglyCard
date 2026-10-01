<template>
  <div
    class="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-neutrals-300 px-6 py-16 text-center"
  >
    <Icon name="jig:cerca-accent" size="40" />
    <div>
      <h5 class="text-accent-950">{{ t("catalog.empty.title") }}</h5>
      <p class="pt-2 text-neutrals-600">{{ t("catalog.empty.subtitle") }}</p>
    </div>

    <div class="flex flex-wrap justify-center gap-3 pt-2">
      <AtomsButtonCTA
        v-if="hasFilters"
        :text="t('catalog.empty.clearFilters')"
        @button-clicked="$emit('clearFilters')"
      />
      <NuxtLink :to="PATH.HOME" class="underline text-accent-950 self-center">
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
