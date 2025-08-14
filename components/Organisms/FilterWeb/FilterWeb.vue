<template>
  <div class="bg-accent-50 rounded-lg w-[400px]">
    <div class="flex items-center justify-center py-10">
      <h5>{{ t("filters") }}</h5>
    </div>

    <div>
      <div v-for="category of filterCategories" :key="category.objectID">
        <MoleculesAccordion>
          <template #header>
            <p>{{ t(`filter.${category.name}`) }}</p>
          </template>
          <div
            v-for="(item, index) of category.value"
            :key="item.id"
            class="mb-4"
          >
            <div class="flex items-center ml-6">
              <AtomsCheckbox
                :id="`${category.objectID}-${index}`"
                :modelValue="item.checked"
                @update:modelValue="
                  updateCheckboxValue(category.objectID, index, $event)
                "
                class="mr-6 bg-white custom-checkbox"
              />
              <p class="text-left">{{ t(`filter.${item.name}`) }}</p>
            </div>
          </div>
        </MoleculesAccordion>
      </div>

      <!-- Slider Prezzo -->
      <div class="mx-6 mt-4">
        <p>{{ t("price") }}</p>
        <div class="flex items-center justify-center whitespace-nowrap mt-2">
          <span class="mr-2 w-20">{{ t("da") }} {{ selectedMinPrice }}</span>
          <MoleculesSlider
            :min="minumPrice.value"
            :max="maxPrice.value"
            :initialMinPrice="selectedMinPrice"
            :initialMaxPrice="selectedMaxPrice"
            @update:minPrice="updateMinPrice"
            @update:maxPrice="updateMaxPrice"
          />
          <span class="ml-2 w-20">{{ t("a") }} {{ selectedMaxPrice }}</span>
        </div>
      </div>

      <!-- Input Prezzo -->
      <div class="flex items-center my-6">
        <p class="ml-12 mr-6">{{ t("min") }}</p>
        <AtomsInputNumber
          v-model="selectedMinPrice"
          @updateValue="onMinPriceInput"
          :min="minumPrice"
          :max="selectedMaxPrice"
          :step="0.01"
          status="default"
          placeholder="Prezzo minimo"
        />
      </div>
      <div class="flex items-center">
        <p class="ml-12 mr-6">{{ t("max") }}</p>
        <AtomsInputNumber
          v-model="selectedMaxPrice"
          @updateValue="onMaxPriceInput"
          :min="minumPrice"
          :max="selectedMaxPrice"
          :step="0.01"
          status="default"
          placeholder="Prezzo massimo"
        />
      </div>
    </div>

    <!-- Pulsanti -->
    <div class="bottom-container">
      <div class="flex mt-4 mb-6 mr-6">
        <AtomsButtonCTA
          class="text-underlined"
          :class="areFiltersSelected ? 'visible' : 'invisible'"
          type="text"
          @click="resetAllFilters"
        >
          <p class="text-base">{{ t("clearFilters") }}</p>
        </AtomsButtonCTA>
        <AtomsButtonCTA @click="() => applyFilters(emit)">
          <h5>{{ t("apply") }}</h5>
        </AtomsButtonCTA>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useFilterLogic } from "@/composables/useFilterLogic";

const { t } = useI18n();
const emit = defineEmits(["filterUpdate"]);

const props = defineProps({
  filters: Array<String>,
});

const {
  filterCategories,
  selectedMinPrice,
  selectedMaxPrice,
  minumPrice,
  maxPrice,
  areFiltersSelected,
  fetchFilters,
  updateCheckboxValue,
  applyFilters,
  resetAllFilters,
  updateSelectedFilters,
  updateMinPrice,
  updateMaxPrice,
  onMinPriceInput,
  onMaxPriceInput,
} = useFilterLogic(props.filters ?? [], emit);

onMounted(async () => {
  await fetchFilters(); // attendo che i filtri siano pronti
  updateSelectedFilters(props.filters ?? []);
});

watch(
  () => props.filters,
  (newFilters) => {
    updateSelectedFilters(newFilters ?? []);
  }
);
</script>

<style scoped>
.text-underlined {
  text-decoration: underline;
}

.custom-checkbox {
  border: 1px solid #003849;
}

.bottom-container {
  margin-top: auto;
  padding: 16px;
}
</style>
