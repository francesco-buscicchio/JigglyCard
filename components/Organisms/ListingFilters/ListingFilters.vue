<template>
  <div class="flex flex-col gap-y-4">
    <div v-if="allFilters" class="flex flex-row flex-wrap gap-2">
      <div
        v-for="key in allFilters"
        class="flex flex-row items-start flex-wrap gap-2"
      >
        <AtomsFilterTag
          v-for="item of key"
          :key="item"
          :text="labelFor(item)"
          @remove-filter="removeFilter(item)"
        />
      </div>
    </div>
    <AtomsButtonCTA
      v-if="filters"
      type="text"
      :text="t('clearFilters')"
      @button-clicked="removeAllFilters"
    />
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
