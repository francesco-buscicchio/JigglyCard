<template>
  <!-- Menu mobile: le lingue sono già in vista, una griglia di pulsanti. -->
  <div
    v-if="inline"
    class="lang-grid"
    role="group"
    :aria-label="t('layout.header.language')"
  >
    <button
      v-for="option in options"
      :key="option.code"
      type="button"
      class="lang-option"
      :class="{ 'is-active': option.code === locale }"
      :aria-pressed="option.code === locale"
      :lang="option.language"
      @click="choose(option.code)"
    >
      <span class="lang-option__code">{{ option.code.toUpperCase() }}</span>
      <span class="lang-option__name">{{ option.name }}</span>
    </button>
  </div>

  <!-- Header: una pillola con la sigla che apre il pannello delle lingue. -->
  <div v-else ref="root" class="lang" @keydown.esc="close(true)">
    <button
      ref="trigger"
      type="button"
      class="lang__trigger"
      :class="{ 'is-open': open }"
      :aria-expanded="open"
      :aria-controls="panelId"
      :aria-label="`${t('layout.header.language')}: ${current?.name ?? ''}`"
      @click="open ? close() : openPanel()"
    >
      <Icon name="heroicons:language-20-solid" size="16" class="lang__icon" />
      <span>{{ String(locale).toUpperCase() }}</span>
      <Icon name="heroicons:chevron-down-20-solid" size="14" class="lang__chevron" />
    </button>

    <transition name="lang-pop">
      <div v-if="open" :id="panelId" ref="panel" class="lang__panel">
        <p class="lang__title">{{ t("layout.header.language") }}</p>
        <div class="lang__list">
          <button
            v-for="option in options"
            :key="option.code"
            type="button"
            class="lang-option"
            :class="{ 'is-active': option.code === locale }"
            :aria-pressed="option.code === locale"
            :lang="option.language"
            @click="choose(option.code)"
          >
            <span class="lang-option__code">{{ option.code.toUpperCase() }}</span>
            <span class="lang-option__name">{{ option.name }}</span>
            <Icon
              v-if="option.code === locale"
              name="heroicons:check-20-solid"
              size="16"
              class="lang-option__check"
            />
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
type LocaleOption = { code: string; language?: string; name?: string };

/** `inline`: tutte le lingue in vista, senza pannello (menu mobile). */
defineProps<{ inline?: boolean }>();

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

const open = ref(false);
const root = ref<HTMLElement | null>(null);
const trigger = ref<HTMLButtonElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const panelId = useId();

/** All'apertura il fuoco va sulla lingua attuale, pronta per Tab o Invio. */
const openPanel = async () => {
  open.value = true;
  await nextTick();
  panel.value?.querySelector<HTMLButtonElement>(".is-active")?.focus();
};

const close = (restoreFocus = false) => {
  if (!open.value) return;
  open.value = false;
  if (restoreFocus) trigger.value?.focus();
};

// Un clic fuori dal selettore, o il fuoco che esce col Tab, lo richiude.
const onPointerDown = (event: PointerEvent) => {
  if (root.value && !root.value.contains(event.target as Node)) close();
};
const onFocusIn = (event: FocusEvent) => {
  if (root.value && !root.value.contains(event.target as Node)) close();
};
onMounted(() => {
  document.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("focusin", onFocusIn);
});
onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onPointerDown);
  document.removeEventListener("focusin", onFocusIn);
});

const choose = async (code: string) => {
  close(true);
  if (code === locale.value) return;
  localeCookie.value = code;
  await setLocale(code);
};
</script>

<style scoped>
.lang {
  position: relative;
}

.lang__trigger {
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
  letter-spacing: 0.06em;
  color: var(--im-ink);
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.lang__trigger:hover,
.lang__trigger.is-open {
  border-color: rgba(247, 210, 216, 0.45);
  background: rgba(247, 210, 216, 0.1);
}

.lang__trigger:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
}

.lang__icon {
  color: var(--im-pink);
}

.lang__chevron {
  color: var(--im-muted);
  transition: transform 0.25s ease;
}

.lang__trigger.is-open .lang__chevron {
  transform: rotate(180deg);
}

/* Pannello di vetro come la tendina della ricerca, allineato a destra. */
.lang__panel {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  z-index: 60;
  width: 360px;
  max-height: min(80vh, 560px);
  overflow-y: auto;
  padding: 14px;
  border-radius: 22px;
  border: 1px solid var(--im-line);
  background:
    radial-gradient(120% 60% at 100% 0%, rgba(236, 145, 160, 0.14), transparent 70%),
    rgba(10, 13, 38, 0.97);
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  scrollbar-width: thin;
}

.lang__title {
  margin: 2px 6px 10px;
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--im-muted);
}

.lang__list,
.lang-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2px;
}

.lang-grid {
  gap: 6px;
}

/* 36px: le 22 lingue stanno nel pannello senza scorrere su uno schermo da 720px. */
.lang-option {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 36px;
  padding: 0 10px;
  border-radius: 12px;
  border: 1px solid transparent;
  text-align: left;
  color: var(--im-ink);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.lang-grid .lang-option {
  min-height: 46px;
  border-color: var(--im-line);
  background: rgba(255, 255, 255, 0.03);
}

.lang-option:hover {
  background: rgba(255, 255, 255, 0.07);
}

.lang-option:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 1px;
}

.lang-option.is-active {
  border-color: rgba(247, 210, 216, 0.5);
  background: linear-gradient(135deg, rgba(253, 228, 232, 0.16), rgba(236, 145, 160, 0.12));
}

.lang-option__code {
  flex: none;
  display: grid;
  place-items: center;
  width: 30px;
  height: 22px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.07);
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--im-muted);
}

.lang-option.is-active .lang-option__code {
  background: linear-gradient(135deg, #fde4e8, var(--im-pink-strong));
  color: #2a0a14;
}

.lang-option__name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.lang-option__check {
  flex: none;
  color: var(--im-pink);
}

.lang-pop-enter-active,
.lang-pop-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.lang-pop-enter-from,
.lang-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (prefers-reduced-motion: reduce) {
  .lang__trigger,
  .lang__chevron,
  .lang-option,
  .lang-pop-enter-active,
  .lang-pop-leave-active {
    transition: none;
  }
}
</style>
