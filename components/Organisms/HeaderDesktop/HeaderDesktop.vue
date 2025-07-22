<template>
  <div class="relative" @mouseleave="activeIndex = null">
    <header
      class="flex justify-between items-center bg-white shadow-md px-18 py-5"
    >
      <!-- Logo -->
      <h2 @click="goTo(PATH.HOME)" class="text-accent-950 cursor-pointer">
        Jigglycard
      </h2>

      <!-- Menu -->
      <nav class="flex gap-x-6">
        <div
          v-for="(item, index) in headerMenu"
          :key="index"
          class="relative"
          @mouseenter="activeIndex = index"
        >
          <button @click="goTo(item.to)">
            <h5 class="text-accent-950 text-lg">{{ item.name }}</h5>
          </button>
        </div>
      </nav>

      <!-- Icon buttons -->
      <div class="flex gap-x-4">
        <button
          class="header-btn"
          @click="$emit('toggleSearch')"
          v-show="isSearchOpen"
        >
          <Icon name="jig:search-header-desktop" size="18" />
        </button>
        <button class="header-btn">
          <Icon name="jig:cart-header-desktop" size="18" />
        </button>
        <button class="header-btn">
          <Icon name="jig:user-accent" size="18" />
        </button>
      </div>
    </header>

    <!-- Submenu globale -->
    <transition name="fade">
      <div
        v-if="activeIndex !== null && headerMenu[activeIndex].subMenu.length"
        class="absolute left-0 w-full bg-white shadow-lg z-50 py-6"
      >
        <div class="max-w-screen-xl mx-auto px-12">
          <div class="flex justify-center flex-wrap gap-[2.5vw]">
            <div
              v-for="(sub, i) in headerMenu[activeIndex].subMenu"
              class="w-min-[10vw] h-min-[10vw]"
            >
              <MoleculesSubMenuItem
                :key="i"
                :label="sub.label"
                :imgUrl="sub.image"
                @click="goTo(sub.to)"
              />
            </div>
          </div>
          <div
            class="mt-6 cursor-pointer hover:underline"
            @click="goTo(headerMenu[activeIndex].to)"
          >
            <p class="text-center text-accent-950">Tutti i prodotti</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { HEADER_MENU, PATH } from "~/data/const";
import { goTo } from "@/utils/navigationUtils";

const props = defineProps<{
  isSearchOpen: boolean;
}>();

const activeIndex = ref<number | null>(null);

const headerMenu = ref(HEADER_MENU);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
