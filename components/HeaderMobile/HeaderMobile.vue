<template>
  <nav class="bg-white shadow-md p-4">
    <div class="container flex justify-between items-center w-full">
      <div class="lg:hidden">
        <button @click="toggleMenu" class="text-gray-700 focus:outline-none">
          <svg
            v-if="!isMenuOpen"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <h2 class="text-accent-950">Jigglycard</h2>

      <div class="lg:flex items-center space-x-4">
        <button class="focus:outline-none">
          <Icon name="jig:cart" size="25"></Icon>
        </button>

        <button @click="toggleSearch" class="focus:outline-none">
          <Icon name="jig:cerca" size="25"></Icon>
        </button>
      </div>
    </div>

    <!-- Barra di ricerca espandibile -->
    <div v-if="isSearchOpen" class="mt-4">
      <div class="container mx-auto">
        <div class="relative">
          <input
            type="text"
            class="w-full h-12 pl-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-blue-50"
            placeholder="Cerca..."
          />
          <button class="absolute right-3 top-3 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1117.5 10.5 7.5 7.5 0 0116.65 16.65z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Menu Laterale per Dispositivi Mobili -->
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

<script>
export default {
  data() {
    return {
      isMenuOpen: false,
      isProfileMenuOpen: false,
      isSearchOpen: false, // stato per la barra di ricerca
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    toggleProfileMenu() {
      this.isProfileMenuOpen = !this.isProfileMenuOpen;
    },
    toggleSearch() {
      this.isSearchOpen = !this.isSearchOpen;
    },
  },
};
</script>

<style scoped>
/* Aggiungi eventuali stili personalizzati qui */
</style>
