<template>
  <div class="w-full px-[4%]" v-if="product">
    <MoleculesBreadcrumb />

    <!-- Mobile -->
    <div v-if="isMobileView">
      <!-- Product -->
      <MoleculesProductPageHero
        :image="product.imageUrlLarge || product.imageUrl"
        :title="formatTitle(product.productName)"
        :code="extractCardCode(product.code)"
        :expansion="product.expansion"
      />

      <!-- Listing tags -->
      <div class="flex flex-col gap-8 mb-7">
        <div v-if="product.available === false">
          <h2 class="price-tag text-center">
            {{ t("product.card.soldOut") }}
          </h2>
        </div>
        <div v-else>
          <OrganismsProductsTags
            :variants="product.variants"
            @variantSelected="changedVariant"
          />
        </div>
      </div>

      <div class="flex flex-col gap-12">
        <OrganismsProductQuantityActions :variant="selectedVariant" :product="product" />

        <MoleculesTextViewer>
          <template v-slot:content>
            {{ t("product.hero.Description") }}: {{ description }}
          </template>
        </MoleculesTextViewer>
      </div>
    </div>

    <!-- Desktop -->
    <div v-if="isDesktopView">
      <div class="flex gap-20 my-12 xl:ml-[14vw]">
        <div>
          <img
            :src="product.imageUrlLarge || product.imageUrl || defaultCardImage"
            class="w-[400px] shadow-xl rounded-2xl"
          />
        </div>
        <div class="flex flex-col">
          <div class="flex flex-col gap-8 lg:gap-4 mb-7 w-full">
            <div>
              <h1 class="text-accent-500">
                {{ formatTitle(product.productName) }}
              </h1>
              <p v-if="product.productName" class="pt-2">
                {{ extractCardCode(product.code) }}
              </p>
              <p class="pt-2">{{ product.expansion }}</p>

              <div>
                <div v-if="product.available === false">
                  <h2 class="price-tag pt-6">
                    {{ t("product.card.soldOut") }}
                  </h2>
                </div>
                <div v-else>
                  <OrganismsProductsTags
                    :variants="product.variants"
                    @variantSelected="changedVariant"
                  />
                </div>
              </div>
            </div>
          </div>

          <OrganismsProductQuantityActions :variant="selectedVariant" :product="product" />
        </div>
      </div>
      <div class="xl:mx-[14vw] my-18">
        <MoleculesTextViewer>
          <template v-slot:title>
            {{ t("product.hero.Description") }}
          </template>
          <template v-slot:content>
            {{ description }}
          </template>
        </MoleculesTextViewer>
      </div>
    </div>

    <!-- Deals Carousel -->
    <OrganismsProductCarousel
      v-show="!isDesktopView"
      :title="t('product.sections.recommended')"
      :products="offerte"
      colorScheme="lightHome"
      class="my-14"
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
