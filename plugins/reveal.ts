/**
 * `v-reveal`: l'elemento entra in scena (dissolvenza + leggera salita) quando
 * arriva nel viewport. Il valore opzionale è un ritardo in millisecondi, utile
 * per far entrare in cascata gli elementi di una stessa riga.
 *
 * Lo stato nascosto vale solo quando su <html> c'è `has-reveal`, che mette
 * questo plugin: se il JavaScript non parte (o è una versione diversa da
 * quella del CSS) i contenuti restano visibili invece di sparire.
 *
 * L'avvenuta entrata è un attributo (`data-revealed`), non una classe: se
 * l'elemento ha un `:class` dinamico, Vue riscrive l'attributo `class` a ogni
 * aggiornamento e una classe aggiunta a mano sparirebbe, facendo tornare
 * invisibile l'elemento (succedeva ai pannelli al passaggio del mouse).
 */
export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | null = null;

  const getObserver = () => {
    if (observer) return observer;
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target as HTMLElement);
          observer?.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    return observer;
  };

  const reveal = (el: HTMLElement) => {
    el.setAttribute("data-revealed", "");
    // Il ritardo serve solo all'entrata: lasciato lì rallenterebbe anche le
    // transizioni successive dell'elemento (hover compresi).
    if (el.style.transitionDelay) {
      const delay = parseFloat(el.style.transitionDelay) || 0;
      setTimeout(() => (el.style.transitionDelay = ""), delay + 1000);
    }
  };

  nuxtApp.vueApp.directive<HTMLElement, number | undefined>("reveal", {
    getSSRProps: () => ({ "data-reveal": "" }),
    mounted(el, binding) {
      // Qui e non all'avvio del plugin: la classe di <html> la riscrive anche
      // la gestione del tema (dark), che arriva dopo.
      document.documentElement.classList.add("has-reveal");
      el.setAttribute("data-reveal", "");
      if (binding.value) el.style.transitionDelay = `${binding.value}ms`;
      if (typeof IntersectionObserver === "undefined") {
        reveal(el);
        return;
      }
      getObserver().observe(el);
    },
    unmounted(el) {
      observer?.unobserve(el);
    },
  });
});
