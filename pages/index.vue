<template>
  <div class="immersive">
    <OrganismsHomeHero
      :cards="heroCards"
      :latest="latestCard"
      :categories="categoryNames"
      :total-products="totalProducts"
      :singles-count="singlesCount"
      :loading="loading"
      :shop-url="shopUrl"
    />

    <OrganismsHomeStory
      :pack-art="latestExpansion?.coverImage"
      :pack-title="latestExpansion?.name"
      :cards="storyCards"
      :hit-card="hitCard"
      :pack="featuredPack"
      :pack-cards="featuredPackCards"
      :singles-url="singlesUrl"
    />

    <OrganismsHomeCategories v-if="categories.length" :categories="categories" />

    <OrganismsHomeShowcase
      v-if="loading || hasProducts"
      :tabs="showcaseTabs"
      :loading="loading"
      :all-url="shopUrl"
    />

    <OrganismsPackOpening />

    <OrganismsHomeSell />
  </div>
</template>

<script setup lang="ts">
import { mapStorefrontProducts } from "~/mapper/storefront.mapper";
import { translateCategory } from "~/data/menu";
import { productToShowcaseCard } from "~/utils/showcaseCards";
import { PACK_HAND_SIZE, useBoosterPacks } from "~/composables/useBoosterPacks";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/utils/seo";
import type { CmsExpansion, CmsMenu, CmsProduct } from "~/types/shop";
import type { HomeCategory } from "~/types/homeCategory.type";
import type { ShowcaseCard } from "~/types/showcaseCard.type";

const { t, te, locale } = useI18n();
const { getHome, getExpansions, getMenu, getProducts } = useShop();
const { packs, cardsBySet, loadPacks, loadCards } = useBoosterPacks();

const loading = ref(true);
const home = ref<{
  highlights: CmsProduct[];
  whatsNew: CmsProduct[];
  deals: CmsProduct[];
}>({ highlights: [], whatsNew: [], deals: [] });
const latestExpansion = ref<CmsExpansion | null>(null);
const menu = ref<CmsMenu["tree"]>([]);
const totalProducts = ref<number | null>(null);

const toCards = (products: CmsProduct[]): ShowcaseCard[] =>
  mapStorefrontProducts(products, locale.value)
    .filter((product) => product.imageUrl)
    .map(productToShowcaseCard);

const highlights = computed(() => toCards(home.value.highlights));
const whatsNew = computed(() => toCards(home.value.whatsNew));
const deals = computed(() => toCards(home.value.deals));

const hasProducts = computed(
  () => highlights.value.length + whatsNew.value.length + deals.value.length > 0,
);

/** Tutte le carte della home, senza doppioni. */
const allCards = computed(() => {
  const seen = new Set<string>();
  return [...highlights.value, ...whatsNew.value, ...deals.value].filter(
    (card) => (seen.has(card.key) ? false : (seen.add(card.key), true)),
  );
});

const priceOf = (card: ShowcaseCard) => Number(card.price ?? 0);

/** La carta di maggior valore in vetrina: la "hit" del racconto. */
const hitCard = computed(() => {
  const candidates = highlights.value.length ? highlights.value : allCards.value;
  if (!candidates.length) return null;
  return [...candidates].sort((a, b) => priceOf(b) - priceOf(a))[0];
});

const heroCards = computed(() => {
  const source = highlights.value.length >= 3 ? highlights.value : allCards.value;
  // La carta più pregiata va al centro, in primo piano.
  const hit = hitCard.value;
  if (!hit) return source.slice(0, 3);
  return [hit, ...source.filter((card) => card.key !== hit.key)].slice(0, 3);
});

const latestCard = computed(() => whatsNew.value[0] ?? null);

const storyCards = computed(() =>
  [...whatsNew.value, ...deals.value].filter(
    (card) => card.key !== hitCard.value?.key,
  ),
);

const showcaseTabs = computed(() => [
  { key: "highlights", label: t("home.sections.highlights"), cards: highlights.value },
  { key: "whatsNew", label: t("home.sections.whatsNew"), cards: whatsNew.value },
  { key: "deals", label: t("home.sections.deals"), cards: deals.value },
]);

/** Il menu arriva già ristretto al solo gioco in vendita (`SHOP_GAME`). */
const mainGame = computed(() => menu.value[0]);

const findCategory = (pattern: RegExp) =>
  mainGame.value?.categories.find((category) => pattern.test(category.slug));

const singlesCategory = computed(() => findCategory(/single/));
const boosterCategory = computed(() => findCategory(/booster/));

const categories = computed<HomeCategory[]>(() => {
  const game = mainGame.value;
  if (!game) return [];
  return game.categories
    .filter((category) => category.products > 0)
    .sort((a, b) => b.products - a.products)
    .map((category) => ({
      label: translateCategory(category.slug, category.name, game.name, t, te),
      to: `/${game.slug}/${category.slug}`,
      image: category.coverImage,
      products: category.products,
    }));
});

const categoryNames = computed(() =>
  categories.value.slice(0, 3).map((category) => category.label),
);

const singlesCount = computed(() => singlesCategory.value?.products ?? null);

const shopUrl = computed(() =>
  mainGame.value ? `/${mainGame.value.slug}/all` : "/pokemon/all",
);

const singlesUrl = computed(() =>
  mainGame.value && singlesCategory.value
    ? `/${mainGame.value.slug}/${singlesCategory.value.slug}`
    : shopUrl.value,
);

/* La busta del racconto: la prima in vendita con abbastanza carte del set. */
const featuredPack = computed(() => packs.value[0] ?? null);
const featuredPackCards = computed(() =>
  featuredPack.value ? (cardsBySet.value[featuredPack.value.expansionSlug] ?? []) : [],
);

const loadFeaturedPack = async () => {
  if (!boosterCategory.value || !singlesCategory.value) return;
  await loadPacks({
    booster: boosterCategory.value.slug,
    singles: singlesCategory.value.slug,
  });
  // Se il set della prima busta non basta, `loadCards` la toglie: si prova
  // con la successiva.
  for (let attempt = 0; attempt < 3 && featuredPack.value; attempt += 1) {
    const cards = await loadCards(featuredPack.value);
    if (cards.length >= PACK_HAND_SIZE) break;
  }
};

onMounted(() => {
  // Ogni richiesta si arrangia da sola: la più lenta non blocca le altre e se
  // una fallisce la pagina ripiega sulle carte d'esempio solo lì.
  getHome()
    .then((result) => (home.value = result))
    .catch(() => {})
    .finally(() => (loading.value = false));

  getExpansions({ limit: 1, minProducts: 20 })
    .then((result) => (latestExpansion.value = result.items[0] ?? null))
    .catch(() => {});

  getProducts({ available: true, perPage: 1 })
    .then((result) => (totalProducts.value = result.total || null))
    .catch(() => {});

  // Categorie e buste dipendono dal menu: partono appena arriva.
  getMenu()
    .then((result) => {
      menu.value = result.tree ?? [];
      return loadFeaturedPack();
    })
    .catch(() => {});
});

usePageSeo({ title: SITE_TITLE, description: SITE_DESCRIPTION });
</script>
