<template>
  <ul class="mt-4 space-y-2">
    <li v-for="(item, index) in menuItems" :key="index">
      <h5
        href="#"
        class="block text-gray-700 px-4 py-2 hover:bg-gray-100 w-full"
        @click="toggleSubMenu(item)"
      >
        {{ item.name }}
      </h5>
      <!-- TODO IMPLEMENTA NAVIGAZIONE -->
      <ul v-if="item.subMenu && item.isSubMenuOpen" class="pl-4">
        <p
          v-for="(subItem, index) in item.subMenu"
          :key="index"
          class="text-gray-500 py-2 hover:text-gray-700"
        >
          {{ subItem }}
        </p>
      </ul>
    </li>
  </ul>
</template>

<script setup lang="ts">
type MenuItemType = {
  name: String;
  subMenu: String[] | null;
  isSubMenuOpen?: Boolean;
};

const menuItems = ref<MenuItemType[]>([
  {
    name: "Pokémon",
    subMenu: [
      "Booster Box",
      "Box Set",
      "Bundle",
      "Carte Singole",
      "Mazzi Precostruiti",
      "Tins",
      "Tutti i Prodotti",
    ],
    isSubMenuOpen: false,
  },
  {
    name: "One Piece",
    subMenu: [
      "Booster Box",
      "Box Set",
      "Bundle",
      "Carte Singole",
      "Mazzi Precostruiti",
      "Tins",
      "Tutti i Prodotti",
    ],
    isSubMenuOpen: false,
  },
  {
    name: "Final Fantasy",
    subMenu: [
      "Booster Box",
      "Box Set",
      "Bundle",
      "Carte Singole",
      "Mazzi Precostruiti",
      "Tins",
      "Tutti i Prodotti",
    ],
    isSubMenuOpen: false,
  },
  {
    name: "Dragon Ball",
    subMenu: [
      "Booster Box",
      "Box Set",
      "Bundle",
      "Carte Singole",
      "Mazzi Precostruiti",
      "Tins",
      "Tutti i Prodotti",
    ],
    isSubMenuOpen: false,
  },
  {
    name: "Lorcana",
    subMenu: [
      "Booster Box",
      "Box Set",
      "Bundle",
      "Carte Singole",
      "Mazzi Precostruiti",
      "Tins",
      "Tutti i Prodotti",
    ],
    isSubMenuOpen: false,
  },
  { name: "Servizi", subMenu: null },
  { name: "Contatti", subMenu: null },
]);

const toggleSubMenu = (item: MenuItemType) => {
  item.isSubMenuOpen = !item.isSubMenuOpen;
};
</script>

<style scoped>
ul {
  max-height: 90vh; /* Aggiusta questo valore in base alle tue necessità */
  overflow-y: auto; /* Permette lo scorrimento verticale del menù */
}
</style>
