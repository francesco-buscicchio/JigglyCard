<template>
  <div class="flex flex-col gap-y-6">
    <div class="mx-[4vw] mt-7">
      <MoleculesHeroBanner
        :slides="setHeroBanner"
        :loading="heroBannerLoading"
      />
    </div>

    <OrganismsProductCarouselWeb
      v-if="isDesktopView"
      :title="t('home.sections.highlights')"
      :products="evidenza"
      colorScheme="lightHome"
      :loading="highlightsLoading"
    />
    <OrganismsProductCarousel
      v-if="isMobileView"
      :title="t('home.sections.highlights')"
      :products="evidenza"
      colorScheme="lightHome"
      :loading="highlightsLoading"
    />
    <OrganismsNewsCarouselDesktop
      v-if="isDesktopView"
      :products="novita"
      :loading="whatsNewLoading"
    ></OrganismsNewsCarouselDesktop>

    <OrganismsProductCarousel
      v-if="isMobileView"
      :title="t('home.sections.whatsNew')"
      :products="novita"
      colorScheme="primaryHome"
      :loading="whatsNewLoading"
    />

    <OrganismsProductCarousel
      v-if="isMobileView"
      :title="t('home.sections.deals')"
      :products="offerte"
      colorScheme="lightHome"
      :loading="dealsLoading"
    />

    <OrganismsProductCarouselWeb
      v-if="isDesktopView"
      :title="t('home.sections.deals')"
      :products="offerte"
      colorScheme="lightHome"
      :loading="dealsLoading"
    />

    <OrganismsServiceBanner />
  </div>
</template>

<script setup lang="ts">
import { mapStorefrontProducts } from "~/mapper/storefront.mapper";
import type { ProductType } from "~/types/productType.type";
import type { CmsExpansion } from "~/types/shop";

const { t, locale } = useI18n();
const { getHome, getExpansions } = useShop();
const offerte: Ref<ProductType[]> = ref([]);
const novita: Ref<ProductType[]> = ref([]);
const evidenza: Ref<ProductType[]> = ref([]);
// In vetrina vanno le espansioni, non i singoli prodotti.
const setHeroBanner: Ref<CmsExpansion[]> = ref([]);
const isMobileView = isMobile();
const isDesktopView = isDesktop();
const highlightsLoading = ref(true);
const whatsNewLoading = ref(true);
const dealsLoading = ref(true);
const heroBannerLoading = ref(true);

onMounted(async () => {
  await fetchHomeData();
});

async function fetchHomeData() {
  evidenza.value = [];
  novita.value = [];
  offerte.value = [];
  setHeroBanner.value = [];

  try {
    const [home, expansions] = await Promise.all([
      getHome(),
      // In vetrina i set di uscita più recente, esclusi quelli con pochi pezzi.
      getExpansions({ limit: 6, minProducts: 20 }),
    ]);

    evidenza.value = mapStorefrontProducts(home.highlights, locale.value);
    novita.value = mapStorefrontProducts(home.whatsNew, locale.value);
    offerte.value = mapStorefrontProducts(home.deals, locale.value);
    setHeroBanner.value = expansions.items;
  } finally {
    highlightsLoading.value = false;
    whatsNewLoading.value = false;
    dealsLoading.value = false;
    heroBannerLoading.value = false;
  }
}

useHead({
  title: "Jigglycard",
  meta: [
    {
      name: "Jigglycard",
      content:
        "Entra nel magico mondo Pokemon, carte singole, prodotti sealed, permuta collezioni...",
    },
  ],
});
</script>
