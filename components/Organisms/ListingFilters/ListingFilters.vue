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
          :text="t(`filter.${item}`)"
          @remove-filter="removeFilter(item)"
        />
      </div>
    </div>
    <AtomsButtonCTA
      v-if="filters"
      type="text"
      :text="$t('clearFilters')"
      @button-clicked="removeAllFilters"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const { t } = useI18n();
const emit = defineEmits(["update-filters"]);

const props = defineProps({
  filters: Object as () => any,
});

const allFilters = ref();

watch(props, () => {
  allFilters.value = props.filters;
});

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
