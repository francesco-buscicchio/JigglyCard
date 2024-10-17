<template>
  <div class="py-4">
    <div
      v-if="routeHistory.getHistory()"
      class="flex flex-row gap-2 items-center"
      @click="navigateToPage(routeHistory.getHistory() as string)"
    >
      <Icon name="jig:previous-page" size="10" />
      <p>{{ $t(`routes.${routeHistory.getHistory()}`) }}</p>
    </div>

    <div
      v-else
      class="flex flex-row gap-2 items-center"
      @click="navigateToPage('/')"
    >
      <Icon name="jig:previous-page" size="10" />
      <p>Homepage</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouteHistoryStore } from "~/stores/routeHistory";

const routeHistory = useRouteHistoryStore();
const navigateToPage = (url: string) => {
  routeHistory.removeRoute(url);
  navigateTo(url);
};
</script>
