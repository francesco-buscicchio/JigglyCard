<template>
  <div class="relative">
    <div
      class="flex justify-between items-center bg-white p-4 shadow lg:hidden"
    >
      <div @click="toggleFilter" class="flex items-center cursor-pointer">
        <Icon name="flowbite:adjustments-horizontal-outline" class="w-4 h-4" />
        <span class="pl-2">FILTRO</span>
      </div>

      <div @click="toggleSortOptions" class="flex items-center cursor-pointer">
        <span class="pr-2">ORDINATO PER</span>
        <Icon name="flowbite:arrow-up-down-outline" class="w-4 h-4" />
      </div>
    </div>

    <div
      v-if="showSortOptions"
      class="absolute z-10 bg-white shadow p-4 w-full"
    >
      <ul>
        <li
          v-for="(option, index) in sortOptions"
          :key="index"
          @click="selectSortOption(index)"
          class="flex justify-between items-center p-2 cursor-pointer hover:bg-gray-100"
        >
          {{ option.name }}
          <Icon
            v-if="selectedSortOption === index"
            name="radix-icons:check"
            class="w-6 h-6"
          />
        </li>
      </ul>
    </div>
    <div
      class="fixed top-0 left-0 bottom-0 w-full bg-white z-20 transition-transform duration-1000 flex flex-col items-center"
      :class="{ 'translate-x-0': !showFilter, 'translate-x-full': showFilter }"
    >
      <Accordion class="min-w-full bg-white">
        <template #header>
          <h3 class="font-bold">{{ $t("Conditions") }}</h3>
        </template>
        <div
          v-for="(item, index) of checkboxFilters"
          class="border-gray-300 py-4 flex items-center justify-between"
          :class="index !== checkboxFilters.length - 1 ? 'border-b' : ''"
          @click="item.enabled = !item.enabled"
        >
          {{ item.label }}
          <Icon
            v-if="item.enabled === true"
            name="radix-icons:check"
            class="w-6 h-6"
          />
        </div>
      </Accordion>
      <Accordion class="min-w-full bg-white">
        <template #header>
          <h3 class="font-bold">Prezzo</h3>
        </template>
        <div class="py-4">
          <div class="flex flex-col space-y-4">
            <!-- Minimum Price Input -->
            <div class="flex-col items-center justify-between">
              <label
                for="minPrice"
                class="block text-sm font-medium text-gray-700"
                >Prezzo minimo</label
              >
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                placeholder="0 €"
              />
            </div>

            <!-- Maximum Price Input -->
            <div class="flex-col items-center justify-between">
              <label
                for="maxPrice"
                class="block text-sm font-medium text-gray-700"
                >Prezzo massimo</label
              >
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                placeholder="1000 €"
              />
            </div>
          </div>
        </div>
      </Accordion>

      <button
        @click="toggleFilter"
        class="bg-mediumPink hover:bg-darkPink text-white font-bold py-2 px-4 flex items-center justify-center rounded-lg w-4/5 my-4 mx-auto"
        aria-label="Applica Filtro"
      >
        APPLICA
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import conditions from "~/data/conditions";

const showSortOptions = ref(false);
const showFilter = ref(true);
const selectedSortOption = ref(null);
const sortOptions = [
  { name: "Più popolare" },
  { name: "Più economico" },
  { name: "Nome (A-Z)" },
  { name: "Nome (Z-A)" },
  { name: "Per numero di collezione (Prima il più basso)" },
  { name: "Per numero di collezione (Prima il più alto)" },
  { name: "Data di uscita (Prima il più recente)" },
  { name: "Data di uscita (Prima il più vecchio)" },
];

const checkboxFilters = ref(conditions);

function handleFiltersUpdate(filterName: string) {
  const filter = checkboxFilters.value.find((f) => f.label === filterName);
  if (filter) {
    filter.enabled = !filter.enabled;
  }
}

function toggleSortOptions() {
  showSortOptions.value = !showSortOptions.value;
}

function selectSortOption(index: number) {
  selectedSortOption.value = index;
  showSortOptions.value = false;
}

function toggleFilter() {
  showFilter.value = !showFilter.value;
}
</script>
