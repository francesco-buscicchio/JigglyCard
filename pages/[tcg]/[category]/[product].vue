<template>
  <div class="product-page im-container" v-if="product">
    <MoleculesBreadcrumb :current="formatTitle(product.productName)" />
    <MoleculesProductNeighbors v-if="product.code" :slug="product.id" />

    <!-- Mobile: immagine e titolo in testa, poi lo stesso box d'acquisto
         del desktop e la descrizione, uno sotto l'altro. -->
    <div v-if="isMobileView" class="product-stack">
      <MoleculesProductPageHero
        :image="product.imageUrlLarge || product.imageUrl"
        :title="formatTitle(product.productName)"
        :code="extractCardCode(product.code)"
        :expansion="product.expansion"
      />

      <section class="buy-box im-glass">
        <p v-if="product.available === false" class="buy-box__soldout">
          <span class="buy-box__soldout-dot" aria-hidden="true"></span>
          {{ t("product.card.soldOut") }}
        </p>
        <OrganismsProductsTags
          v-else
          :variants="product.variants"
          @variantSelected="changedVariant"
        />

        <OrganismsProductQuantityActions :variant="selectedVariant" :product="product" />
      </section>

      <MoleculesTextViewer class="description-panel im-glass">
        <template v-slot:title>
          {{ t("product.hero.Description") }}
        </template>
        <template v-slot:content>
          {{ description }}
        </template>
      </MoleculesTextViewer>
    </div>

    <!-- Desktop: carta a sinistra, box d'acquisto di vetro a destra. -->
    <div v-if="isDesktopView" class="product-desktop">
      <div class="product-layout">
        <div class="product-media">
          <!-- Le carte singole si inclinano seguendo il mouse, senza riflessi;
               buste e box restano foto ferme (sono quadrate, con fondo bianco). -->
          <AtomsHoloCard
            v-if="isSingle"
            :front="product.imageUrlLarge || product.imageUrl || defaultCardImage"
            :alt="formatTitle(product.productName)"
            foil="none"
            :glare="false"
            :max-tilt="10"
            eager
          />
          <img
            v-else
            :src="product.imageUrlLarge || product.imageUrl || defaultCardImage"
            :alt="formatTitle(product.productName)"
            class="product-media__photo"
          />
        </div>

        <section class="buy-box im-glass">
          <header class="buy-box__head">
            <div class="buy-box__chips">
              <span
                v-if="extractCardCode(product.code)"
                class="buy-box__chip buy-box__chip--code"
              >
                #{{ extractCardCode(product.code) }}
              </span>
              <span class="buy-box__chip">
                <Icon name="heroicons:rectangle-stack-20-solid" size="14" aria-hidden="true" />
                {{ product.expansion }}
              </span>
            </div>
            <h1 class="buy-box__title">
              {{ formatTitle(product.productName) }}
            </h1>
          </header>

          <p v-if="product.available === false" class="buy-box__soldout">
            <span class="buy-box__soldout-dot" aria-hidden="true"></span>
            {{ t("product.card.soldOut") }}
          </p>
          <OrganismsProductsTags
            v-else
            :variants="product.variants"
            @variantSelected="changedVariant"
          />

          <OrganismsProductQuantityActions :variant="selectedVariant" :product="product" />
        </section>
      </div>

      <MoleculesTextViewer class="description-panel product-description im-glass">
        <template v-slot:title>
          {{ t("product.hero.Description") }}
        </template>
        <template v-slot:content>
          {{ description }}
        </template>
      </MoleculesTextViewer>
    </div>

    <!-- Deals Carousel -->
    <OrganismsProductCarousel
      v-show="!isDesktopView"
      :title="t('product.sections.recommended')"
      :products="offerte"
      colorScheme="lightHome"
      class="mt-12"
    />
    <OrganismsProductCarouselWeb
      v-show="isDesktopView"
      :title="t('product.sections.recommended')"
      :products="offerte"
      colorScheme="lightHome"
    />
  </div>
  <OrganismsServiceBanner />
</template>

<script setup lang="ts">
// Come nel catalogo: si vende solo Pokémon (vedi SHOP_GAME), il resto è 404.
definePageMeta({
  validate: (route) => route.params.tcg === "pokemon",
});

const isDesktopView = isDesktop();
import {
  createTagCondition,
  createTagLanguage,
  createTagsStructure,
  findActiveLanguage,
} from "./product.utils";
import type { ListingTag } from "~/types/listingTag.type";
import type { TagStructure } from "~/types/tagStructure.type";
import type { TagCode } from "~/types/tagCode.type";
import type { ProductType } from "~/types/productType.type";
import OrganismsProductsTags from "~/components/Organisms/OrganismsProductsTags/OrganismsProductsTags.vue";
import defaultCardImage from "@/assets/img/default-card-image.png";
import { mapStorefrontProduct, mapStorefrontProducts } from "~/mapper/storefront.mapper";
import { useCartStore } from "~/stores/cart";

