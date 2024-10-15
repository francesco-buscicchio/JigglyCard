<template>
  <div class="flex flex-col gap-y-4">
    <div
      class="flex flex-row items-start flex-wrap gap-2"
      v-if="filterList.length"
    >
      <AtomsFilterTag
        v-for="item of filterList"
        :text="t(`filter.${item}`)"
        @remove-filter="removeFilter(item)"
      />
    </div>
    <AtomsButtonCTA
      v-if="filterList.length"
      type="text"
      :text="$t('clearFilters')"
      @button-clicked="removeAllFilter"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const { t } = useI18n();
const emit = defineEmits(["update-filters"]);

const filterList = ref<String[]>([]);
const props = defineProps({
  filters: Array<String>,
});

watch(props, () => {
  filterList.value = props.filters ?? [];
});

const removeAllFilter = () => {
  filterList.value = [];
  emit("update-filters", filterList.value);
};

const removeFilter = (item: String) => {
  filterList.value = filterList.value.filter((val) => val !== item);
  emit("update-filters", filterList.value);
};
</script>
