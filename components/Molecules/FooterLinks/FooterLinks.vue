<template>
  <div class="flex flex-col gap-7 lg:items-center p-6">
    <div v-for="link of links">
      <AtomsLink :to="link.route" class="footer-link">
        {{ $t(`footerLinks.${link.link}`) }}</AtomsLink
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import type { LinkRoute } from "~/interface/linkRoute.interface";

const props = defineProps({
  links: {
    type: Array as PropType<LinkRoute[]>,
    required: true,
  },
});
</script>

<style scoped>
.footer-link {
  font-size: 16px;
  font-family: "Roboto Flex", sans-serif;
}

@media (min-width: 1024px) {
  .footer-link {
    font-size: 18px;
  }
}
</style>
