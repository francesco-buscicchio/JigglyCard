<template>
  <div class="w-full px-[4%]" v-if="product">
    <MoleculesBreadcrumb />

    <!-- Product -->
    <MoleculesProductPageHero
      :image="product.imageUrl"
      :title="formatTitle(product.productName)"
      :code="extractCardCode(product.productName)"
      :expansion="product.expansion"
    />

    <!-- Listing tags -->
    <div class="flex flex-col gap-8 mb-7">
      <MoleculesListingTag
        @handle-tag-click="handleTagClickLanguage"
        :tags="tagsLanguage"
        :title="t('filter.language')"
        v-if="tagsLanguage.length"
      />
      <MoleculesListingTag
        @handle-tag-click="handleTagClickCondition"
        :tags="tagsCondition"
        :title="t('filter.condition')"
        v-if="tagsCondition.length"
      />
    </div>

    <!-- Select quantity, Add to Cart CTA  and Description-->
    <div class="flex flex-col gap-12">
      <OrganismsQuantitySelect
        :price="product.price"
        :quantity="product.quantity"
      />

      <AtomsButtonCTA type="primary" :text="t('productHero.AddToCart')">
        <Icon name="jig:cart-white" size="30"></Icon>
      </AtomsButtonCTA>

      <MoleculesTextViewer>
        <template v-slot:content>
          descrizione: {{ t("defaultDescription") }}
        </template>
      </MoleculesTextViewer>
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

    <OrganismsServiceBanner class="mb-18" />
  </div>
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
import type { ListingTagProps } from "~/types/listingTag.type";
import type { TagStructure } from "~/types/tagStructure.type";
import type { TagCode } from "~/types/tagCode.type";
import { TagType } from "~/enum/tag.enum";
import type { ProductType } from "~/types/productType.type";

const product = ref();
const { t } = useI18n();
const config = useRuntimeConfig();
const route = useRoute();
const client = useAlgolia();
const offerte: Ref<ProductType[]> = ref([]);

onMounted(async () => {
  fetchData();
  const results = await client.searchSingleIndex({
    indexName: "ecommerce",
    searchParams: { query: DEALS_TAG, hitsPerPage: 5 },
  });
  setDeals(results);
});

const tagsLanguage = ref<ListingTagProps[]>([]);
const tagsCondition = ref<ListingTagProps[]>([]);
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

const handleTagClickLanguage = (code: TagCode): void => {
  const activeConditions = tagsStructure.find(
    (tag) => tag.language === code
  )?.conditions;
  if (activeConditions) {
    tagsCondition.value = createTagCondition(tagsStructure, activeConditions);
  }
  tagsLanguage.value = activateLanguage(tagsLanguage.value, code);
};

const handleTagClickCondition = (code: TagCode): void => {
  const conditionSelected = tagsCondition.value.find(
    (tag) => tag.code === code
  );
  if (conditionSelected?.type === TagType.DISABLED) {
    const tagContainThisCondition = tagsStructure.find((tag) =>
      tag.conditions.some((cond) => cond === conditionSelected?.code)
    );
    handleTagClickLanguage(tagContainThisCondition?.language as TagCode);
  }

  tagsCondition.value = tagsCondition.value.map((tag) => {
    let tagType;

    if (tag.type === TagType.DISABLED) {
      tagType = TagType.DISABLED;
    } else if (tag.code === code) {
      tagType = TagType.ACTIVE;
    } else {
      tagType = TagType.INACTIVE;
    }

    return {
      ...tag,
      type: tagType,
    };
  });
};
</script>
