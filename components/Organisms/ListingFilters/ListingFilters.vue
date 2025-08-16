<template>
  <div class="flex flex-col gap-y-4">
    <div class="flex flex-row flex-wrap gap-2">
      <!-- Filtri di tipo array -->
      <template v-for="(value, key) in visibleFilters" :key="key">
        <AtomsFilterTag
          v-for="item in value"
          :key="`${key}-${item}`"
          :text="item"
          @remove-filter="() => removeFilter(item)"
        />
      </template>

      <!-- Prezzo -->
      <AtomsFilterTag
        v-if="filters?.price?.min !== undefined"
        :text="`Min: €${filters.price.min}`"
        @remove-filter="() => removePriceFilter('min')"
      />
      <AtomsFilterTag
        v-if="filters?.price?.max !== undefined"
        :text="`Max: €${filters.price.max}`"
        @remove-filter="() => removePriceFilter('max')"
      />
    </div>

    <!-- Pulsante per rimuovere tutto -->
    <AtomsButtonCTA
      v-if="hasAnyFilter"
      type="text"
      :text="t('clearFilters')"
      @button-clicked="removeAllFilters"
    />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const emit = defineEmits(["update-filters"]);

const props = defineProps({
  filters: Object as () => Record<string, any>,
});

// Computed per visualizzare solo i filtri di tipo array con valori
const visibleFilters = computed(() => {
  const result: Record<string, string[]> = {};

  for (const [key, value] of Object.entries(props.filters ?? {})) {
    if (Array.isArray(value) && value.length > 0) {
      result[key] = value;
    }
  }

  return result;
});

// Controlla se ci sono filtri attivi
const hasAnyFilter = computed(() => {
  const arraysHaveValues = Object.values(visibleFilters.value).some(
    (arr) => arr.length > 0
  );

  const price = props.filters?.price ?? {};
  const priceHasValues = price.min !== undefined || price.max !== undefined;

  return arraysHaveValues || priceHasValues;
});

// Rimuove un filtro di tipo stringa
const removeFilter = (item: string) => {
  const updated = structuredClone(toRaw(props.filters));

  for (const key in updated) {
    if (Array.isArray(updated[key])) {
      updated[key] = updated[key].filter((val: string) => val !== item);
    }
  }

  emit("update-filters", updated);
};

// Rimuove solo il min o il max dal filtro prezzo
const removePriceFilter = (target: "min" | "max") => {
  const updated = structuredClone(toRaw(props.filters));

  if (updated!.price) {
    delete updated!.price[target];

    // Se entrambi rimossi, elimina tutta la chiave price
    if (updated!.price.min === undefined && updated!.price.max === undefined) {
      delete updated!.price;
    }
  }

  emit("update-filters", updated);
};

// Rimuove tutti i filtri
const removeAllFilters = () => {
  const reset: Record<string, any> = {};

  for (const key in props.filters) {
    if (Array.isArray(props.filters[key])) {
      reset[key] = [];
    }
  }

  emit("update-filters", reset);
};
</script>
