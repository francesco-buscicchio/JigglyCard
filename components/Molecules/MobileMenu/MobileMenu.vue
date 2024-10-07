<template>
  <ul class="mt-4 space-y-2 h-screen">
    <li v-for="(item, index) in menuItems" :key="index">
      <h5
        href="#"
        class="block text-gray-700 px-4 py-2 hover:bg-gray-100 w-full"
        @click="toggleSubMenu(item)"
      >
        {{ item.name }}
      </h5>
      <ul v-if="item.subMenu && item.isSubMenuOpen" class="pl-4">
        <p
          v-for="(subItem, index) in item.subMenu"
          :key="index"
          class="text-gray-500 py-2 hover:text-gray-700"
          @click="navigateTo(subItem.url)"
        >
          {{ subItem.name }}
        </p>
      </ul>
    </li>
  </ul>
</template>

<script setup lang="ts">
import menuItems, { type MenuItemType } from "~/data/menu";

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
