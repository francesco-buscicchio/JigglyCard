<template>
  <nav class="pager" :aria-label="t('catalog.pagination.label')">
    <div v-if="totalPages > 1" class="pager__bar">
      <button
        type="button"
        class="pager__step"
        :disabled="currentPage <= 1"
        :aria-label="t('catalog.pagination.previous')"
        @click="changePage(currentPage - 1)"
      >
        <Icon name="heroicons:chevron-left-20-solid" size="20" />
        <span class="pager__step-label">{{ t("catalog.pagination.previous") }}</span>
      </button>

      <ol class="pager__pages">
        <li v-for="(item, index) in items" :key="`${index}-${item}`">
          <span v-if="item === GAP" class="pager__gap" aria-hidden="true">…</span>
          <button
            v-else
            type="button"
            class="pager__page"
            :class="{ 'is-current': item === currentPage }"
            :aria-current="item === currentPage ? 'page' : undefined"
            :aria-label="t('catalog.pagination.page', { n: item })"
            @click="changePage(item)"
          >
            {{ formatNumber(item) }}
          </button>
        </li>
      </ol>

      <span class="pager__compact">
        {{ t("catalog.pagination.pageOf", { n: formatNumber(currentPage), total: formatNumber(totalPages) }) }}
      </span>

      <button
        type="button"
        class="pager__step"
        :disabled="currentPage >= totalPages"
        :aria-label="t('catalog.pagination.next')"
        @click="changePage(currentPage + 1)"
      >
        <span class="pager__step-label">{{ t("catalog.pagination.next") }}</span>
        <Icon name="heroicons:chevron-right-20-solid" size="20" />
      </button>
    </div>

    <div class="pager__meta">
      <div class="pager__count">
        <span>
          {{ t("catalog.pagination.showing", { from: formatNumber(firstItem), to: formatNumber(lastItem), total: formatNumber(totalItems) }) }}
        </span>
        <span class="pager__progress" aria-hidden="true">
          <span :style="{ transform: `scaleX(${progress})` }"></span>
        </span>
      </div>

      <form v-if="totalPages > 7" class="pager__jump" @submit.prevent="jump">
        <label :for="jumpId">{{ t("catalog.pagination.goTo") }}</label>
        <input
          :id="jumpId"
          v-model.number="jumpTo"
          type="number"
          inputmode="numeric"
          :min="1"
          :max="totalPages"
          :placeholder="String(currentPage)"
        />
        <button type="submit" :aria-label="t('catalog.pagination.go')">
          <Icon name="heroicons:arrow-right-20-solid" size="18" />
        </button>
      </form>
    </div>
  </nav>
</template>

<script setup lang="ts">
/**
 * Paginazione del catalogo: numeri con i puntini quando le pagine sono tante
 * (1 … 5 6 7 … 610), conteggio dei prodotti visti e salto diretto a una
 * pagina. Su mobile i numeri lasciano il posto a "Pagina 6 di 610".
 */
const props = defineProps({
  totalItems: {
    type: Number,
    required: true,
    validator: (value: number) => value >= 0,
  },
  currentPage: {
    type: Number,
    required: true,
    validator: (value: number) => Number.isInteger(value) && value >= 1,
  },
  /** Prodotti per pagina: li decide la griglia (vedi `useListingGrid`). */
  perPage: {
    type: Number,
    default: 12,
  },
});

const emit = defineEmits(["currentPage"]);
const { t, locale } = useI18n();
const jumpId = useId();
const jumpTo = ref<number | "">("");

const GAP = "gap" as const;

const itemsForPage = computed(() => Math.max(1, props.perPage));

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.totalItems / itemsForPage.value)),
);

const firstItem = computed(() =>
  props.totalItems ? (props.currentPage - 1) * itemsForPage.value + 1 : 0,
);
const lastItem = computed(() =>
  Math.min(props.currentPage * itemsForPage.value, props.totalItems),
);
const progress = computed(() =>
  props.totalItems ? lastItem.value / props.totalItems : 0,
);

