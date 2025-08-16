<template>
  <div>
    <MoleculesThankYou type="order" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { OrderStrapiService } from "~/service/Strapi/OrderService";
const route = useRoute();
const config = useRuntimeConfig();

onMounted(async () => {
  const orderId = route.query.orderId as string | undefined;

  if (!orderId) return;
  const orderService = new OrderStrapiService(
    config.public.STRAPI_BASE_URL,
    config.public.FULL_ACCESS_TOKEN
  );

  orderService.updateItem(orderId, {
    paid: true,
  });
});
</script>
