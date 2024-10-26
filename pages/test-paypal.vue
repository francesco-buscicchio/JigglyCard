<template>
  <button @click="pay" class="m-4 p-4 bg-violet-700 text-white">
    TESTA PAYPAL
  </button>
</template>

<script lang="ts" setup>
const pending = ref(false);

const pay = async () => {
  pending.value = true;

  const response = await $fetch<{ url: string }>("/api/create-order", {
    method: "POST",
    body: {
      product_name: "Nuxt Course",
      price: 50,
      payment_method: "paypal",
    },
  });

  pending.value = false;

  if (response.url) {
    window.location.href = response.url;
  } else {
    alert("Something went wrong");
  }
};
</script>
