<template>
  <div class="immersive pokedex">
    <header class="im-container pokedex__intro">
      <MoleculesBreadcrumb />
      <p class="im-eyebrow">{{ t("pokedex.kicker") }}</p>
      <h1 class="im-display pokedex__title">
        {{ t("pokedex.title") }}
        <span class="im-gradient-text">{{ t("pokedex.titleHighlight") }}</span>
      </h1>
      <p class="im-lead pokedex__lead">{{ t("pokedex.lead") }}</p>
    </header>

    <div class="im-container pokedex__layout">
      <aside class="pokedex__panel" :class="{ 'is-hidden-mobile': selected }">
        <label class="pokedex__search">
          <Icon name="heroicons:magnifying-glass-20-solid" size="18" />
          <input
            v-model="query"
            type="search"
            :placeholder="t('pokedex.searchPlaceholder')"
            :aria-label="t('pokedex.searchPlaceholder')"
          />
        </label>

        <div class="pokedex__gens" role="radiogroup" :aria-label="t('pokedex.generation')">
          <button
            v-for="option in generationOptions"
            :key="option.value"
            type="button"
            role="radio"
            class="pokedex__gen"
            :class="{ 'is-selected': generation === option.value }"
            :aria-checked="generation === option.value"
            @click="generation = option.value"
          >
            {{ option.label }}
          </button>
        </div>

        <p class="pokedex__count">
          {{ t("pokedex.shown", { n: visiblePokemon.length }) }}
        </p>

        <ul class="pokedex__grid">
          <li v-for="pokemon in visiblePokemon" :key="pokemon.id">
            <NuxtLink
              :to="{ query: { pokemon: pokemon.slug } }"
              class="pokedex__tile"
              :class="{ 'is-selected': selected?.id === pokemon.id }"
              :aria-current="selected?.id === pokemon.id ? 'true' : undefined"
            >
              <img
                :src="pokemonSprite(pokemon.id)"
                :alt="''"
                loading="lazy"
                decoding="async"
                width="96"
                height="96"
                class="pokedex__sprite"
              />
              <span class="pokedex__number">#{{ formatNumber(pokemon.id) }}</span>
              <span class="pokedex__name">{{ pokemon.name }}</span>
            </NuxtLink>
          </li>
        </ul>
        <p v-if="!visiblePokemon.length" class="pokedex__none">
          {{ t("pokedex.noMatch") }}
        </p>
      </aside>

      <section class="pokedex__results" aria-live="polite">
        <template v-if="selected">
          <NuxtLink :to="{ query: {} }" class="pokedex__back">
            <Icon name="heroicons:arrow-left-20-solid" size="18" />
            {{ t("pokedex.back") }}
          </NuxtLink>

          <div class="pokedex__hero im-glass">
            <img
              :src="pokemonArtwork(selected.id)"
              :alt="selected.name"
              class="pokedex__artwork"
              width="220"
              height="220"
            />
            <div class="pokedex__hero-text">
              <span class="pokedex__hero-number">#{{ formatNumber(selected.id) }}</span>
              <h2 class="im-display pokedex__hero-name">{{ selected.name }}</h2>
              <p class="pokedex__hero-count">
                <template v-if="loading && !cards.length">{{ t("pokedex.loading") }}</template>
                <template v-else>
                  {{ t("pokedex.cardsFound", { n: cards.length }) }}{{ hasMore ? "+" : "" }}
                </template>
              </p>
            </div>
            <div class="pokedex__steps">
              <NuxtLink
                v-if="previousPokemon"
                :to="{ query: { pokemon: previousPokemon.slug } }"
                class="pokedex__step"
                :aria-label="previousPokemon.name"
              >
                <Icon name="heroicons:chevron-left-20-solid" size="18" />
                #{{ formatNumber(previousPokemon.id) }}
              </NuxtLink>
              <NuxtLink
                v-if="nextPokemon"
                :to="{ query: { pokemon: nextPokemon.slug } }"
                class="pokedex__step"
                :aria-label="nextPokemon.name"
              >
                #{{ formatNumber(nextPokemon.id) }}
                <Icon name="heroicons:chevron-right-20-solid" size="18" />
              </NuxtLink>
            </div>
          </div>

          <div v-if="cards.length" class="pokedex__cards">
            <OrganismsListingProductsWeb :products="cards" />
          </div>
          <div v-else-if="loading" class="pokedex__cards">
            <div
              v-for="n in 8"
              :key="n"
              class="aspect-[63/88] rounded-2xl bg-neutrals-200 animate-pulse"
            ></div>
          </div>
          <div v-else class="pokedex__empty im-glass">
            <p>{{ t("pokedex.noCards", { name: selected.name }) }}</p>
            <NuxtLink :to="singlesUrl" class="im-btn im-btn--ghost">
              {{ t("pokedex.browseSingles") }}
            </NuxtLink>
          </div>

          <div v-if="hasMore" class="pokedex__more">
            <button
              type="button"
              class="im-btn im-btn--ghost"
              :disabled="loading"
              @click="loadCards(false)"
            >
              {{ loading ? t("pokedex.loading") : t("pokedex.loadMore") }}
            </button>
          </div>
        </template>

        <div v-else class="pokedex__placeholder im-glass">
          <img :src="logo" alt="" class="pokedex__placeholder-logo" />
          <p class="im-display">{{ t("pokedex.pickTitle") }}</p>
          <p class="pokedex__placeholder-text">{{ t("pokedex.pickText") }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import logo from "~/assets/logo/logo_new.png";
import {
  CATALOG_SEARCH_OVERRIDES,
  GENERATION_STARTS,
  POKEMON_NAMES,
  pokemonArtwork,
  pokemonSlug,
  pokemonSprite,
} from "~/data/pokedex";
import { mapStorefrontProducts } from "~/mapper/storefront.mapper";
import type { ProductType } from "~/types/productType.type";

/**
 * Pokédex: si sceglie un Pokémon e si vedono tutte le sue carte singole
 * disponibili. Il Pokémon scelto sta nell'indirizzo (`?pokemon=pikachu`),
 * così la pagina si può condividere e il tasto indietro funziona.
 *
 * Il catalogo cerca per testo, quindi "Mew" troverebbe anche "Mewtwo": i
 * risultati si ripassano tenendo solo le carte con il nome come parola intera.
 */
const { t, locale } = useI18n();
const route = useRoute();
const { getProducts, getMenu } = useShop();

const PAGE_SIZE = 60;

const pokedex = POKEMON_NAMES.map((name, index) => ({
  id: index + 1,
  name,
  slug: pokemonSlug(name),
}));

const formatNumber = (id: number) => String(id).padStart(4, "0");

/* ---- Elenco: ricerca e generazioni ---- */
const query = ref("");
const generation = ref(0);

const generationOptions = computed(() => [
  { value: 0, label: t("pokedex.all") },
  ...GENERATION_STARTS.map((_, index) => ({
    value: index + 1,
    label: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"][index],
  })),
]);

const normalize = (value: string) =>
  value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

const visiblePokemon = computed(() => {
  const term = normalize(query.value.trim().replace(/^#/, ""));
  const start = GENERATION_STARTS[generation.value - 1] ?? 1;
  const end = (GENERATION_STARTS[generation.value] ?? POKEMON_NAMES.length + 1) - 1;

  return pokedex.filter((pokemon) => {
    if (generation.value && (pokemon.id < start || pokemon.id > end)) return false;
    if (!term) return true;
    if (/^\d+$/.test(term)) return String(pokemon.id).includes(String(Number(term)));
    return normalize(pokemon.name).includes(term);
  });
});

/* ---- Pokémon scelto ---- */
const selected = computed(
  () => pokedex.find((pokemon) => pokemon.slug === route.query.pokemon) ?? null,
);
const previousPokemon = computed(() =>
  selected.value ? pokedex[selected.value.id - 2] ?? null : null,
);
const nextPokemon = computed(() =>
  selected.value ? pokedex[selected.value.id] ?? null : null,
);

/* ---- Carte disponibili ---- */
const singlesCategory = ref<string | undefined>();
const singlesUrl = computed(() =>
  singlesCategory.value ? `/pokemon/${singlesCategory.value}` : "/pokemon/all",
);

const cards = ref<ProductType[]>([]);
// Già in caricamento se si arriva con un Pokémon nell'indirizzo: altrimenti,
// in attesa del menu, comparirebbe per un attimo "nessuna carta".
const loading = ref(Boolean(route.query.pokemon));
const page = ref(0);
const totalPages = ref(0);
const hasMore = computed(() => page.value < totalPages.value);
let requestId = 0;

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Il nome come parola intera: "Mew" sì in "Mew ex", no in "Mewtwo". */
const nameMatcher = (term: string) =>
  new RegExp(`(^|[^\\p{L}])${escapeRegExp(term)}($|[^\\p{L}])`, "iu");

const loadCards = async (reset: boolean) => {
  const pokemon = selected.value;
  if (!pokemon) return;
  const id = ++requestId;
  if (reset) {
    cards.value = [];
    page.value = 0;
    totalPages.value = 0;
  }
  loading.value = true;

  const term = CATALOG_SEARCH_OVERRIDES[pokemon.name] ?? pokemon.name;
  const matcher = nameMatcher(term);

  try {
    const result = await getProducts({
      search: term,
      category: singlesCategory.value,
      available: true,
      hasImage: true,
      sort: "price_desc",
      perPage: PAGE_SIZE,
      page: page.value + 1,
    });
    if (id !== requestId) return;

    const matching = result.items.filter(
      (item) => matcher.test(item.name) || (item.nameIt ? matcher.test(item.nameIt) : false),
    );
    cards.value = [...cards.value, ...mapStorefrontProducts(matching, locale.value)];
    page.value = result.page || page.value + 1;
    totalPages.value = result.totalPages;
  } catch {
    if (id === requestId) totalPages.value = 0;
  } finally {
    if (id === requestId) loading.value = false;
  }
};

watch(
  () => selected.value?.id,
  () => {
    loadCards(true);
    if (import.meta.client && selected.value) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
);

onMounted(async () => {
  const menu = await getMenu().catch(() => ({ tree: [] }));
  singlesCategory.value = menu.tree?.[0]?.categories.find((category) =>
    /single/.test(category.slug),
  )?.slug;
  if (selected.value) loadCards(true);
});

useHead(() => ({
  title: selected.value
    ? `${selected.value.name} · Pokédex · Jigglycard`
    : "Pokédex · Jigglycard",
  meta: [{ name: "description", content: t("pokedex.lead") }],
}));
</script>

<style scoped>
.pokedex {
  min-height: 100vh;
  padding-bottom: 100px;
  background:
    radial-gradient(60% 40% at 80% 0%, rgba(236, 145, 160, 0.14), transparent 70%),
    var(--im-bg);
}

.pokedex__intro {
  padding-bottom: 28px;
}

.pokedex__title {
  margin-top: 12px;
  font-size: clamp(34px, 5vw, 60px);
}

.pokedex__lead {
  max-width: 640px;
  margin-top: 14px;
}

.pokedex__layout {
  display: grid;
  gap: 28px;
  align-items: start;
}

@media (min-width: 1024px) {
  .pokedex__layout {
    grid-template-columns: 380px minmax(0, 1fr);
  }
}

/* ---------- Elenco ---------- */
.pokedex__panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  border-radius: 22px;
  border: 1px solid var(--im-line);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02));
}

@media (min-width: 1024px) {
  .pokedex__panel {
    position: sticky;
    top: 104px;
    max-height: calc(100vh - 124px);
  }
}

@media (max-width: 1023px) {
  .pokedex__panel.is-hidden-mobile {
    display: none;
  }
}

.pokedex__search {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 14px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.04);
  color: var(--im-muted);
}

