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

    <div v-if="isSearchOpen" class="mt-4">
      <input
        type="text"
        class="w-full h-12 pl-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-blue-50"
        placeholder="Cerca..."
      />
      <button class="absolute right-3 top-3 focus:outline-none">
        <Icon name="jig:cerca-accent" size="18" />
      </button>
    </div>

    <div v-if="isMenuOpen" class="lg:hidden">
      <MoleculesMobileMenu />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useHead } from "#app";

const isMenuOpen = ref(false);
const isSearchOpen = ref(false);
const emit = defineEmits(["toggle-menu"]);

watch(isMenuOpen, (newValue) => {
  useHead({
    bodyAttrs: {
      class: newValue ? "hide" : "",
    },
  });
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  emit("toggle-menu");
};

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
};

const navigateTo = (path: String) => {
  navigateTo(path);
};
</script>

<style scoped>
/* Si suppone che gli stili 'hide' siano definiti globalmente */
</style>
