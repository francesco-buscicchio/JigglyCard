<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  canonicalPath,
} from "~/utils/seo";

/**
 * Valori SEO predefiniti, validi per ogni pagina finché questa non li
 * sovrascrive (useSeoMeta / usePageSeo): a parità di meta vince l'ultima
 * dichiarazione, cioè quella della pagina.
 *
 * Stanno qui e non in nuxt.config perché titleTemplate è una funzione e
 * canonical e og:url dipendono dalla rotta.
 */
const route = useRoute();
const currentUrl = computed(() => `${SITE_URL}${canonicalPath(route.path)}`);

useHead({
  // Alcune pagine (legali, regolamento) hanno già " | Jigglycard" nel
  // titolo: non si aggiunge una seconda volta. Senza titolo resta quello
  // della home.
  titleTemplate: (title?: string) => {
    if (!title) return SITE_TITLE;
    return /jigglycard/i.test(title) ? title : `${title} · ${SITE_NAME}`;
  },
  // Canonical predefinito: il percorso senza query, così filtri, ordinamenti
  // e parametri di tracciamento non creano copie della stessa pagina. Le
  // pagine in cui la query conta (set del catalogo, Pokédex) lo sovrascrivono.
  link: () => [{ rel: "canonical", href: currentUrl.value }],
});

useSeoMeta({
  description: SITE_DESCRIPTION,
  ogSiteName: SITE_NAME,
  ogType: "website",
  ogLocale: "it_IT",
  ogUrl: () => currentUrl.value,
  ogImage: DEFAULT_OG_IMAGE,
  twitterCard: "summary_large_image",
});
</script>
