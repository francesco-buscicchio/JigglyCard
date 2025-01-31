<template>
  <div>
    <AtomsButtonCTA @click="togglePanel" type="secondary">
      <h5>{{ $t("filters") }}</h5>
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
          ></Icon>
          <h5 class="text-center w-full mr-18">
            {{ $t("filters") }}
          </h5>
        </div>

        <div>
          <div v-for="category of filterCategories" :key="category.objectID">
            <MoleculesAccordion>
              <template #header>
                <p>{{ $t(`filter.${category.name}`) }}</p>
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
                  <p class="text-left">{{ $t(`filter.${item.name}`) }}</p>
                </div>
              </div>
            </MoleculesAccordion>
          </div>

          <!-- Slider Prezzo -->
          <div class="mx-6 mt-4">
            <p>{{ $t("price") }}</p>
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

          <!-- Input Prezzo -->
          <div class="flex items-center my-6">
            <p class="ml-12 mr-6">{{ $t("min") }}</p>
            <AtomsInputText
              class="w-20"
              v-model="selectedMinPrice"
              :placeholder="''"
              @keydown="validateNumberInput($event)"
              @input="validatePriceInput('min', $event)"
            />
          </div>
          <div class="flex items-center">
            <p class="ml-12 mr-6">{{ $t("max") }}</p>
            <AtomsInputText
              class="w-20"
              v-model="selectedMaxPrice"
              :placeholder="''"
              @keydown="validateNumberInput($event)"
              @input="validatePriceInput('max', $event)"
            />
          </div>
        </div>

        <!-- Pulsanti -->
        <div class="bottom-container">
          <div class="flex mt-4 mb-6 mr-6">
            <AtomsButtonCTA
              class="text-underlined"
              type="text"
              @click="resetAllFilters"
            >
              <p>{{ $t("deleteAllFilters") }}</p>
            </AtomsButtonCTA>
            <AtomsButtonCTA @click="applyFilters">
              <h5>{{ $t("apply") }}</h5>
            </AtomsButtonCTA>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { FILTERS_COLLECTION } from "~/data/const";
const props = defineProps({
  filters: Array<String>,
});
const config = useRuntimeConfig();
const filterList = ref<String[]>([]);
const filterCategories = ref();
const client = useAlgolia();

const isOpen = ref(false);
const selectedMinPrice = ref(0);
const selectedMaxPrice = ref(5000);
const selectedFilters = reactive<{ [key: string]: any }>({});

watch(props, () => {
  filterList.value = props.filters ?? [];
  updateSelectedFilters();
});
function updateSelectedFilters() {
  resetAllFilters();
  if (filterList.value.length) {
    for (let filter of filterCategories.value) {
      for (let value of filter.value) {
        if (filterList.value.includes(value.name)) {
          value.checked = true;
        }
      }
    }
  }
}

onMounted(async () => {
  let results = await client.searchSingleIndex({
    indexName: FILTERS_COLLECTION,
  });
  filterCategories.value = results.hits.map((filter: any) => ({
    ...filter,
    value: filter.value.map((language: any) => ({
      name: language,
      checked: false,
    })),
  }));
});

const emit = defineEmits(["filterUpdate"]);

function updateCheckboxValue(
  categoryID: string,
  filterIndex: number,
  value: boolean
) {
  const index = filterCategories.value.findIndex((val: any) => {
    return val.objectID === categoryID;
  });

  console.log(categoryID);
  const category = filterCategories.value[index];
  const filter = category.value[filterIndex];

  filter.checked = value;

  // if (value) {
  //   if (!selectedFilters[category.name]) {
  //     selectedFilters[category.name] = [];
  //   }
  //   selectedFilters[category.name].push(filter.name);
  // } else {
  //   const index = selectedFilters[category.name]?.indexOf(filter.name);
  //   if (index > -1) {
  //     selectedFilters[category.name].splice(index, 1);
  //   }
  //   if (selectedFilters[category.name]?.length === 0) {
  //     delete selectedFilters[category.name];
  //   }
  // }
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

function validateNumberInput(event: KeyboardEvent) {
  const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Tab"];
  if (!/[0-9]/.test(event.key) && !allowedKeys.includes(event.key)) {
    event.preventDefault();
  }
}

function validatePriceInput(type: "min" | "max", event: Event) {
  const input = (event.target as HTMLInputElement).value;
  const numericValue = parseInt(input, 10);

  if (!isNaN(numericValue)) {
    if (type === "min") {
      selectedMinPrice.value = Math.max(
        0,
        Math.min(numericValue, selectedMaxPrice.value)
      );
    } else {
      selectedMaxPrice.value = Math.min(
        Math.max(numericValue, selectedMinPrice.value),
        5000
      );
    }
  }
}

function applyFilters() {
  selectedFilters["Prezzo"] = {
    min: selectedMinPrice.value,
    max: selectedMaxPrice.value,
  };
  const result = filterCategories.value.reduce((acc: any, item: any) => {
    acc[item.name] = item.value
      .filter((val: any) => val.checked)
      .map((val: any) => val.name);
    return acc;
  }, {});
  emit("filterUpdate", result);
  isOpen.value = false;
}

function resetAllFilters() {
  filterCategories.value.forEach((category: any) => {
    category.value.forEach((filter: any) => {
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
