import type { MaybeRefOrGetter } from "vue";
import { DEFAULT_OG_IMAGE, SITE_URL, absoluteUrl, canonicalPath } from "~/utils/seo";

type PageSeo = {
  /** Senza " · Jigglycard": lo aggiunge il titleTemplate di app.vue. */
  title: MaybeRefOrGetter<string>;
  description: MaybeRefOrGetter<string>;
  /** Immagine di condivisione; senza, resta quella predefinita del sito. */
  image?: MaybeRefOrGetter<string | null | undefined>;
  /**
   * Percorso canonico, con l'eventuale query che identifica davvero la
   * pagina (es. `?expansion=`). Senza, vale quello di app.vue: il percorso
   * della pagina senza query.
   */
  canonical?: MaybeRefOrGetter<string | null | undefined>;
  robots?: MaybeRefOrGetter<string | undefined>;
};

/**
 * Titolo, descrizione e anteprima social di una pagina in un colpo solo.
 *
 * og:title e og:description non seguono da soli title e description: senza
 * ripeterli, condividendo una scheda prodotto comparirebbero titolo e testo
 * generici del sito.
 */
export function usePageSeo(seo: PageSeo) {
  const route = useRoute();
  const canonicalUrl = computed(() => {
    const path = toValue(seo.canonical);
    return path ? `${SITE_URL}${canonicalPath(path)}` : undefined;
  });

  useSeoMeta({
    title: () => toValue(seo.title),
    description: () => toValue(seo.description),
    ogTitle: () => toValue(seo.title),
    ogDescription: () => toValue(seo.description),
    ogImage: () => absoluteUrl(toValue(seo.image) || DEFAULT_OG_IMAGE),
    // Sempre valorizzato: un meta vuoto qui cancellerebbe anche l'og:url
    // predefinito di app.vue invece di lasciarlo valere.
    ogUrl: () => canonicalUrl.value ?? `${SITE_URL}${canonicalPath(route.path)}`,
    robots: () => toValue(seo.robots),
  });

  if (seo.canonical !== undefined) {
    useHead({
      link: () =>
        canonicalUrl.value ? [{ rel: "canonical", href: canonicalUrl.value }] : [],
    });
  }
}
