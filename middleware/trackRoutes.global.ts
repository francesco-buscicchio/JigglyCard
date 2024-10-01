import { useRouteHistoryStore } from "~/stores/routeHistory";

export default defineNuxtRouteMiddleware((to, from) => {
  const routeHistory = useRouteHistoryStore();
  routeHistory.addRoute(from.fullPath, to.fullPath);
});
