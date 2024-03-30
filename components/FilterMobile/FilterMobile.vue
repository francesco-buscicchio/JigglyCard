<template>
  <div class="relative">
    <div
      class="flex justify-between items-center bg-white p-4 shadow lg:hidden"
    >
      <!-- Filtro -->
      <div @click="toggleFilter" class="flex items-center cursor-pointer">
        <Icon name="flowbite:adjustments-horizontal-outline" class="w-4 h-4" />
        <span class="pl-2">FILTRO</span>
      </div>
      <!-- Ordinato per -->
      <div @click="toggleSortOptions" class="flex items-center cursor-pointer">
        <span class="pr-2">ORDINATO PER</span>
        <Icon name="flowbite:arrow-up-down-outline" class="w-4 h-4" />
      </div>
    </div>
    <!-- Opzioni di ordinamento -->
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
      class="fixed top-0 left-0 bottom-0 w-full bg-white z-20 transition-transform duration-1000"
      :class="{ 'translate-x-0': !showFilter, 'translate-x-full': showFilter }"
    >
      <!-- Content of your filter panel -->
      <button @click="toggleFilter">Applica</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const showSortOptions = ref(false);
const showFilter = ref(false);
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

function toggleSortOptions() {
  showSortOptions.value = !showSortOptions.value;
}

function toggleFilter() {
  showFilter.value = !showFilter.value;
}
</script>
