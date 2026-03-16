export default defineNuxtRouteMiddleware((to) => {
  const { host } = useRequestURL();
  console.log("Host: ", host);
  if (host === "localhost:3010" || host === "jigglycard.com") {
    console.log("Host giusto");
    if (
      to.path !== "/landing" &&
      to.path !== "/valuta-la-tua-collezione" &&
      to.path !== "/regolamento-vendita-collezione"
      //&& config.public.NODE_ENV !== "development"
    )
      return navigateTo("/landing");
  }

  /*const config = useRuntimeConfig();
  if (to.path !== "/welcome" && config.public.NODE_ENV !== "development") {
     return navigateTo("/welcome");
  }*/
});
