<template>
  <h1 class="listing-title">
    {{ currentMenuItem?.label }}
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
      return { label: item.name };
    }

    if (item.subMenu) {
      const sub = item.subMenu.find((sm) => sm.to === targetTo);
      if (sub) return sub;
    }
  }

  return null;
});
</script>

<style scoped>
.listing-title {
  margin: 4px 0 24px;
  font-size: clamp(28px, 3.6vw, 44px);
  line-height: 1.05;
  color: var(--im-ink);
}
</style>
