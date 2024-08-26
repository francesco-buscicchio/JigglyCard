<template>
  <nav class="bg-white shadow-md p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="lg:hidden">
        <button @click="toggleMenu" class="text-gray-700 focus:outline-none">
          <Icon name="jig:menu" v-if="!isMenuOpen" size="20"></Icon>
          <Icon name="jig:close-accent" v-else size="20"></Icon>
        </button>
      </div>

      <div class="relative w-[70%]">
        <h2 class="text-accent-950 text-center" @click="navigateTo('/')">
          Jigglycard
        </h2>
      </div>

      <div class="items-center space-x-4">
        <button class="focus:outline-none">
          <Icon name="jig:cart-accent" size="25"></Icon>
        </button>

        <button @click="toggleSearch" class="focus:outline-none">
          <Icon name="jig:cerca-accent" size="25" />
        </button>
      </div>
    </div>

    <!-- Separare questa parte in un altro componente quando si integra algolia per la ricerca-->
    <div v-if="isSearchOpen" class="mt-4">
      <div class="container mx-auto">
        <div class="relative">
          <input
            type="text"
            class="w-full h-12 pl-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-blue-50"
            placeholder="Cerca..."
          />
          <button class="absolute right-3 top-3 focus:outline-none">
            <Icon name="jig:cerca-accent" size="18" />
          </button>
        </div>
      </div>
    </div>

    <!-- Separare questa parte in un altro componente quando si fa la lista degli items nel menu -->
    <div v-if="isMenuOpen" class="lg:hidden">
      <ul class="mt-4 space-y-2">
        <li>
          <a href="#" class="block text-gray-700 px-4 py-2 hover:bg-gray-100"
            >Home</a
          >
        </li>
        <li>
          <a href="#" class="block text-gray-700 px-4 py-2 hover:bg-gray-100"
            >Servizi</a
          >
        </li>
        <li>
          <a href="#" class="block text-gray-700 px-4 py-2 hover:bg-gray-100"
            >Contatti</a
          >
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isMenuOpen = ref(false);
const isProfileMenuOpen = ref(false);
const isSearchOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
};

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
};
</script>

<style scoped>
/* Aggiungi eventuali stili personalizzati qui */
</style>
