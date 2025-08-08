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
            @removeVariantClicked="removeItem(item)"
            @quantityChanged="changeQuantity($event, item)"
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
      <div
        class="lg:bg-accent-50 lg:rounded-lg lg:w-[430px] lg:mb-20"
        v-if="products.length > 0"
      >
        <OrganismsShippingMode
          :total-cart="totalCart"
          :products="products"
          :couponData="couponData"
          @couponApplied="applyCoupon"
          @removeCoupon="removeCoupon"
        />
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
import { type CartConfig } from "~/composables/useCart";

const { t } = useI18n();
const runtimeConfig = useRuntimeConfig();
const cartConfig: CartConfig = {
  strapiBaseUrl: runtimeConfig.public.STRAPI_BASE_URL,
  fullAccessToken: runtimeConfig.public.FULL_ACCESS_TOKEN,
};

const {
  products,
  totalCart,
  couponData,
  changeQuantity,
  removeItem,
  applyCoupon,
  removeCoupon,
} = useCart(cartConfig);
</script>
