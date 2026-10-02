<template>
  <div class="welcome" v-if="!mailSended">
    <div class="welcome__bar sticky-top">
      <div class="im-container welcome__bar-inner">
        <img :src="logo" alt="" class="welcome__logo" />
        <h1 class="welcome__brand">{{ t("brand.name") }}</h1>
      </div>
    </div>

    <div class="im-container welcome__main">
      <OrganismsStaticNewsLetter
        class="welcome__news"
        @mailSended="
          () => {
            mailSended = true;
          }
        "
      />
      <div class="welcome__art">
        <div class="welcome__frame">
          <img
            :src="Mainimg"
            alt="Team Rocket Jigglypuff"
            class="welcome__img"
          />
        </div>
      </div>
    </div>

    <OrganismsFooter
      :footer="footerData"
      :policyLinks="policyLinks"
      :hidePayments="true"
      :showInformationSite="true"
      class="mt-auto"
    />
  </div>
  <div v-else class="welcome-thanks">
    <div class="welcome-thanks__card">
      <MoleculesThankYou type="newsletter" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import facebookLogo from "~/assets/icons/facebook.svg";
import instagramLogo from "~/assets/icons/instagram.svg";
import youtubeLogo from "~/assets/icons/youtube.svg";
import tiktokLogo from "~/assets/icons/tiktok.png";
import WelcomeHero from "~/assets/img/welcomeHero.jpeg";
import logo from "~/assets/logo/logo_new.png";

const Mainimg: string = WelcomeHero;
const mailSended = ref(false);

const { t } = useI18n();

definePageMeta({
  layout: false,
});

const footerData = {
  imgs: [
    {
      img: instagramLogo,
      url: "https://www.instagram.com/jigglycard/",
    },
    {
      img: tiktokLogo,
      url: "https://www.tiktok.com/@jigglycard",
    },
    {
      img: facebookLogo,
      url: "#",
    },
    {
      img: youtubeLogo,
      url: "#",
    },
  ],
};

const policyLinks = [
  { label: t("common.links.privacy"), link: "/privacy-policy" },
  { label: t("common.links.cookies"), link: "/cookies" },
  { label: t("common.links.terms"), link: "/terms-of-use" },
];
</script>

<style scoped>
.welcome {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background:
    radial-gradient(60% 50% at 85% 10%, rgba(236, 145, 160, 0.16), transparent 70%),
    radial-gradient(50% 40% at 0% 60%, rgba(92, 200, 224, 0.1), transparent 70%);
}

/* Barra con il logo: la pagina non ha l'header del sito (layout: false). */
.welcome__bar {
  border-bottom: 1px solid var(--im-line);
  background: rgba(7, 10, 31, 0.82);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.welcome__bar-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding-block: 14px;
}

.welcome__logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: drop-shadow(0 6px 16px rgba(236, 145, 160, 0.45));
}

.welcome__brand {
  font-size: 26px;
  line-height: 1;
  color: var(--im-ink);
}

.welcome__main {
  display: grid;
  gap: 28px;
  align-items: center;
  padding-block: 32px 64px;
}

@media (min-width: 1024px) {
  .welcome__main {
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    gap: 56px;
    min-height: 60vh;
    padding-block: 72px 96px;
  }
}

/* Su mobile prima l'immagine, come prima; su desktop il modulo a sinistra. */
.welcome__news {
  order: 2;
  min-width: 0;
}

.welcome__art {
  order: 1;
  min-width: 0;
}

@media (min-width: 1024px) {
  .welcome__news {
    order: 1;
  }

  .welcome__art {
    order: 2;
  }
}

/* Cornice di vetro con alone rosa: l'immagine sembra uno schermo acceso. */
.welcome__frame {
  position: relative;
  padding: 8px;
  border-radius: 28px;
  border: 1px solid var(--im-line);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02));
  box-shadow: 0 40px 80px -40px rgba(236, 145, 160, 0.55);
  transition: transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.welcome__frame:hover {
  transform: translateY(-4px) rotate(-0.4deg);
}

.welcome__img {
  display: block;
  width: 100%;
  height: auto;
  max-height: 70vh;
  border-radius: 20px;
  object-fit: cover;
}

.welcome-thanks {
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 24px 16px;
}

.welcome-thanks__card {
  width: 100%;
  max-width: 560px;
  border-radius: 28px;
  border: 1px solid var(--im-line);
  background:
    radial-gradient(70% 50% at 50% 0%, rgba(236, 145, 160, 0.16), transparent 70%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.02));
}

.welcome-thanks__card :deep(img) {
  max-width: 100%;
}

@media (prefers-reduced-motion: reduce) {
  .welcome__frame {
    transition: none;
  }

  .welcome__frame:hover {
    transform: none;
  }
}
</style>
