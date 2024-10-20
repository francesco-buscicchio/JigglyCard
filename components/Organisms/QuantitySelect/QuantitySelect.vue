<template>
    <div>
        <div class="flex items-center">
            <!-- Mostra la quantità selezionata -->
            <p>Quantità: {{ quantity }}</p>

            <!-- Usa il selettore con l'opzione di default 1 -->
            <MoleculesPageSorter :sortingItems="quantityOptions" :selected="quantity" @handleSorting="updateQuantity" />

            <!-- Mostra il prezzo totale -->
            <h5>{{ totalPrice }} €</h5>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Props ricevute dal componente padre
const props = defineProps<{
    quantity: number;  // Massima quantità selezionabile
    price: number;     // Prezzo per unità
}>();

// Stato locale per la quantità, inizializzata a 1
const quantity = ref(1);

// Opzioni per la quantità (da 1 fino a `props.quantity`)
const quantityOptions = computed(() => {
    return Array.from({ length: props.quantity }, (_, i) => ({
        value: (i + 1).toString(),  // Valore dell'opzione come stringa
        name: (i + 1).toString(),   // Nome da mostrare nell'opzione
    }));
});

// Computed per calcolare il prezzo totale in base alla quantità selezionata
const totalPrice = computed(() => quantity.value * props.price);

// Funzione che aggiorna la quantità quando l'utente seleziona un nuovo valore
function updateQuantity(newQuantity: string) {
    quantity.value = Number(newQuantity); // Converte la stringa in numero
}
</script>
