<template>
  <!-- Il banner lo inietta lo script di iubenda: qui solo la sua configurazione
       e, più sotto, lo stile notturno. -->
</template>

<script setup>
import { onMounted } from "vue";

/*
 * Banner cookie di iubenda e caricamento di Google Analytics.
 *
 * iubenda si carica sempre, anche quando una scelta è già salvata: così il
 * pannello delle preferenze resta disponibile (link "Preferenze cookie" nel
 * footer) e la scelta si può cambiare in qualsiasi momento.
 *
 * Google Analytics è in modalità manuale (nuxt.config.ts, gtag.initMode):
 * lo script parte solo da qui, quando iubenda conferma il consenso alle
 * statistiche. Senza consenso non viene mai caricato.
 */
const nuxtApp = useNuxtApp();
const { gtag, initialize } = useGtag();
let analyticsStarted = false;

// Con il consenso per finalità iubenda riporta `purposes` (4 = misurazione);
// con il consenso semplice solo `consent`.
const hasStatisticsConsent = (preference) =>
  preference?.purposes ? preference.purposes[4] === true : preference?.consent === true;

const applyPreference = (preference) => {
  if (hasStatisticsConsent(preference)) {
    gtag("consent", "update", { analytics_storage: "granted" });
    if (!analyticsStarted) {
      analyticsStarted = true;
      // Il callback arriva fuori dal setup: initialize() usa useHead e ha
      // bisogno del contesto dell'app.
      nuxtApp.runWithContext(() => initialize());
    }
  } else {
    gtag("consent", "update", { analytics_storage: "denied" });
  }
};

onMounted(() => {
  window._iub = window._iub || [];
  window._iub.csConfiguration = {
    siteId: 4175415,
    cookiePolicyId: 94013012,
    cookiePolicyUrl: `${window.location.origin}/cookies`,
    lang: "it",
    storage: { type: "local_storage", useSiteId: true },
    // Rifiutare dev'essere facile quanto accettare (Garante, 10/6/2021): il
    // bottone "Rifiuta" accanto ad "Accetta", e la X vale come rifiuto.
    banner: {
      acceptButtonDisplay: true,
      rejectButtonDisplay: true,
      customizeButtonDisplay: true,
      closeButtonRejects: true,
    },
    callback: {
      onPreferenceExpressedOrNotNeeded: applyPreference,
      onPreferenceExpressed: applyPreference,
    },
  };

  const iubScript = document.createElement("script");
  iubScript.type = "text/javascript";
  iubScript.src = "//cdn.iubenda.com/cs/iubenda_cs.js";
  iubScript.charset = "UTF-8";
  iubScript.async = true;
  document.body.appendChild(iubScript);
});
</script>

<style>
/*
 * Banner dei cookie di iubenda. Lo inietta il loro script, con un CSS proprio
 * pieno di `!important`: qui lo si porta sul tema notturno (vetro scuro,
 * testo chiaro, bottoni a pillola come nel resto del sito). L'ID ripetuto
 * alza la specificità sopra quella delle loro regole.
 *
 * Solo colori e forme: posizione, testi e bottoni mostrati restano quelli
 * configurati su iubenda. "Accetta" e "Rifiuta" hanno lo stesso peso visivo,
 * come chiede il Garante.
 */
#iubenda-cs-banner#iubenda-cs-banner {
  font-family: "Roboto Flex", sans-serif !important;
}

#iubenda-cs-banner#iubenda-cs-banner .iubenda-cs-content {
  color: var(--im-ink) !important;
  background:
    radial-gradient(80% 140% at 100% 0%, rgba(92, 200, 224, 0.16), transparent 60%),
    radial-gradient(80% 140% at 0% 100%, rgba(236, 145, 160, 0.18), transparent 60%),
    rgba(14, 18, 56, 0.96) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 24px !important;
  box-shadow: 0 30px 80px -24px rgba(0, 0, 0, 0.85) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

#iubenda-cs-banner#iubenda-cs-banner #iubenda-cs-title {
  font-family: "Unbounded", "Roboto Flex", sans-serif !important;
  font-weight: 700 !important;
  letter-spacing: -0.01em !important;
  color: var(--im-ink) !important;
}

#iubenda-cs-banner#iubenda-cs-banner #iubenda-cs-paragraph,
#iubenda-cs-banner#iubenda-cs-banner .iub-p {
  color: rgba(226, 222, 255, 0.82) !important;
}

#iubenda-cs-banner#iubenda-cs-banner .iubenda-cs-content a {
  color: var(--im-pink) !important;
  text-decoration: underline !important;
  text-underline-offset: 3px;
}

#iubenda-cs-banner#iubenda-cs-banner .iubenda-cs-opt-group button {
  min-height: 44px !important;
  padding: 10px 22px !important;
  border-radius: 999px !important;
  font-family: "Roboto Flex", sans-serif !important;
  font-weight: 700 !important;
  letter-spacing: 0.01em !important;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease !important;
}

/* Accetta / Rifiuta: la stessa pillola sfumata dei bottoni primari. */
#iubenda-cs-banner#iubenda-cs-banner .iubenda-cs-opt-group .iubenda-cs-btn-primary {
  color: #2a0a14 !important;
  background: linear-gradient(135deg, #fde4e8 0%, var(--im-pink) 35%, var(--im-pink-strong) 100%) !important;
  border: 0 !important;
  box-shadow:
    0 10px 26px -10px rgba(236, 145, 160, 0.75),
    inset 0 1px 0 rgba(255, 255, 255, 0.6) !important;
}

#iubenda-cs-banner#iubenda-cs-banner .iubenda-cs-opt-group .iubenda-cs-btn-primary:hover {
  transform: translateY(-1px);
}

/* "Personalizza": pillola di vetro, come i bottoni secondari. */
#iubenda-cs-banner#iubenda-cs-banner .iubenda-cs-opt-group .iubenda-cs-customize-btn {
  color: var(--im-ink) !important;
  background: rgba(255, 255, 255, 0.06) !important;
  border: 1px solid rgba(255, 255, 255, 0.24) !important;
}

#iubenda-cs-banner#iubenda-cs-banner .iubenda-cs-opt-group .iubenda-cs-customize-btn:hover {
  border-color: var(--im-pink) !important;
  background: rgba(247, 210, 216, 0.1) !important;
}

#iubenda-cs-banner#iubenda-cs-banner button:focus-visible {
  outline: 2px solid var(--im-teal) !important;
  outline-offset: 3px !important;
}

#iubenda-cs-banner#iubenda-cs-banner .iubenda-cs-close-btn {
  color: var(--im-ink) !important;
  opacity: 0.7;
}

@media (prefers-reduced-motion: reduce) {
  #iubenda-cs-banner#iubenda-cs-banner .iubenda-cs-opt-group button {
    transition: none !important;
  }

  #iubenda-cs-banner#iubenda-cs-banner .iubenda-cs-opt-group .iubenda-cs-btn-primary:hover {
    transform: none;
  }
}
</style>
