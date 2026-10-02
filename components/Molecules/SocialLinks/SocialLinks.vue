<template>
  <ul class="socials">
    <!-- Link veri (con href) invece di div cliccabili: si raggiungono da
         tastiera; il click resta gestito da iconSocialPressed come prima. -->
    <template v-if="Array.isArray(footerData.imgs)">
      <li v-for="(img, index) in footerData.imgs" :key="index">
        <a
          :href="img.url"
          target="_blank"
          rel="noopener noreferrer"
          class="socials__link"
          :aria-label="socialName(img.url)"
          @click.prevent="iconSocialPressed(img.url)"
        >
          <img :src="img.img" alt="" class="socials__icon" />
        </a>
      </li>
    </template>
    <li v-else-if="footerData.imgs">
      <a
        :href="footerData.imgs.url"
        target="_blank"
        rel="noopener noreferrer"
        class="socials__link"
        :aria-label="socialName(footerData.imgs.url)"
        @click.prevent="iconSocialPressed(footerData.imgs?.url ?? '')"
      >
        <img :src="footerData.imgs.img" alt="" class="socials__icon" />
      </a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { SocialLinks } from "~/types/socialLink.type";
import { footerData } from "~/data/footer";

const iconSocialPressed = (url: string) => {
  navigateTo(url, {
    external: true,
    open: {
      target: "_blank",
    },
  });
};

// Nome leggibile del social per i lettori di schermo, preso dal dominio
// ("instagram.com" → "Instagram"): le icone da sole non hanno testo.
const socialName = (url: string) => {
  try {
    const name = new URL(url).hostname.replace(/^www\./, "").split(".")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    return "Social";
  }
};
</script>

<style scoped>
.socials {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* Icone in bottoni rotondi di vetro, che si accendono di rosa al passaggio. */
.socials__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    background-color 0.25s ease,
    box-shadow 0.25s ease;
}

.socials__link:hover {
  transform: translateY(-2px);
  border-color: rgba(247, 210, 216, 0.5);
  background: rgba(247, 210, 216, 0.12);
  box-shadow: 0 12px 28px -14px rgba(236, 145, 160, 0.9);
}

.socials__link:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 3px;
}

/* Le icone sono scure: invertite diventano bianche sul fondo notte. */
.socials__icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
  filter: invert(1);
  cursor: inherit;
}

@media (prefers-reduced-motion: reduce) {
  .socials__link {
    transition: none;
  }

  .socials__link:hover {
    transform: none;
  }
}
</style>
