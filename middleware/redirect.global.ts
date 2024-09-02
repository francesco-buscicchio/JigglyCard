export default defineNuxtRouteMiddleware((to) => {
  if (to.path !== "/welcome") {
    return navigateTo("/welcome");
  }
});