.pokedex__search:focus-within {
  border-color: var(--im-pink-strong);
}

.pokedex__search input {
  width: 100%;
  border: 0;
  padding: 0;
  background: none;
  font-size: 15px;
  color: var(--im-ink);
}

.pokedex__search input:focus {
  outline: none;
  box-shadow: none;
}

.pokedex__gens {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.pokedex__gen {
  padding: 5px 11px;
  border-radius: 999px;
  border: 1px solid var(--im-line);
  font-size: 12px;
  font-weight: 700;
  color: var(--im-muted);
  transition: all 0.2s ease;
}

.pokedex__gen:hover {
  color: var(--im-ink);
}

.pokedex__gen.is-selected {
  border-color: transparent;
  color: #2a0a14;
  background: linear-gradient(135deg, #fde4e8, var(--im-pink-strong));
}

.pokedex__count {
  font-size: 12px;
  color: var(--im-muted);
}

.pokedex__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  gap: 8px;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
}

.pokedex__tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 4px 10px;
  border-radius: 14px;
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.03);
  text-align: center;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.pokedex__tile:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.pokedex__tile.is-selected {
  border-color: var(--im-pink-strong);
  background: rgba(247, 210, 216, 0.12);
}

.pokedex__tile:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
}

.pokedex__sprite {
  width: 72px;
  height: 72px;
  image-rendering: pixelated;
}

