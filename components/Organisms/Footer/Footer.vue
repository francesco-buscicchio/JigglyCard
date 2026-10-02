<template>
  <div class="site-footer" :class="{ 'site-footer--no-payments': hidePayments }">
    <div class="im-container">
      <!-- Desktop: marchio, link, pagamenti in tre colonne; sotto i 768px
           tutto impilato. -->
      <div class="site-footer__grid">
        <div class="site-footer__brand">
          <NuxtLink to="/" class="site-footer__logo">
            <img :src="logoNew" alt="" class="site-footer__logo-img" width="48" height="40" />
            <span class="site-footer__wordmark">{{ $t("brand.name") }}</span>
          </NuxtLink>
          <!-- Il motto della hero in home, come firma del negozio. -->
          <p class="site-footer__tagline">
            {{ $t("home.immersive.hero.titleLine1") }}
            {{ $t("home.immersive.hero.titleLine2") }}
          </p>
          <p
            v-if="showInformationSite && config.public.ADMIN_MAIL"
            class="site-footer__mail"
          >
            <Icon name="heroicons:envelope-20-solid" size="16" aria-hidden="true" />
            {{ config.public.ADMIN_MAIL }}
          </p>
          <MoleculesSocialLinks />
        </div>

        <MoleculesFooterLinks :links="FOOTER_MENU_ITEMS" class="site-footer__links" />

        <MoleculesPaymentMethods v-if="!hidePayments" class="site-footer__payments" />
      </div>

      <div class="site-footer__bottom">
        <p class="site-footer__copyright">© {{ year }} {{ $t("brand.name") }}</p>
        <ul v-if="policyLinks?.length" class="site-footer__policies">
          <li v-for="(policy, index) in policyLinks" :key="index">
            <a :href="policy.link" class="site-footer__policy">{{ policy.label }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.site-footer {
  position: relative;
  padding: 56px 0 28px;
  background:
    radial-gradient(60% 80% at 50% 0%, rgba(236, 145, 160, 0.1), transparent 70%),
    #05071a;
  color: var(--im-muted);
}

@media (min-width: 1024px) {
  .site-footer {
    padding: 80px 0 32px;
  }
}

/* Filo di luce al posto del vecchio bordo grigio. */
.site-footer::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(247, 210, 216, 0.45) 30%,
    rgba(92, 200, 224, 0.45) 70%,
    transparent
  );
}

.site-footer__grid {
  display: grid;
  gap: 40px;
}

@media (min-width: 768px) {
  .site-footer__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 48px 40px;
  }

  .site-footer__brand {
    grid-column: 1 / -1;
  }
}

@media (min-width: 1024px) {
  .site-footer__grid {
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.9fr) minmax(0, 1.2fr);
    gap: 56px;
  }

  .site-footer--no-payments .site-footer__grid {
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  }

  .site-footer__brand {
    grid-column: auto;
  }
}

.site-footer__brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

.site-footer__logo {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  border-radius: 14px;
  cursor: pointer;
}

.site-footer__logo:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 4px;
}

.site-footer__logo-img {
  width: 48px;
  height: 40px;
  object-fit: contain;
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.site-footer__logo:hover .site-footer__logo-img {
  transform: rotate(-8deg) scale(1.06);
}

.site-footer__wordmark {
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-weight: 800;
  font-size: 24px;
  letter-spacing: -0.02em;
  color: var(--im-ink);
  cursor: inherit;
}

.site-footer__tagline {
  max-width: 320px;
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-weight: 500;
  font-size: 15px;
  line-height: 1.5;
  color: var(--im-muted);
}

.site-footer__mail {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--im-ink);
}

.site-footer__bottom {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 48px;
  padding-top: 24px;
}

@media (min-width: 768px) {
  .site-footer__bottom {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 64px;
  }
}

.site-footer__bottom::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.03));
}

.site-footer__copyright {
  font-size: 13px;
  line-height: 1.5;
  color: var(--im-muted);
}

.site-footer__policies {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 20px;
}

.site-footer__policy {
  display: inline-block;
  padding: 4px 0;
  font-size: 13px;
  color: var(--im-muted);
  transition: color 0.2s ease;
}

/* Le etichette arrivano minuscole ("privacy", "termini di utilizzo"). */
.site-footer__policy::first-letter {
  text-transform: uppercase;
}

.site-footer__policy:hover {
  color: var(--im-pink);
}

.site-footer__policy:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
  border-radius: 4px;
}

@media (prefers-reduced-motion: reduce) {
  .site-footer__logo-img {
    transition: none;
  }

  .site-footer__logo:hover .site-footer__logo-img {
    transform: none;
  }
}
</style>

<script setup lang="ts">
import { FOOTER_MENU_ITEMS } from "~/data/const";
import logoNew from "~/assets/logo/logo_new.png";

const config = useRuntimeConfig();
const year = new Date().getFullYear();
const props = defineProps({
  policyLinks: {
    type: Array as PropType<Array<{ label: string; link: string }>>,
  },
  hidePayments: {
    type: Boolean,
    default: false,
  },
  showInformationSite: {
    type: Boolean,
    default: false,
  },
});
</script>
