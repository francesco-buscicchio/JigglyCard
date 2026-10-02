<template>
  <div v-if="hasActiveFilters" class="flex flex-row flex-wrap items-center gap-2">
    <template v-for="key in allFilters">
      <AtomsFilterTag
        v-for="item of key"
        :key="item"
        :text="labelFor(item)"
        @remove-filter="removeFilter(item)"
      />
    </template>
    <button type="button" class="clear-all" @click="removeAllFilters">
      {{ t("catalog.controls.clear") }}
    </button>
  </div>
</template>

<script setup lang="ts">
const { t, te } = useI18n();
const emit = defineEmits(["update-filters"]);

const props = defineProps({
  filters: Object as () => any,
  /** Slug -> nome leggibile, per espansioni, giochi e categorie. */
  filterLabels: {
    type: Object as () => Record<string, Record<string, string>>,
    default: () => ({}),
  },
});

/**
 * I valori attivi sono slug tecnici: qui si risolvono nel nome mostrato,
 * altrimenti la pillola direbbe "ascended-heroes".
 */
const labelFor = (value: string) => {
  const key = `filter.${value}`;
  if (te(key)) return t(key);

  const categoryKey = `category.${value}`;
  if (te(categoryKey)) return t(categoryKey);

  for (const group of Object.values(props.filterLabels ?? {})) {
    if (group?.[value]) return group[value];
  }
  return value;
};

const allFilters = computed(() => props.filters);

/** I filtri arrivano sempre come oggetto: conta se c'è almeno una voce. */
const hasActiveFilters = computed(() =>
  Object.values(allFilters.value ?? {}).some(
    (values) => Array.isArray(values) && values.length > 0,
  ),
);
const removeAllFilters = () => {
  for (let key in allFilters.value) allFilters.value[key] = [];

  emit("update-filters", toRaw(allFilters.value));
};

const removeFilter = (item: string) => {
  for (let key in allFilters.value) {
    allFilters.value[key] = allFilters.value[key].filter((val: string) => {
      return val !== item;
    });
  }

  emit("update-filters", toRaw(allFilters.value));
};
</script>

<style scoped>
.clear-all {
  padding: 4px 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--im-pink);
}

.clear-all:hover {
  text-decoration: underline;
}
</style>
