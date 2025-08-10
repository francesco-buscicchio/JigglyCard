<template>
  <h1 class="text-accent-500 text-center">
    {{ $t(currentMenuItem.label).split(" - ")[0] }}
  </h1>
  <h5
    class="text-accent-500 text-center pt-2"
    v-if="$t(currentMenuItem.label).split(' - ')[1]"
  >
    {{ $t(title).split(" - ")[1].toLocaleUpperCase() }}
    {{ $t(title).split(" - ")[1].toLocaleLowerCase() }}
  </h5>
</template>

<script setup lang="ts">
import useMenu, { type MenuItemType } from "~/data/menu";

const props = defineProps({
  title: String,
});
const menuItems = ref<MenuItemType[]>(await useMenu());
const titleCategory = computed(() => props.title!.split("/")[1]);

const currentMenuItem = computed(() => {
  // Aggiungo la slash iniziale
  const targetTo = `/${props.title}`;

  for (const item of menuItems.value) {
    // Controllo se il menu principale ha il to giusto
    if (item.to === targetTo) {
      return item;
    }

    // Controllo i sotto-menu
    if (item.subMenu) {
      const sub = item.subMenu.find((sm) => sm.to === targetTo);
      if (sub) return sub;
    }
  }

  return null;
});
</script>
