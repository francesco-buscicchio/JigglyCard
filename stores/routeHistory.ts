import { defineStore } from "pinia";

export const useRouteHistoryStore = defineStore("routeHistory", {
  state: () => ({
    history: [] as String[],
  }),
  actions: {
    addRoute(from: string, to: string) {
      const fromLevel = this.calculateLevel(from);
      const toLevel = this.calculateLevel(to);

      if (fromLevel < toLevel && !this.history.includes(from))
        this.history.push(from);
    },

    calculateLevel(path: string) {
      const segments = path.split("/").filter(Boolean);
      return segments.length;
    },

    getHistory() {
      if (this.history.length) return this.history[this.history.length - 1];
      return undefined;
    },

    removeRoute(route: string) {
      const index = this.history.indexOf(route);
      if (index !== -1) {
        this.history.splice(index, 1);
      }
    },
  },
});
