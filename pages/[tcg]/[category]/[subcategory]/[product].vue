<template>
  <div class="w-full px-[4%]" v-if="product">
    <MoleculesBreadcrumb />

    <!-- Mobile -->
    <div v-if="isMobileView">
      <!-- Product -->
      <MoleculesProductPageHero
        :image="product.imageUrl"
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
        <OrganismsProductQuantityActions :variant="selectedVariant" />

        <MoleculesTextViewer>
          <template v-slot:content>
            {{ t("product.hero.Description") }}:
            {{ t("product.messages.defaultDescription") }}
          </template>
        </MoleculesTextViewer>
      </div>
    </div>

    <!-- Desktop -->
    <div v-if="isDesktopView">
      <div class="flex gap-20 my-12 xl:ml-[14vw]">
        <div>
          <img
            :src="product.imageUrl ?? defaultCardImage"
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

          <OrganismsProductQuantityActions :variant="selectedVariant" />
        </div>
      </div>
      <div class="xl:mx-[14vw] my-18">
        <MoleculesTextViewer>
          <template v-slot:title>
            {{ t("product.hero.Description") }}
          </template>
          <template v-slot:content>
            {{ t("product.messages.defaultDescription") }}
          </template>
        </MoleculesTextViewer>
      </div>
    </div>

    <!-- Deals Carousel -->
    <OrganismsProductCarousel
      v-show="!isDesktopView"
      :title="t('home.sections.deals')"
      :products="offerte"
      colorScheme="lightHome"
      class="my-14"
    />
    <OrganismsProductCarouselWeb
      v-show="isDesktopView"
      :title="t('home.sections.deals')"
      :products="offerte"
      colorScheme="lightHome"
    />
  </div>
  <OrganismsServiceBanner />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
const isDesktopView = isDesktop();
import { DEALS_TAG, PRODUCTS_COLLECTION } from "~/data/const";
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
import { mapProductItem, mapProducts } from "~/mapper/products.mapper";

const product = ref();
const { t } = useI18n();
const route = useRoute();
const client = useAlgolia();
const offerte: Ref<ProductType[]> = ref([]);
const isMobileView = isMobile();
const selectedVariant = ref(null);

onMounted(async () => {
  fetchData();
  const results = await client.searchSingleIndex({
    indexName: "ecommerce",
    searchParams: {
      query: DEALS_TAG,
      hitsPerPage: 5,
      filters: "available:true",
    },
  });
  setDeals(results);
});

const tagsLanguage = ref<ListingTag[]>([]);
const tagsCondition = ref<ListingTag[]>([]);
let tagsStructure: TagStructure[];

async function fetchData() {
  let results = await client.search({
    requests: [
      {
        indexName: PRODUCTS_COLLECTION,
        filters: `objectID:"${route.params.product}"`,
      },
    ],
  });
  tagsStructure = createTagsStructure(results.results[0]);
  setTags(tagsStructure);
  setProduct(results.results[0]);
}

const setTags = (tagsStructure: TagStructure[]): void => {
  tagsLanguage.value = createTagLanguage(tagsStructure);
  const activeLanguage = findActiveLanguage(tagsLanguage.value, tagsStructure);
  const activeConditions = activeLanguage ? activeLanguage.conditions : [];
  tagsCondition.value = createTagCondition(tagsStructure, activeConditions);
};

const setProduct = (queryResult: any) => {
  if (queryResult.hits) {
    const item = queryResult.hits[0];
    product.value = mapProductItem(item);
  }
};

const setDeals = (queryResult: any) => {
  offerte.value = mapProducts(queryResult);
};

function extractCardCode(input: string): string | undefined {
  const match = input.match(/\(([^)]+)\)/);
  return match ? match[1].toUpperCase() : undefined;
}

function formatTitle(title: string): string {
  return title.replace(/\s*\([^)]*\)/, "");
}

const changedVariant = (variantID: TagCode): void => {
  selectedVariant.value = product.value.variants.filter((val: any) => {
    return val.documentId === variantID;
  })[0];
};
</script>
