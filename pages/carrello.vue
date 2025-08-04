<template>
  <div class="gap-b-4 flex flex-col px-4">
    <MoleculesBreadcrumb />
  </div>
  <h1 class="text-accent-500 text-center pb-8">{{ t("cart") }}</h1>
  <div v-if="products.length > 0">
    <div class="lg:flex lg:gap-20 lg:mx-20">
      <div class="lg:flex-1">
        <div
          v-for="(item, index) of products"
          :key="index"
          :class="[
            'mx-5 py-4 border-t-[2px] border-neutral-200',
            { 'border-b-[2px]': index === products.length - 1 },
          ]"
        >
          <MoleculesCartCard
            :image="item.image"
            :selectedQuantity="item.selectedQuantity"
            :availableQuantity="item.availableQuantity"
            :price="item.price"
            :alt="item.title"
            @removeVariantClicked="removeItemFromCart(item)"
            @quantityChanged="quantityChanged($event, item)"
          >
            <div>
              <h5 class="pb-2 text-lg">{{ formatProductName(item.title) }}</h5>
              <p class="pb-2" v-show="isDesktopView">
                {{ extractProductCode(item.title) }}
              </p>
              <p class="pb-2">{{ item.language }}</p>
              <p class="pb-2">{{ item.condition }}</p>
            </div>
          </MoleculesCartCard>
        </div>
      </div>
      <div class="lg:bg-accent-50 lg:rounded-lg lg:w-[430px] lg:mb-20">
        <OrganismsShippingMode :total-cart="totalCart" />
      </div>
    </div>
  </div>
  <div v-else class="w-full px-4">
    <h5 class="text-center">
      {{ "Il tuo viaggio da allenatore non è ancora cominciato!" }}
    </h5>
  </div>

  <OrganismsProductCarouselWeb
    v-if="isDesktopView"
    :title="products.length > 0 ? t('suggested') : 'Inizia da qui'"
    :products="suggested"
    colorScheme="lightHome"
  />
  <OrganismsProductCarousel
    v-if="isMobileView"
    :title="products.length > 0 ? t('suggested') : 'Inizia da qui'"
    :products="suggested"
    colorScheme="lightHome"
  />
</template>

<script lang="ts" setup>
import { HIGHLIGHTS_TAG, PRODUCTS_COLLECTION } from "~/data/const";
import type { SearchProductResult } from "~/interface/searchProductResult.interface";
import type { ProductType } from "~/types/productType.type";
import { formatProductName, extractProductCode } from "~/utils/productUtils";
import {
  VariantStrapiService as VariantService,
  type Variant,
} from "~/service/Strapi/VariantService";
import { ProductStrapiService as ProductService } from "~/service/Strapi/ProductService";
import type { SearchResponse } from "algoliasearch";
import { CartService } from "~/service/CartService";
import { CartStrapiService } from "~/service/Strapi/CartService";

const config = useRuntimeConfig();
const { t } = useI18n();
const isMobileView = isMobile();
const isDesktopView = isDesktop();
const suggested: Ref<ProductType[]> = ref([]);
const products: any = ref([]);
const client = useAlgolia();
let cartService;
let cartData: any;

async function quantityChanged(newQuantity: number, item: any) {
  const quantityData = [...cartData.data.quantity];
  cartService!.updateQuantityData(quantityData, item.id, newQuantity);
}

const removeItemFromCart = async (item: any) => {
  await cartService!.removeItem(cartData.data, item);
  products.value = products.value.filter((val: any) => {
    return val.id !== item.id;
  });
};

const setSuggestProducts = (
  queryResult: SearchResponse<SearchProductResult>
) => {
  queryResult.hits.forEach((hit: any) => {
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

    suggested.value.push(obj);
  });
};

const variantService = new VariantService(
  config.public.STRAPI_BASE_URL,
  config.public.FULL_ACCESS_TOKEN
);

const productService = new ProductService(
  config.public.STRAPI_BASE_URL,
  config.public.FULL_ACCESS_TOKEN
);

const getCart = async () => {
  cartData = await cartService!.getCart();
  if (!cartData) return;
  for (let variant of cartData.data.variants) {
    const variantData = (
      await variantService.getVariantById(variant.documentId)
    ).data;
    const productData = (
      await productService.getProductById(variantData.product.documentId)
    ).data;
    const cartQuantity = cartData.data.quantity.filter((val: any) => {
      return val.variant === variant.documentId;
    });
    const obj = {
      id: variant.documentId,
      image: productData.thumbnail.url,
      selectedQuantity: cartQuantity ? cartQuantity[0].quantity : 0,
      availableQuantity: variantData.quantity,
      price: variantData.price / 100,
      totalPrice:
        (cartQuantity.length ? cartQuantity[0].quantity : 0) *
        (variantData.price / 100),
      title: productData.name,
      language: variantData.language.name,
      condition: variantData.condition.name,
    };
    products.value.push(obj);
  }
};

onMounted(async () => {
  cartService = CartService.getInstance(
    config.public.STRAPI_BASE_URL,
    config.public.FULL_ACCESS_TOKEN
  );

  await getCart();

  const results = await client.searchSingleIndex<SearchProductResult>({
    indexName: PRODUCTS_COLLECTION,
    searchParams: { query: HIGHLIGHTS_TAG, hitsPerPage: 5 },
  });

  setSuggestProducts(results);
});

const totalCart = computed(() => {
  return products.value
    .reduce((acc: number, item: any) => acc + item.totalPrice, 0)
    .toFixed(2);
});
</script>
