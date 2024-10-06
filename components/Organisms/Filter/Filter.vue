<template>
    <div>
        <AtomsButtonCTA @click="togglePanel">
            <h5>Apri Filtri</h5>
        </AtomsButtonCTA>

        <transition name="fade">
            <div v-if="isOpen" class="overlay" @click.self="togglePanel"></div>
        </transition>

        <transition name="slide-right">
            <div v-show="isOpen" class="filter-panel bg-accent-50">
                <div class="flex items-center justify-between">
                    <Icon name="jig:close-accent" class="ml-6" size="40" @click="togglePanel"></Icon>
                    <h5 class="text-center w-full mr-18">Filtri</h5>
                </div>

                <div>
                    <div v-for="(category, catIndex) in filterCategories" :key="category.id">
                        <MoleculesAccordion>
                            <template #header>
                                <p>{{ category.name }}</p>
                            </template>
                            <div v-for="(item, index) in category.filters" :key="item.id" class="mb-2">
                                <div class="flex items-center">
                                    <AtomsCheckbox :id="item.id" :modelValue="item.checked"
                                        @update:modelValue="updateCheckboxValue(catIndex, index, $event)"
                                        class="mr-6 bg-white">
                                        {{ item.name }}
                                    </AtomsCheckbox>
                                    <p class="text-left">{{ item.name }}</p>
                                </div>
                            </div>
                        </MoleculesAccordion>
                    </div>

                    <div class="mx-6">
                        <p>Prezzo</p>
                        <MoleculesSlider :min="0" :max="5000" :initialMinPrice="selectedMinPrice"
                            :initialMaxPrice="selectedMaxPrice" @update:minPrice="updateMinPrice($event)"
                            @update:maxPrice="updateMaxPrice($event)" />
                        <div class="price-labels">
                            <span>Min: {{ selectedMinPrice }}</span>
                            <span>Max: {{ selectedMaxPrice }}</span>
                        </div>
                    </div>
                </div>

                <div class="flex mt-4 mb-6 mr-6">
                    <AtomsButtonCTA class="text-underlined" type="text" @click="resetAllFilters">
                        Cancella tutti i filtri
                    </AtomsButtonCTA>
                    <AtomsButtonCTA @click="applyFilters">
                        <h5>Applica</h5>
                    </AtomsButtonCTA>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";

const isOpen = ref(false);
const selectedMinPrice = ref(0);
const selectedMaxPrice = ref(5000);

const filterCategories = ref([
    {
        id: 1,
        name: "Disponibilità",
        filters: [
            { id: 1, name: "Disponibile subito", checked: false },
            { id: 2, name: "Prenotabile", checked: false },
        ]
    },
    {
        id: 2,
        name: "Lingua",
        filters: [
            { id: 3, name: "Italiano", checked: false },
            { id: 4, name: "Inglese", checked: false },
        ]
    },
    {
        id: 3,
        name: "Condizione",
        filters: [
            { id: 5, name: "Nuovo", checked: false },
            { id: 6, name: "Usato", checked: false },
        ]
    },
    {
        id: 4,
        name: "Tipologia",
        filters: [
            { id: 7, name: "Elettronica", checked: false },
            { id: 8, name: "Abbigliamento", checked: false },
        ]
    },
    {
        id: 5,
        name: "Brand",
        filters: [
            { id: 9, name: "Brand A", checked: false },
            { id: 10, name: "Brand B", checked: false },
        ]
    },
    {
        id: 6,
        name: "Extra",
        filters: [
            { id: 11, name: "Eco-Friendly", checked: false },
            { id: 12, name: "Spedizione Gratuita", checked: false },
        ]
    }
]);

const selectedFilters = reactive<{ [key: string]: any }>({});

function updateCheckboxValue(categoryIndex: number, filterIndex: number, value: boolean) {
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
    selectedFilters['Prezzo'] = {
        min: selectedMinPrice.value,
        max: selectedMaxPrice.value
    };

    console.log("Filtri applicati:", selectedFilters);
    isOpen.value = false;
}

function resetAllFilters() {
    filterCategories.value.forEach(category => {
        category.filters.forEach(filter => {
            filter.checked = false;
        });
    });
    Object.keys(selectedFilters).forEach(key => {
        delete selectedFilters[key];
    });
    selectedMinPrice.value = 0;
    selectedMaxPrice.value = 5000;
    selectedFilters['Prezzo'] = { min: 0, max: 5000 };
}

function togglePanel() {
    isOpen.value = !isOpen.value;
}

watch(isOpen, (newValue) => {
    document.body.style.overflow = newValue ? 'hidden' : '';
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
</style>
