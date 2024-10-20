<template>
  <div class="relative max-w-40">
    <select @change="handleSortingValue"
      class="bg-white border-[1px] border-accent-950 rounded-md shadow-sm w-full py-3 pl-4 pr-8 appearance-none">

      <!-- Opzioni di selezione -->
      <option v-for="item in sortingItems" :key="item.value" :value="item.value"
        :selected="item.value === selectedValue">
        {{ $t(item.name) }}
      </option>
    </select>

    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
      <Icon name="jig:arrow-down" size="8"></Icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from 'vue';

// Props ricevute (sortingItems e selected opzionale)
const props = defineProps({
  sortingItems: {
    type: Array,
    required: true,
  },
  selected: {
    type: [String, Number],
    default: '', // Default vuoto, in modo che possa essere usato opzionalmente
  },
});

// Emittiamo un evento quando l'utente cambia selezione
const emit = defineEmits(["handleSorting"]);

// Variabile per tracciare il valore selezionato
const selectedValue = ref(props.selected || props.sortingItems[0]?.value);

// Funzione chiamata quando l'utente cambia selezione
const handleSortingValue = (e: Event) => {
  const selectElement = e.target as HTMLSelectElement;
  selectedValue.value = selectElement.value;
  emit("handleSorting", selectElement.value);
};

// Aggiorniamo il valore selezionato se cambia la prop "selected"
watch(() => props.selected, (newSelected) => {
  selectedValue.value = newSelected;
});
</script>