const product = ref();
const isSingle = computed(() =>
  /single/.test(product.value?.categorySlug ?? ""),
);
// Prodotto grezzo dal CMS: serve per la descrizione, che usa campi non
// presenti nella forma mappata per le card.
const raw = ref<any>(null);
const { t, te, locale } = useI18n();
const route = useRoute();
const { getProduct, getRecommended } = useShop();
const { recentlyViewed, remember } = useRecentlyViewed();
const cart = useCartStore();
const offerte: Ref<ProductType[]> = ref([]);
const isMobileView = isMobile();
const selectedVariant = ref(null);

onMounted(async () => {
  await fetchData();

  // La scheda appena aperta entra nella cronologia e fa da riferimento
  // principale per i suggerimenti.
  remember(String(route.params.product));
  cart.hydrate();

  const suggested = await getRecommended({
    seedSlugs: [
      String(route.params.product),
      ...recentlyViewed(),
      ...cart.lines.map((line) => line.productSlug),
    ],
    excludeSlugs: cart.lines.map((line) => line.productSlug),
    limit: 5,
  });
  offerte.value = mapStorefrontProducts(suggested.items, locale.value);
});

const tagsLanguage = ref<ListingTag[]>([]);
const tagsCondition = ref<ListingTag[]>([]);
let tagsStructure: TagStructure[];

async function fetchData() {
  // La rotta usa lo slug del prodotto come identificativo pubblico.
  const item = await getProduct(String(route.params.product));
  raw.value = item;
  product.value = mapStorefrontProduct(item, locale.value);

  tagsStructure = createTagsStructure(
    product.value.variants.map((variant: any) => ({
      language: variant.language,
      condition: variant.condition,
      price: variant.price,
    })),
  );
  setTags(tagsStructure);

  // I sigillati non hanno lingua né condizione da scegliere: senza selezione
  // automatica il pulsante "aggiungi al carrello" resterebbe inerte.
  if (!tagsLanguage.value.length && product.value.variants.length) {
    selectedVariant.value = product.value.variants[0];
  }
}

const setTags = (tagsStructure: TagStructure[]): void => {
  tagsLanguage.value = createTagLanguage(tagsStructure);
  const activeLanguage = findActiveLanguage(tagsLanguage.value, tagsStructure);
  const activeConditions = activeLanguage ? activeLanguage.conditions : [];
  tagsCondition.value = createTagCondition(tagsStructure, activeConditions);
};

function extractCardCode(input: string): string | undefined {
  const match = input.match(/\(([^)]+)\)/);
  return match ? match[1].toUpperCase() : undefined;
}

function formatTitle(title: string): string {
  return title.replace(/\s*\([^)]*\)/, "");
}

/**
 * Descrizione costruita dagli attributi reali della carta.
 *
 * Prima qui compariva un lorem ipsum su ogni scheda prodotto. CardTrader non
 * fornisce testi descrittivi (il campo `description` è la nota del venditore,
 * quasi sempre vuota), quindi si compone una frase con i dati che abbiamo:
 * set, numero da collezione, rarità, lingue e condizioni disponibili.
 */
/** Le carte singole hanno una condizione; i sigillati no. */
const isSingleCard = computed(() => Boolean(raw.value?.conditions?.length));

const description = computed(() => {
  const item = raw.value;
  if (!item) return "";
  if (item.description) return item.description;

  const parts: string[] = [];

  if (item.expansion) {
    parts.push(
      t(
        // I sigillati non sono carte: cambia il sostantivo.
        isSingleCard.value
          ? "product.description.fromSet"
          : "product.description.fromSetProduct",
        { name: item.name, expansion: item.expansion },
      ),
    );
  }
  if (item.collectorNumber) {
    parts.push(t("product.description.number", { number: item.collectorNumber }));
  }
  if (item.rarity) {
    parts.push(t("product.description.rarity", { rarity: item.rarity }));
  }
  if (item.languages?.length) {
    parts.push(
      t("product.description.languages", {
        languages: item.languages.map(translateValue).join(", "),
      }),
    );
  }
  if (item.conditions?.length) {
    parts.push(
      t("product.description.conditions", {
        conditions: item.conditions.map(translateValue).join(", "),
      }),
    );
  }

  return parts.join(" ");
});

const translateValue = (value: string) => {
  const key = `filter.${value}`;
  return te(key) ? t(key) : value;
};

