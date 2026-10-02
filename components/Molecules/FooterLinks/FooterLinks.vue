<template>
  <ul class="footer-links">
    <li v-for="link of links" :key="link.route">
      <AtomsLink :to="link.route" class="footer-link">
        <span class="footer-link__text">{{ $t(`layout.footer.links.${link.link}`) }}</span>
        <Icon
          name="heroicons:arrow-right-20-solid"
          size="16"
          class="footer-link__arrow"
          aria-hidden="true"
        />
      </AtomsLink>
    </li>
  </ul>
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
/* Selettori doppi: devono superare lo stile di AtomsLink (titolo Unbounded,
   sottolineatura al passaggio, colore "visitato"), pensato per i testi. */
.footer-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.footer-links .footer-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  font-family: "Roboto Flex", sans-serif;
  font-size: 16px;
  line-height: 1.4;
  font-weight: 600;
  color: var(--im-ink);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-links .footer-link:hover {
  color: var(--im-pink);
  text-decoration: none;
}

.footer-links .footer-link:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 3px;
  border-radius: 6px;
}

.footer-link__text {
  color: inherit;
  cursor: pointer;
}

/* La freccia entra scorrendo al passaggio del mouse. */
.footer-link__arrow {
  opacity: 0;
  transform: translateX(-6px);
  transition:
    opacity 0.2s ease,
    transform 0.25s ease;
}

.footer-links .footer-link:hover .footer-link__arrow,
.footer-links .footer-link:focus-visible .footer-link__arrow {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .footer-link__arrow {
    transition: none;
    transform: none;
  }
}
</style>
