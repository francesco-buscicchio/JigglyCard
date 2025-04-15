<template>
  <div>
    <!-- mobile -->
    <div v-show="!isDesktopView">
      <div class="flex items-center gap-14">
        <div class="flex items-center">
          <p class="mr-6">{{ t("quantitySelect.quantity") }}:</p>
          <MoleculesPageSorter
            :sortingItems="quantityOptions"
            :selected="quantity"
            @handleSorting="updateQuantity"
          />
        </div>

        <h2 class="price-tag">{{ totalPrice }} €</h2>
      </div>
      <p class="my-2">
        {{ t("quantitySelect.availability") }}: {{ quantity }}
        {{ t("quantitySelect.pieces") }}
      </p>

      <AtomsButtonCTA
        type="primary"
        :text="t('productHero.AddToCart')"
        class="max-w-[30rem] mt-12"
      >
        <Icon name="jig:cart-white" size="30"></Icon>
      </AtomsButtonCTA>
    </div>

    <!-- desktop -->
    <div v-show="isDesktopView">
      <div class="flex mr-6 my-7 items-center gap-7">
        <div class="">
          <p>{{ t("quantitySelect.quantity") }}:</p>
          <p class="my-1 text-xs">
            ({{ t("quantitySelect.availability") }}: {{ quantity }}
            {{ t("quantitySelect.pieces") }} )
          </p>
        </div>
        <MoleculesPageSorter
          :sortingItems="quantityOptions"
          :selected="quantity"
          @handleSorting="updateQuantity"
        />
      </div>

      <div class="flex gap-16 mt-10 items-center">
        <h2 class="whitespace-nowrap price-tag text-3xl">{{ totalPrice }} €</h2>
        <AtomsButtonCTA
          type="primary"
          :text="t('productHero.AddToCart')"
          class="max-w-[30rem]"
        >
          <Icon name="jig:cart-white" size="30"></Icon>
        </AtomsButtonCTA>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const isDesktopView = isDesktop();
const quantity = ref(1);
const props = defineProps<{
  quantity: number;
  price: number;
}>();

const quantityOptions = computed(() => {
  return Array.from({ length: props.quantity }, (_, i) => ({
    value: (i + 1).toString(),
    name: (i + 1).toString(),
  }));
});

const totalPrice = computed(() => (quantity.value * props.price).toFixed(2));

function updateQuantity(newQuantity: string) {
  quantity.value = Number(newQuantity);
}
</script>
