<template>
  <nav class="crumbs" :aria-label="t('layout.breadcrumb.label')">
    <ol>
      <li v-for="(crumb, index) in crumbs" :key="`${index}-${crumb.label}`">
        <NuxtLink v-if="crumb.to && index < crumbs.length - 1" :to="crumb.to">
          <Icon
            v-if="index === 0"
            name="heroicons:home-20-solid"
            size="14"
            class="crumbs__home"
          />
          {{ crumb.label }}
        </NuxtLink>
        <span v-else aria-current="page">{{ crumb.label }}</span>
        <Icon
          v-if="index < crumbs.length - 1"
          name="heroicons:chevron-right-20-solid"
          size="14"
          class="crumbs__sep"
          aria-hidden="true"
        />
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
/**
 * Percorso della pagina, ricavato dall'indirizzo: Home › categoria › prodotto,
 * oppure Home › Carrello › Checkout. Prima era un "torna indietro" basato
 * sulla cronologia, con etichette legate a rotte che non esistono più.
 *
 * `current` è l'etichetta dell'ultima voce quando l'indirizzo da solo non
 * basta (il nome del prodotto, che nell'URL è uno slug).
 */
const props = defineProps<{ current?: string }>();

const { t, te } = useI18n();
const route = useRoute();

/** Nome leggibile di una categoria dal suo slug ("pokemon-singles"). */
const categoryLabel = (slug: string) => {
  if (slug === "all") return t("layout.breadcrumb.all");
  const key = `category.${slug}`;
  if (te(key)) return t(key);
  const words = slug.replace(/^pokemon-/, "").replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
};

const crumbs = computed(() => {
  const list: { label: string; to?: string }[] = [
    { label: t("layout.breadcrumb.home"), to: "/" },
  ];
  const { tcg, category, product } = route.params as Record<string, string>;

  if (route.path.startsWith("/pokedex")) {
    list.push({ label: t("pokedex.menu") });
  } else if (route.path.startsWith("/spedizioni")) {
    list.push({ label: t("layout.footer.links.shipping") });
  } else if (route.path.startsWith("/carrello")) {
    list.push({ label: t("layout.breadcrumb.cart") });
  } else if (route.path.startsWith("/checkout")) {
    list.push({ label: t("layout.breadcrumb.cart"), to: "/carrello" });
    list.push({ label: t("layout.breadcrumb.checkout") });
  } else if (tcg === "search") {
    list.push({ label: t("layout.breadcrumb.search", { term: category }) });
  } else if (tcg && category) {
    list.push({ label: categoryLabel(category), to: `/${tcg}/${category}` });
    if (product) list.push({ label: props.current || product });
  }

  return list;
});
</script>

<style scoped>
.crumbs {
  padding: 20px 0;
}

.crumbs ol {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.crumbs li {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--im-muted);
}

.crumbs a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--im-muted);
  transition: color 0.2s ease;
}

.crumbs a:hover {
  color: var(--im-pink);
}

.crumbs [aria-current="page"] {
  max-width: 60vw;
  overflow: hidden;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--im-ink);
}

.crumbs__sep {
  opacity: 0.5;
}
</style>
