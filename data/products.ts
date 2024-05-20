const obj = {
  id: 1,
  name: "Pikachu (CRZ 160)",
  description: "Questa è una descrizione del Prodotto 1.",
  price: "29,99",
  image: "/img/SWSH12pt5_IT_160.png",
  logo: "/img/crown-zenith.jpg",
  language: [
    {
      id: 1,
      description: "Italiano",
      options: [
        { id: 1, description: "Poor", price: "2" },
        { id: 2, description: "Played", price: "3" },
        { id: 3, description: "Light Played", price: "4" },
      ],
    },
    {
      id: 2,
      description: "Inglese",
      options: [
        { id: 1, description: "Poor", price: "2,5" },
        { id: 2, description: "Played", price: "3,5" },
        { id: 3, description: "Light Played", price: "4,5" },
      ],
    },
  ],
};

export default [obj, obj, obj, obj];