.pokedex__number {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 10px;
  color: var(--im-muted);
}

.pokedex__name {
  max-width: 100%;
  overflow: hidden;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--im-ink);
}

.pokedex__none {
  font-size: 14px;
  color: var(--im-muted);
}

/* ---------- Risultati ---------- */
.pokedex__back {
  display: none;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
  font-size: 14px;
  font-weight: 600;
  color: var(--im-pink);
}

@media (max-width: 1023px) {
  .pokedex__back {
    display: inline-flex;
  }
}

.pokedex__hero {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding: 20px 24px;
  border-radius: 24px;
  overflow: hidden;
}

.pokedex__hero::before {
  content: "";
  position: absolute;
  left: -40px;
  top: 50%;
  width: 260px;
  height: 260px;
  margin-top: -130px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(247, 210, 216, 0.35), transparent 70%);
  pointer-events: none;
}

.pokedex__artwork {
  position: relative;
  width: 150px;
  height: 150px;
  object-fit: contain;
  filter: drop-shadow(0 16px 24px rgba(0, 0, 0, 0.5));
  animation: pokedex-float 4s ease-in-out infinite;
}

@media (min-width: 768px) {
  .pokedex__artwork {
    width: 190px;
    height: 190px;
  }
}

.pokedex__hero-text {
  display: flex;
  flex: 1;
  min-width: 200px;
  flex-direction: column;
  gap: 4px;
}

