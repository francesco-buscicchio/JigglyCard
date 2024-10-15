<template>
  <div>
    <AtomsButtonCTA @click="togglePanel" type="secondary">
      <h5>{{ $t("filters") }}</h5>
    </AtomsButtonCTA>

    <transition name="fade">
      <div v-if="isOpen" class="overlay" @click.self="togglePanel"></div>
    </transition>

    <transition name="slide-right">
      <div v-show="isOpen" class="filter-panel bg-accent-50">
        <div class="flex items-center justify-between mt-4 mb-4">
          <Icon
            name="jig:close-accent"
            class="ml-6"
            size="20"
            @click="togglePanel"
          ></Icon>
          <h5 class="text-center w-full mr-18">
            {{ $t("filters") }}
          </h5>
        </div>

        <div>
          <div
            v-for="(category, catIndex) in filterCategories"
            :key="category.id"
          >
            <MoleculesAccordion>
              <template #header>
                <p>{{ $t(`filter.${category.name}`) }}</p>
              </template>
              <div
                v-for="(item, index) in category.value"
                :key="item.id"
                class="mb-4"
              >
                <div class="flex items-center ml-6">
                  <AtomsCheckbox
                    :id="index.toString()"
                    :modelValue="item.checked"
                    @update:modelValue="
                      updateCheckboxValue(catIndex, index, $event)
                    "
                    class="mr-6 bg-white custom-checkbox"
                  >
                    {{ item }}
                  </AtomsCheckbox>
                  <p class="text-left">{{ $t(`filter.${item}`) }}</p>
                </div>
              </div>
            </MoleculesAccordion>
          </div>

          <div class="mx-6 mt-4">
            <p>{{ $t("prezzo") }}</p>
            <div
              class="flex items-center justify-center whitespace-nowrap mt-2"
            >
              <span class="mr-2 w-20"
                >{{ $t("da") }} {{ selectedMinPrice }}</span
              >
              <MoleculesSlider
                :min="0"
                :max="5000"
                :initialMinPrice="selectedMinPrice"
                :initialMaxPrice="selectedMaxPrice"
                @update:minPrice="updateMinPrice($event)"
                @update:maxPrice="updateMaxPrice($event)"
              />
              <span class="ml-2 w-20"
                >{{ $t("a") }} {{ selectedMaxPrice }}</span
              >
            </div>
          </div>
        </div>

        <div class="flex mt-4 mb-6 mr-6">
          <AtomsButtonCTA
            class="text-underlined"
            type="text"
            @click="resetAllFilters"
          >
            <p>{{ $t("cancellaTuttiIFiltri") }}</p>
          </AtomsButtonCTA>
          <AtomsButtonCTA @click="applyFilters">
            <h5>{{ $t("applica") }}</h5>
          </AtomsButtonCTA>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { FILTERS_COLLECTION } from "~/data/const";

const isOpen = ref(false);
const selectedMinPrice = ref(0);
const selectedMaxPrice = ref(5000);
const selectedFilters = reactive<{ [key: string]: any }>({});
const config = useRuntimeConfig();

const filterCategories = ref();
const client = useAlgolia();

onMounted(async () => {
  let results = await client.searchSingleIndex({
    indexName: FILTERS_COLLECTION,
  });
  filterCategories.value = results.hits;
});

const emit = defineEmits(["filterUpdate"]);

function updateCheckboxValue(
  categoryIndex: number,
  filterIndex: number,
  value: boolean
) {
  const category = filterCategories.value[categoryIndex];
  const filter = category.filters[filterIndex];

  filter.checked = value;

  if (value) {
    if (!selectedFilters[category.name]) {
      selectedFilters[category.name] = [];
    }
    selectedFilters[category.name].push(filter.name);
  } else {
    const index = selectedFilters[category.name]?.indexOf(filter.name);
    if (index > -1) {
      selectedFilters[category.name].splice(index, 1);
    }
    if (selectedFilters[category.name]?.length === 0) {
      delete selectedFilters[category.name];
    }
  }
}

function updateMinPrice(value: number) {
  selectedMinPrice.value = value;
  if (selectedMaxPrice.value < value) {
    selectedMaxPrice.value = value;
  }
}

function updateMaxPrice(value: number) {
  selectedMaxPrice.value = Math.min(value, 5000);
}

function applyFilters() {
  selectedFilters["Prezzo"] = {
    min: selectedMinPrice.value,
    max: selectedMaxPrice.value,
  };

  emit("filterUpdate", toRaw(selectedFilters));
  isOpen.value = false;
}

function resetAllFilters() {
  filterCategories.value.forEach((category) => {
    category.filters.forEach((filter) => {
      filter.checked = false;
    });
  });
  Object.keys(selectedFilters).forEach((key) => {
    delete selectedFilters[key];
  });
  selectedMinPrice.value = 0;
  selectedMaxPrice.value = 5000;
  selectedFilters["Prezzo"] = { min: 0, max: 5000 };
}

function togglePanel() {
  isOpen.value = !isOpen.value;
}

watch(isOpen, (newValue) => {
  document.body.style.overflow = newValue ? "hidden" : "";
});
</script>

<style scoped>
.text-underlined {
  text-decoration: underline;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter,
.slide-right-leave-to {
  transform: translateX(100%);
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
  max-width: 400px;
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
  z-index: 999;
}

.custom-checkbox {
  border: 1px solid #003849;
}
</style>
