<template>
  <div class="flex flex-col gap-y-10 px-100">
    <AtomsButtonCTA
      text="Aggiungi al Carrello variant_01JB42E9F232C6NY0XNY69EFRG"
      @click="addItemToCart(`variant_01JB42E9F232C6NY0XNY69EFRG`)"
    />
    <AtomsButtonCTA
      text="Rimuovi dal Carrello variant_01JB42E9F232C6NY0XNY69EFRG"
      @click="removeItemToCart(`variant_01JB42E9F232C6NY0XNY69EFRG`)"
    />
    <AtomsButtonCTA
      text="Aggiungi al Carrello variant_01JB42E9F42Q5ACMM0JN17GYZY"
      @click="addItemToCart(`variant_01JB42E9F42Q5ACMM0JN17GYZY`)"
    />
    <AtomsButtonCTA
      text="Rimuovi dal Carrello variant_01JB42E9F42Q5ACMM0JN17GYZY"
      @click="removeItemToCart(`variant_01JB42E9F42Q5ACMM0JN17GYZY`)"
    />
  </div>
</template>

<script setup lang="ts">
const client = useMedusaClient();
const cart = useMedusaCart(client);
cart.initOrUpdateCart();

const addItemToCart = (variant_id: string) => {
  cart.addItem(variant_id, 1).then(() => {
    cart.logCartContents();
  });
};

const removeItemToCart = (variant_id: string) => {
  cart.removeItem(variant_id, 1).then(() => {
    cart.logCartContents();
  });
};
</script>