.pokedex__hero-number {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 13px;
  letter-spacing: 0.12em;
  color: var(--im-pink);
}

.pokedex__hero-name {
  font-size: clamp(30px, 4vw, 48px);
}

.pokedex__hero-count {
  font-size: 15px;
  color: var(--im-muted);
}

.pokedex__steps {
  display: flex;
  gap: 8px;
}

.pokedex__step {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid var(--im-line);
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 12px;
  color: var(--im-muted);
  transition: all 0.2s ease;
}

.pokedex__step:hover {
  border-color: rgba(247, 210, 216, 0.5);
  color: var(--im-ink);
}

.pokedex__cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

@media (min-width: 768px) {
  .pokedex__cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1280px) {
  .pokedex__cards {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.pokedex__empty,
.pokedex__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 48px 24px;
  border-radius: 24px;
  text-align: center;
  color: var(--im-muted);
}

.pokedex__placeholder .im-display {
  font-size: 24px;
}

.pokedex__placeholder-logo {
  width: 84px;
  animation: pokedex-float 4s ease-in-out infinite;
}

.pokedex__placeholder-text {
  max-width: 360px;
}

.pokedex__more {
  display: flex;
  justify-content: center;
  margin-top: 28px;
}

@keyframes pokedex-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pokedex__artwork,
  .pokedex__placeholder-logo {
    animation: none;
  }
}
</style>
