<template>
  <div>
    <AtomsButtonCTA @click="togglePanel" type="secondary">
      <h5>{{ t("filters") }}</h5>
    </AtomsButtonCTA>

    <transition name="fade">
      <div v-if="isOpen" class="overlay" @click.self="togglePanel"></div>
    </transition>

    <transition name="slide-right">
      <div v-if="isOpen" class="filter-panel bg-accent-50">
        <div class="flex items-center justify-between mt-4">
          <Icon
            name="jig:close-accent"
            class="ml-6"
            size="20"
            @click="togglePanel"
          />
          <h5 class="text-center w-full mr-18">{{ t("filters") }}</h5>
        </div>

        <!-- Filtri -->
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

          <!-- Prezzo slider -->
          <div class="mx-6 mt-4">
            <p>{{ t("price") }}</p>
            <div
              class="flex items-center justify-center whitespace-nowrap mt-2"
            >
              <span class="mr-2 w-20"
                >{{ t("da") }} {{ selectedMinPrice }}</span
              >
              <MoleculesSlider
                :min="minumPrice"
                :max="maxPrice"
                :initialMinPrice="selectedMinPrice"
                :initialMaxPrice="selectedMaxPrice"
                @update:minPrice="updateMinPrice"
                @update:maxPrice="updateMaxPrice"
              />
              <span class="ml-2 w-20">{{ t("a") }} {{ selectedMaxPrice }}</span>
            </div>
          </div>

          <!-- Input numero prezzo -->
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
              type="text"
              :class="areFiltersSelected ? 'visible' : 'invisible'"
              @click="resetAllFilters"
            >
              <p class="text-base">{{ t("clearFilters") }}</p>
            </AtomsButtonCTA>
            <AtomsButtonCTA
              @click="
                () => {
                  applyFilters(emit);
                  togglePanel();
                }
              "
            >
              <h5>{{ t("apply") }}</h5>
            </AtomsButtonCTA>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useFilterLogic } from "@/composables/useFilterLogic";

const { t } = useI18n();
const emit = defineEmits(["filterUpdate"]);

const props = defineProps({
  filters: Array<string>,
});

const isOpen = ref(false);
function togglePanel() {
  isOpen.value = !isOpen.value;
}

watch(isOpen, (newVal) => {
  document.body.style.overflow = newVal ? "hidden" : "";
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
  await fetchFilters();
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

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.5s ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.filter-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: calc(100vw - 20px);
  display: flex;
  flex-direction: column;
  height: 100%;
  z-index: 1000;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  overflow-y: auto;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.custom-checkbox {
  border: 1px solid #003849;
}

.bottom-container {
  margin-top: auto;
  padding: 16px;
}
</style>
