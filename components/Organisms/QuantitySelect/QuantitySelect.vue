<template>
  <div>
    <div class="flex items-center gap-13">
      <div class="flex mr-6 my-7 items-center gap-3">
        <div>
          <p class="mr-6">{{ $t("quantitySelect.quantity") }}:</p>
          <p class="my-1 text-xs" v-show="isDesktopView && !isCart">
            ({{ $t("quantitySelect.availability") }}: {{ quantity }}
            {{ $t("quantitySelect.pieces") }} )
          </p>
        </div>
        <MoleculesPageSorter
          :sortingItems="quantityOptions"
          :selected="quantity"
          @handleSorting="updateQuantity"
        />
      </div>

      <h2 v-show="!isDesktopView" :class="!isCart ? 'mr-10' : ''" class="price">
        {{ totalPrice }} €
      </h2>
    </div>

    <p class="my-2" v-show="!isDesktopView && !isCart">
      {{ $t("quantitySelect.availability") }}: {{ quantity }}
      {{ $t("quantitySelect.pieces") }}
    </p>
    <div v-show="isDesktopView" class="flex gap-16 mt-6 items-center">
      <h2 class="whitespace-nowrap price-tag text-3xl">{{ totalPrice }} €</h2>

      <AtomsButtonCTA
        type="primary"
        :text="$t('productHero.AddToCart')"
        class="max-w-[30rem]"
      >
        <Icon name="jig:cart-white" size="30"></Icon>
      </AtomsButtonCTA>
    </div>
  </div>
</template>

<script setup lang="ts">
const isDesktopView = isDesktop();
const props = defineProps<{
  quantity: number;
  price: number;
  isCart: boolean;
}>();

const quantity = ref(1);
const { t } = useI18n();
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
