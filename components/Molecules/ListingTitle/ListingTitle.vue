<template>
  <h1 class="text-accent-500 text-center">
    {{ currentMenuItem.label }}
  </h1>
</template>

<script setup lang="ts">
import useMenu, { type MenuItemType } from "~/data/menu";

const props = defineProps({
  title: String,
});
const menuItems = ref<MenuItemType[]>(await useMenu());
const { t } = useI18n();

const currentMenuItem = computed(() => {
  const targetTo = `/${props.title}`;

  if (props.title!.split("/")[0].includes("search")) {
    return {
      label: `${t("catalog.listing.resultFor")}: ${
        props.title!.split("/")[1]
      }`,
    };
  }

  if (props.title!.split("/")[1].includes("all")) {
    return {
      label: `${t("catalog.listing.resultFor")}: ${
        props.title!.split("/")[0]
      }`,
    };
  }

  for (const item of menuItems.value) {
    if (item.to === targetTo) {
      return item;
    }

    if (item.subMenu) {
      const sub = item.subMenu.find((sm) => sm.to === targetTo);
      if (sub) return sub;
    }
  }

  return null;
});
</script>
