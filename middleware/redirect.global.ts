export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig();
  if (to.path !== "/welcome" && config.public.NODE_ENV !== "development") {
    return navigateTo("/welcome");
  }
});
