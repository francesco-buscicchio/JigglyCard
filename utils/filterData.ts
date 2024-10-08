
export const filterCategories = ref([
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