const changedVariant = (variantID: TagCode): void => {
  selectedVariant.value = product.value.variants.filter((val: any) => {
    return val.documentId === variantID;
  })[0];
};
</script>

<style scoped>
@media (min-width: 1024px) {
  .product-page {
    padding-bottom: 24px;
  }
}

/* ---- Mobile ---- */
.product-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 8px;
}

/* ---- Desktop ---- */
.product-layout {
  display: grid;
  grid-template-columns: minmax(280px, 440px) minmax(0, 600px);
  justify-content: center;
  align-items: start;
  gap: clamp(40px, 5vw, 80px);
  margin-top: 32px;
}

/* Alone dietro la carta: luce d'ambiente sul fondo, non sulla carta (che
   resta senza riflessi, come chiesto). */
.product-media {
  position: relative;
  isolation: isolate;
}

.product-media::before {
  content: "";
  position: absolute;
  inset: 8% -6% -4%;
  z-index: -1;
  border-radius: 50%;
  background:
    radial-gradient(closest-side at 35% 40%, rgba(236, 145, 160, 0.32), transparent),
    radial-gradient(closest-side at 70% 70%, rgba(92, 200, 224, 0.22), transparent);
  filter: blur(40px);
  pointer-events: none;
}

/* Buste e box: foto quadrate su fondo bianco, in una cornice morbida. */
.product-media__photo {
  width: 100%;
  border-radius: 24px;
  box-shadow:
    0 30px 60px -24px rgba(0, 0, 0, 0.75),
    0 0 0 1px rgba(255, 255, 255, 0.08);
}

.product-description {
  max-width: 1120px;
  margin: 56px auto 0;
}

/* ---- Descrizione: pannello di vetro attorno a MoleculesTextViewer ---- */
.description-panel {
  position: relative;
  padding: 22px 20px;
  border-radius: 24px;
}

@media (min-width: 1024px) {
  .description-panel {
    padding: 32px 40px;
    border-radius: 28px;
  }
}

.description-panel::before {
  content: "";
  position: absolute;
  top: -1px;
  left: 24px;
  right: 24px;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(247, 210, 216, 0.45) 35%,
    rgba(92, 200, 224, 0.45) 65%,
    transparent
  );
  pointer-events: none;
}

/* Lineetta a sfumatura davanti al titolo "Descrizione". */
.description-panel :deep(.text-viewer__title) {
  display: flex;
  align-items: center;
  gap: 12px;
}

.description-panel :deep(.text-viewer__title)::before {
  content: "";
  flex: none;
  width: 28px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--im-pink-strong), var(--im-teal));
}

/* ---- Box d'acquisto (mobile e desktop) ---- */
/* z-index: il vetro crea un contesto di sovrapposizione, e senza la tendina
   della quantità finirebbe sotto il pannello della descrizione. */
.buy-box {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
  border-radius: 24px;
  box-shadow: 0 30px 70px -40px rgba(0, 0, 0, 0.8);
}

/* Filo di luce sul bordo alto, come le card della home. */
.buy-box::before {
  content: "";
  position: absolute;
  top: -1px;
  left: 24px;
  right: 24px;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(247, 210, 216, 0.6) 35%,
    rgba(92, 200, 224, 0.6) 65%,
    transparent
  );
  pointer-events: none;
}

@media (min-width: 1024px) {
  .buy-box {
    gap: 28px;
    padding: 36px;
    border-radius: 28px;
  }
}

.buy-box__head {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 28px;
}

/* Divisore a sfumatura sotto il titolo. */
.buy-box__head::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.02));
}

.buy-box__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.buy-box__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.05);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--im-muted);
}

.buy-box__chip--code {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  color: var(--im-pink);
  border-color: rgba(247, 210, 216, 0.3);
  background: rgba(247, 210, 216, 0.08);
}

.buy-box__title {
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-weight: 800;
  font-size: clamp(30px, 3.4vw, 46px);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--im-ink);
  overflow-wrap: anywhere;
}

.buy-box__soldout {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid rgba(224, 81, 104, 0.45);
  background: rgba(224, 81, 104, 0.12);
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 13px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--im-pink);
}

.buy-box__soldout-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--im-rose);
  box-shadow: 0 0 10px var(--im-rose);
}

/* Entrata breve: i dati arrivano dopo il montaggio e senza transizione il
   blocco "scattava" in pagina. `backwards` e non `both`: finita l'entrata
   non resta un transform applicato. */
.product-media,
.buy-box {
  animation: product-in 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
}

.buy-box {
  animation-delay: 0.08s;
}

@keyframes product-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .product-media,
  .buy-box {
    animation: none;
  }
}
</style>
