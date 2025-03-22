<template>
  <div class="py-6">
    <div
      class="flex flex-row gap-2 items-center"
      @click="navigateToResolvedPage"
    >
      <Icon name="jig:previous-page" size="10" />
      <p>{{ resolvedPageText }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouteHistoryStore } from "~/stores/routeHistory";

const resolvedPage = computed(() => routeHistory.getHistory() || "/");

const resolvedPageText = computed(() =>
  routeHistory.getHistory()
    ? $t(`routes.${routeHistory.getHistory()}`)
    : "Homepage"
);

const navigateToResolvedPage = () => {
  navigateToPage(resolvedPage.value as string);
};

const routeHistory = useRouteHistoryStore();

const navigateToPage = (url: string) => {
  routeHistory.removeRoute(url);
  navigateTo(url);
};
</script>
