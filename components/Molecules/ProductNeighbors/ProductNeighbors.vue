<template>
  <nav
    v-if="data && (data.previous || data.next)"
    class="neighbors"
    :aria-label="t('product.neighbors.label')"
  >
    <NuxtLink
      v-if="data.previous"
      :to="data.previous.url"
      class="neighbors__link neighbors__link--prev"
      rel="prev"
    >
      <Icon name="heroicons:chevron-left-20-solid" size="20" class="neighbors__arrow" />
      <img :src="data.previous.image" alt="" class="neighbors__thumb" loading="lazy" />
      <span class="neighbors__text">
        <span class="neighbors__kicker">{{ t("product.neighbors.previous") }} · {{ data.previous.collectorNumber }}</span>
        <span class="neighbors__name">{{ nameOf(data.previous) }}</span>
      </span>
    </NuxtLink>
    <span v-else class="neighbors__spacer" aria-hidden="true"></span>

    <NuxtLink
      v-if="data.next"
      :to="data.next.url"
      class="neighbors__link neighbors__link--next"
      rel="next"
    >
      <span class="neighbors__text">
        <span class="neighbors__kicker">{{ t("product.neighbors.next") }} · {{ data.next.collectorNumber }}</span>
        <span class="neighbors__name">{{ nameOf(data.next) }}</span>
      </span>
      <img :src="data.next.image" alt="" class="neighbors__thumb" loading="lazy" />
      <Icon name="heroicons:chevron-right-20-solid" size="20" class="neighbors__arrow" />
    </NuxtLink>
    <span v-else class="neighbors__spacer" aria-hidden="true"></span>
  </nav>
</template>

<script setup lang="ts">
/**
 * Carta precedente e successiva per numero di collezione nello stesso set:
 * si scorre il set dalla scheda prodotto, anche con le frecce ← → della
 * tastiera.
 */
type Neighbor = {
  slug: string;
  name: string;
  nameIt?: string;
  collectorNumber: string;
  image: string;
  url: string;
};

const props = defineProps<{ slug: string }>();

const { t, locale } = useI18n();
const data = ref<{
  previous: Neighbor | null;
  next: Neighbor | null;
} | null>(null);

const nameOf = (card: Neighbor) =>
  locale.value.startsWith("it") && card.nameIt ? card.nameIt : card.name;

const load = async (slug: string) => {
  data.value = null;
  data.value = await $fetch<typeof data.value>(
    `/api/shop/products/${encodeURIComponent(slug)}/neighbors`,
  ).catch(() => null);
};

watch(() => props.slug, load);

/** ← → fuori dai campi di testo, come in una galleria. */
const onKeydown = (event: KeyboardEvent) => {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
  const target = event.target as HTMLElement | null;
  if (target?.closest("input, textarea, select, [contenteditable], [role='listbox']")) return;
  const card =
    event.key === "ArrowLeft" ? data.value?.previous : event.key === "ArrowRight" ? data.value?.next : null;
  if (card) navigateTo(card.url);
};

onMounted(() => {
  load(props.slug);
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
</script>

<style scoped>
.neighbors {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.neighbors__link {
  display: flex;
  min-width: 0;
  max-width: 46%;
  align-items: center;
  gap: 10px;
  padding: 6px 12px 6px 8px;
  border-radius: 14px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.04);
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;
}

.neighbors__link--next {
  padding: 6px 8px 6px 12px;
  text-align: right;
}

.neighbors__link:hover {
  border-color: rgba(247, 210, 216, 0.5);
  background: rgba(255, 255, 255, 0.08);
}

.neighbors__link--prev:hover {
  transform: translateX(-2px);
}

.neighbors__link--next:hover {
  transform: translateX(2px);
}

.neighbors__link:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
}

.neighbors__arrow {
  flex: none;
  color: var(--im-pink);
}

.neighbors__thumb {
  width: 30px;
  height: 42px;
  flex: none;
  border-radius: 4px;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.06);
}

.neighbors__text {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.neighbors__kicker {
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--im-muted);
  cursor: inherit;
}

.neighbors__name {
  overflow: hidden;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--im-ink);
  cursor: inherit;
}

.neighbors__spacer {
  flex: 1;
  max-width: 46%;
}

@media (max-width: 639px) {
  .neighbors__thumb {
    display: none;
  }
}
</style>