/**
 * Sempre sette posizioni: prima e ultima pagina, la corrente con le vicine e
 * i puntini dove servono, così la barra non cambia larghezza sfogliando.
 */
const items = computed<(number | typeof GAP)[]>(() => {
  const total = totalPages.value;
  const current = Math.min(props.currentPage, total);
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

  let left = Math.max(current - 1, 2);
  let right = Math.min(current + 1, total - 1);
  if (current <= 4) {
    left = 2;
    right = 5;
  } else if (current >= total - 3) {
    left = total - 4;
    right = total - 1;
  }

  const middle = Array.from({ length: right - left + 1 }, (_, index) => left + index);
  return [
    1,
    ...(left > 2 ? [GAP] : []),
    ...middle,
    ...(right < total - 1 ? [GAP] : []),
    total,
  ];
});

const formatNumber = (value: number) =>
  value.toLocaleString(locale.value.startsWith("it") ? "it-IT" : "en-US");

function changePage(page: number) {
  if (page < 1 || page > totalPages.value || page === props.currentPage) return;
  emit("currentPage", page);
}

function jump() {
  const page = Number(jumpTo.value);
  if (!Number.isFinite(page)) return;
  changePage(Math.min(totalPages.value, Math.max(1, Math.round(page))));
  jumpTo.value = "";
}
</script>

<style scoped>
.pager {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.pager__bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  border-radius: 999px;
  border: 1px solid var(--im-line);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02));
}

.pager__step {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 42px;
  padding: 0 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  color: var(--im-ink);
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.pager__step:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.08);
}

.pager__step:disabled {
  color: var(--im-muted);
  opacity: 0.4;
  cursor: not-allowed;
}

.pager__step-label {
  cursor: inherit;
}

.pager__pages {
  display: none;
  align-items: center;
  gap: 4px;
}

.pager__page {
  min-width: 42px;
  height: 42px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--im-muted);
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.pager__page:hover:not(.is-current) {
  color: var(--im-ink);
  background: rgba(255, 255, 255, 0.08);
}

.pager__page.is-current {
  color: #2a0a14;
  background: linear-gradient(135deg, #fde4e8 0%, var(--im-pink) 35%, var(--im-pink-strong) 100%);
  box-shadow: 0 8px 22px -8px rgba(236, 145, 160, 0.8);
  cursor: default;
}

.pager__step:focus-visible,
.pager__page:focus-visible,
.pager__jump button:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
}

.pager__gap {
  display: inline-flex;
  min-width: 24px;
  justify-content: center;
  color: var(--im-muted);
}

.pager__compact {
  padding: 0 6px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  color: var(--im-ink);
}

/* Da tablet in su i numeri; su mobile basta "Pagina 6 di 610". */
@media (min-width: 640px) {
  .pager__pages {
    display: flex;
  }

  .pager__compact {
    display: none;
  }
}

@media (max-width: 639px) {
  .pager__step-label {
    display: none;
  }
}

.pager__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px 24px;
}

.pager__count {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--im-muted);
}

.pager__progress {
  position: relative;
  width: 160px;
  height: 3px;
  overflow: hidden;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.12);
}

.pager__progress > span {
  position: absolute;
  inset: 0;
  transform-origin: left;
  background: linear-gradient(90deg, #fde4e8, var(--im-pink-strong));
  transition: transform 0.4s ease;
}

.pager__jump {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--im-muted);
}

.pager__jump input {
  width: 72px;
  height: 36px;
  padding: 0 10px;
  border-radius: 10px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.04);
  font-size: 14px;
  font-weight: 600;
  color: var(--im-ink);
  -moz-appearance: textfield;
}

.pager__jump input:focus {
  outline: none;
  border-color: var(--im-pink-strong);
  box-shadow: none;
}

.pager__jump input::-webkit-outer-spin-button,
.pager__jump input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.pager__jump button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  color: #2a0a14;
  background: linear-gradient(135deg, #fde4e8, var(--im-pink-strong));
}
</style>
