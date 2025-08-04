<template>
  <div class="w-full px-[4%]" v-if="product">
    <MoleculesBreadcrumb />

    <!-- Mobile -->
    <div v-if="isMobileView">
      <!-- Product -->
      <MoleculesProductPageHero
        :image="product.imageUrl"
        :title="formatTitle(product.productName)"
        :code="extractCardCode(product.productName)"
        :expansion="product.expansion"
      />

      <!-- Listing tags -->
      <OrganismsProductsTags :variants="product.variants" />
      <div class="flex flex-col gap-8 mb-7">
        <OrganismsProductsTags
          :variants="product.variants"
          @variantSelected="changedVariant"
        />
      </div>

      <div class="flex flex-col gap-12">
        <OrganismsProductQuantityActions :variant="selectedVariant.value" />

        <MoleculesTextViewer>
          <template v-slot:content>
            descrizione: {{ t("defaultDescription") }}
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
                {{ extractCardCode(product.productName) }}
              </p>
              <p class="pt-2">{{ product.expansion }}</p>

              <OrganismsProductsTags
                :variants="product.variants"
                @variantSelected="changedVariant"
              />
            </div>
          </div>

          <OrganismsProductQuantityActions :variant="selectedVariant" />
        </div>
      </div>
      <div class="xl:mx-[14vw] my-18">
        <MoleculesTextViewer>
          <template v-slot:title>
            {{ t("productHero.Description") }}
          </template>
          <template v-slot:content>
            {{ t("defaultDescription") }}
          </template>
        </MoleculesTextViewer>
      </div>
    </div>

    <!-- Deals Carousel -->
    <OrganismsProductCarousel
      v-show="!isDesktopView"
      :title="t('deals')"
      :products="offerte"
      colorScheme="lightHome"
      class="my-14"
    />
    <OrganismsProductCarouselWeb
      v-show="isDesktopView"
      :title="t('deals')"
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
  activateLanguage,
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

const product = ref();
const { t } = useI18n();
const route = useRoute();
const client = useAlgolia();
const offerte: Ref<ProductType[]> = ref([]);
const toastKey = ref(0);
const isMobileView = isMobile();
const selectedVariant = ref(null);

onMounted(async () => {
  fetchData();
  const results = await client.searchSingleIndex({
    indexName: "ecommerce",
    searchParams: { query: DEALS_TAG, hitsPerPage: 5 },
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
// TODO: refactor mettere setProducts in una utils perchè usata più volte
const setProduct = (queryResult: any) => {
  if (queryResult.hits) {
    const item = queryResult.hits[0];
    product.value = {
      productName: item.name,
      code: item.code ? `(${item.code})` : "",
      expansion: item.expansion || "N.A.",
      price: item.salePrice ? item.salePrice.toFixed(2) : "0.00",
      imageUrl:
        item.thumbnailImage ||
        (item.images && item.images.length > 0 ? item.images[0] : null),
      tcg: item.tcg,
      category: item.type,
      id: item.objectID,
      variants: item.variantsDetails,
      quantity: item.quantity,
    };
  }
};
// TODO: refactor mettere setProducts in una utils perchè usata più volte
const setDeals = (queryResult: any) => {
  for (let hit of queryResult.hits) {
    const obj = {
      id: hit.objectID,
      productName: hit.name,
      code: hit.code ? `(${hit.code})` : "",
      expansion: hit.expansion || "N.A.",
      price: hit.salePrice ? hit.salePrice.toFixed(2) : "0.00",
      imageUrl:
        hit.thumbnailImage ||
        (hit.images && hit.images.length > 0 ? hit.images[0] : null),
      tcg: hit.tcg,
      category: hit.type,
    };
    offerte.value.push(obj);
  }
};

function extractCardCode(input: string): string | undefined {
  const match = input.match(/\(([^)]+)\)/);
  return match ? match[1] : undefined;
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
