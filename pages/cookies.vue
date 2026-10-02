<template>
  <OrganismsLegalPage
    eyebrow="Informativa"
    title="Cookie"
    title-accent="Policy"
    lead="Quali cookie e strumenti simili usa jigglycard.com, a cosa servono e come puoi cambiare le tue scelte."
    owner-title="Titolare del trattamento"
    updated-at="2 ottobre 2026"
  >
    <OrganismsLegalSection num="01" title="Cosa sono">
      <p>
        I cookie sono piccoli file che il sito salva nel browser; strumenti simili, come
        la memoria locale del browser (localStorage e sessionStorage), servono agli
        stessi scopi. Quelli <strong>tecnici</strong> sono necessari al funzionamento del
        sito e non richiedono il consenso; tutti gli altri vengono usati solo se li
        accetti.
      </p>
    </OrganismsLegalSection>

    <OrganismsLegalSection num="02" title="Strumenti tecnici (sempre attivi)">
      <div class="legal__table-wrap">
        <table class="legal__table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Fornitore</th>
              <th>Finalità</th>
              <th>Durata</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in technical" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.provider }}</td>
              <td>{{ item.purpose }}</td>
              <td>{{ item.duration }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </OrganismsLegalSection>

    <OrganismsLegalSection num="03" title="Statistiche (solo con il tuo consenso)">
      <p>
        Se acconsenti alle statistiche, usiamo <strong>Google Analytics</strong> (Google
        Ireland Ltd.) per capire come viene usato il sito, in forma aggregata. Lo script
        di Google viene caricato <strong>solo dopo</strong> il tuo consenso: se rifiuti o
        chiudi il banner, non viene caricato.
      </p>
      <div class="legal__table-wrap">
        <table class="legal__table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Fornitore</th>
              <th>Finalità</th>
              <th>Durata</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>_ga, _ga_*</td>
              <td>Google</td>
              <td>Distinguere i visitatori e le sessioni per le statistiche</td>
              <td>Fino a 2 anni</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Informativa di Google:
        <a href="https://policies.google.com/privacy?hl=it" target="_blank" rel="noopener">policies.google.com/privacy</a>.
      </p>
    </OrganismsLegalSection>

    <OrganismsLegalSection num="04" title="Contenuti di terze parti">
      <ul>
        <li>
          <strong>Koalendar</strong> — il calendario per prenotare la valutazione di una
          collezione, nella pagina
          <NuxtLink to="/valuta-la-tua-collezione">Valuta la tua collezione</NuxtLink>, è
          fornito da Koalendar, che può usare propri cookie tecnici per farlo funzionare.
        </li>
        <li>
          <strong>Immagini delle carte</strong> — alcune immagini sono caricate dai server
          di CardTrader e di GitHub (PokeAPI). Questi servizi ricevono l'indirizzo IP
          del browser, come avviene per qualsiasi immagine, ma il sito non vi installa
          cookie.
        </li>
      </ul>
    </OrganismsLegalSection>

    <OrganismsLegalSection id="preferenze" num="05" title="Come cambiare le tue scelte">
      <p>
        Puoi modificare o revocare il consenso in qualsiasi momento dal pannello delle
        preferenze, raggiungibile anche dal link "Preferenze cookie" in fondo a ogni
        pagina.
      </p>
      <button type="button" class="legal__button" @click="openPreferences">
        <Icon name="heroicons:adjustments-horizontal-20-solid" size="18" />
        Modifica le preferenze cookie
      </button>
      <p>
        Puoi anche cancellare o bloccare i cookie dalle impostazioni del browser; in quel
        caso alcune funzioni, come il carrello, potrebbero non funzionare:
      </p>
      <ul>
        <li v-for="browser in browsers" :key="browser.label">
          <a :href="browser.href" target="_blank" rel="noopener">{{ browser.label }}</a>
        </li>
      </ul>
      <p>
        Per tutto il resto sul trattamento dei dati vedi la
        <NuxtLink to="/privacy-policy">Privacy Policy</NuxtLink>.
      </p>
    </OrganismsLegalSection>
  </OrganismsLegalPage>
</template>

<script setup lang="ts">
const { openPreferences } = useCookiePreferences();

useHead({
  title: "Cookie Policy | Jigglycard",
  meta: [
    {
      name: "description",
      content:
        "Cookie e strumenti simili usati da Jigglycard: tecnici, statistici con consenso e di terze parti. Come modificare le preferenze.",
    },
  ],
});

const technical = [
  {
    name: "jigglycard_cart",
    provider: "Jigglycard (localStorage)",
    purpose: "Ricordare i prodotti aggiunti al carrello",
    duration: "Fino allo svuotamento del carrello",
  },
  {
    name: "jigglycard_recently_viewed",
    provider: "Jigglycard (localStorage)",
    purpose: "Mostrarti le carte che hai guardato di recente (resta sul tuo dispositivo)",
    duration: "Persistente",
  },
  {
    name: "jigglycard_pending_order",
    provider: "Jigglycard (sessionStorage)",
    purpose: "Collegare il pagamento all'ordine al ritorno da Stripe",
    duration: "Fino alla chiusura della scheda",
  },
  {
    name: "jigglycard-color-mode",
    provider: "Jigglycard (localStorage)",
    purpose: "Ricordare il tema grafico",
    duration: "Persistente",
  },
  {
    name: "_iub_cs-*",
    provider: "iubenda",
    purpose: "Registrare le tue scelte sui cookie",
    duration: "12 mesi",
  },
  {
    name: "__stripe_mid, __stripe_sid",
    provider: "Stripe",
    purpose: "Sicurezza dei pagamenti e prevenzione delle frodi",
    duration: "1 anno / 30 minuti",
  },
];

const browsers = [
  { label: "Google Chrome", href: "https://support.google.com/chrome/answer/95647?hl=it" },
  { label: "Mozilla Firefox", href: "https://support.mozilla.org/it/kb/Gestione%20dei%20cookie" },
  { label: "Apple Safari", href: "https://support.apple.com/it-it/guide/safari/sfri11471/mac" },
  { label: "Microsoft Edge", href: "https://support.microsoft.com/it-it/edge" },
  { label: "Brave", href: "https://support.brave.com/hc/it/articles/360018519412-Cookie" },
  { label: "Opera", href: "https://help.opera.com/it/latest/web-preferences/#cookies" },
];
</script>
