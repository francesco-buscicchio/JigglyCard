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
          <div class="flex justify-center flex-wrap gap-[5vw]">
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
import { PATH } from "~/data/const";
import { goTo } from "@/utils/navigationUtils";

const props = defineProps<{
  isSearchOpen: boolean;
}>();

const activeIndex = ref<number | null>(null);

const headerMenu = ref([
  {
    name: "Pokemon",
    to: "/pokemon/all",
    subMenu: [
      {
        label: "Booster box",
        to: "/pokemon/booster-box",
        image:
          "https://honorable-belief-ab1c5a7281.media.strapiapp.com/boosterbox_1085522f93.jpg",
      },
      {
        label: "Mazzi precostruiti",
        to: "/pokemon/mazzi",
        image:
          "https://honorable-belief-ab1c5a7281.media.strapiapp.com/precostructed_f003e10a67.jpg",
      },
      {
        label: "Tins",
        to: "/pokemon/tins",
        image:
          "https://honorable-belief-ab1c5a7281.media.strapiapp.com/tins_1c70a3d0aa.jpg",
      },
      {
        label: "Box set",
        to: "/pokemon/box-set",
        image:
          "https://honorable-belief-ab1c5a7281.media.strapiapp.com/box_set_cfea8afe3e.jpg",
      },
      {
        label: "Bundle",
        to: "/pokemon/bundle",
        image:
          "https://honorable-belief-ab1c5a7281.media.strapiapp.com/bundle_e72222d39a.jpg",
      },
      {
        label: "Carte singole",
        to: "/pokemon/singole",
        image:
          "https://honorable-belief-ab1c5a7281.media.strapiapp.com/overszed_282600fca5.jpg",
      },
    ],
  },
  {
    name: "One Piece",
    to: "/one-piece/all",
    subMenu: [],
  },
  { name: "Final Fantasy", to: "/final-fantasy/all", subMenu: [] },
  { name: "Dragon Ball", to: "/dragon-ball/all", subMenu: [] },
  { name: "Lorcana", to: "/lorcana/all", subMenu: [] },
]);
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
