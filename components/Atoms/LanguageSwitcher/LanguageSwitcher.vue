<template>
  <!-- Una lingua per ogni paese in cui si spedisce: troppe per dei pulsanti.
       Sopra si vede la pillola, sotto c'è un <select> nativo trasparente che
       riceve clic e tastiera e sul telefono apre l'elenco del sistema. -->
  <div class="lang-select" :class="{ 'lang-select--full': full }">
    <Icon name="heroicons:language-20-solid" size="16" class="lang-select__icon" />
    <span class="lang-select__current" aria-hidden="true">
      {{ full ? current?.name : String(locale).toUpperCase() }}
    </span>
    <Icon name="heroicons:chevron-down-20-solid" size="14" class="lang-select__chevron" />
    <select
      class="lang-select__native"
      :aria-label="t('layout.header.language')"
      :value="locale"
      @change="choose(($event.target as HTMLSelectElement).value)"
    >
      <option
        v-for="option in options"
        :key="option.code"
        :value="option.code"
        :lang="option.language"
      >
        {{ option.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
type LocaleOption = { code: string; language?: string; name?: string };

/** `full`: mostra il nome della lingua invece della sigla (menu mobile). */
defineProps<{ full?: boolean }>();

const { t, locale, locales, setLocale } = useI18n();
const localeCookie = useLocaleCookie();

/**
 * Le lingue sono quelle di `i18n.locales` (nuxt.config), ognuna col proprio
 * nome nella propria lingua: italiano e inglese in cima, poi alfabetico.
 */
const PINNED = ["it", "en"];
const options = computed(() =>
  [...(locales.value as LocaleOption[])].sort(
    (a, b) =>
      (PINNED.indexOf(a.code) + 1 || 99) - (PINNED.indexOf(b.code) + 1 || 99) ||
      String(a.name).localeCompare(String(b.name)),
  ),
);
const current = computed(() => options.value.find((option) => option.code === locale.value));

const choose = async (code: string) => {
  if (code === locale.value) return;
  localeCookie.value = code;
  await setLocale(code);
};
</script>

<style scoped>
.lang-select {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 34px;
  padding: 0 10px 0 12px;
  border-radius: 999px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.05);
  font-family: "Roboto Flex", sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--im-ink);
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.lang-select:hover {
  border-color: rgba(247, 210, 216, 0.4);
  background: rgba(255, 255, 255, 0.08);
}

.lang-select:focus-within {
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
}

.lang-select--full {
  min-height: 44px;
  padding: 0 14px 0 16px;
  font-size: 15px;
  letter-spacing: 0;
}

.lang-select__icon,
.lang-select__chevron {
  flex: none;
  color: var(--im-muted);
}

.lang-select__current {
  white-space: nowrap;
}

/* Copre tutta la pillola: il clic arriva al select, che resta invisibile. */
.lang-select__native {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  appearance: none;
  font-size: 16px;
}

/* Elenco del sistema su Windows: fondo scuro esplicito, come nel checkout. */
.lang-select__native option {
  color: var(--im-ink);
  background-color: #12163b;
}

@media (prefers-reduced-motion: reduce) {
  .lang-select {
    transition: none;
  }
}
</style>
