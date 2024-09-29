<template>
    <div class="bg-accent-50 p-2">
        <div class="flex items-center justify-between">
            <h1 class="flex-grow text-left">X</h1>
            <h5 class="text-center w-full">filtri</h5>
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
                                class="mr-6 bg-white ">
                                {{ item.name }}
                            </AtomsCheckbox>
                            <p class="text-left"> {{ item.name }}</p>
                        </div>
                    </div>
                </MoleculesAccordion>
            </div>
        </div>

        <div class="flex mt-4 space-x-8 mb-6">
            <AtomsButtonCTA class=" text-underlined" type="text" @click="resetAllFilters">
                Cancella tutti i filtri
            </AtomsButtonCTA>
            <AtomsButtonCTA @click="applyFilters">
                <h5>Applica</h5>
            </AtomsButtonCTA>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";

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

function applyFilters() {
    console.log("Filtri applicati:", selectedFilters);
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
}

</script>
<style scoped>
.text-underlined {
    text-decoration: underline;
    text-decoration-thickness: 1px;
}
</style>