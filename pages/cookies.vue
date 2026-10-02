<template>
  <div class="legal">
    <header class="im-container legal__hero">
      <p class="im-eyebrow">
        <span class="legal__pulse" aria-hidden="true"></span>
        Informativa
      </p>
      <h1 class="im-display legal__title">
        Cookie <span class="im-gradient-text">Policy</span>
      </h1>
      <p class="im-lead legal__lead">
        Quali Strumenti di Tracciamento usa questa Applicazione e come gestire
        le proprie preferenze.
      </p>
    </header>

    <div class="im-container">
      <div class="legal__doc">
        <section class="legal__card">
          <h2 class="legal__heading">
            <span class="legal__num">01</span>
            Introduzione
          </h2>
          <div class="legal__prose">
            <p>
              Questo documento contiene informazioni in merito alle tecnologie che
              consentono a questa Applicazione di raggiungere gli scopi descritti di
              seguito. Tali tecnologie permettono al Titolare di raccogliere e salvare
              informazioni (per esempio tramite l’utilizzo di Cookie) o di utilizzare
              risorse (per esempio eseguendo uno script) sul dispositivo dell’Utente
              quando quest’ultimo interagisce con questa Applicazione.
            </p>
            <p>
              Per semplicità, in questo documento tali tecnologie sono sinteticamente
              definite “Strumenti di Tracciamento”, salvo vi sia ragione di
              differenziare.
            </p>
            <p>
              Alcune delle finalità per le quali vengono impiegati Strumenti di
              Tracciamento potrebbero, inoltre richiedere il consenso dell’Utente. Se
              viene prestato il consenso, esso può essere revocato liberamente in
              qualsiasi momento seguendo le istruzioni contenute in questo documento.
            </p>
            <p>
              Questa Applicazione utilizza solo Strumenti di Tracciamento gestiti
              direttamente dal Titolare (comunemente detti Strumenti di Tracciamento “di
              prima parte”).
            </p>
          </div>
        </section>

        <section class="legal__owner">
          <span class="legal__owner-icon" aria-hidden="true">
            <Icon name="heroicons:building-storefront-20-solid" size="22" />
          </span>
          <div>
            <h2 class="legal__owner-title">Titolare del Trattamento dei Dati</h2>
            <p class="legal__owner-text">
              Jigglycard di Francesco Buscicchio - Via Principe Amedeo 94, Taranto<br />
              Indirizzo email del Titolare: jigglycard@gmail.com
            </p>
          </div>
        </section>

        <section v-reveal class="legal__card">
          <h2 class="legal__heading">
            <span class="legal__num">02</span>
            Come questa Applicazione utilizza gli Strumenti di Tracciamento
          </h2>
          <div class="legal__prose">
            <h3>Necessari</h3>
            <p>
              Questa Applicazione utilizza Cookie comunemente detti “tecnici” o altri
              Strumenti di Tracciamento analoghi per svolgere attività strettamente
              necessarie a garantire il funzionamento o la fornitura del Servizio.
            </p>
          </div>
        </section>

        <section v-reveal class="legal__card">
          <h2 class="legal__heading">
            <span class="legal__num">03</span>
            Come gestire le preferenze e prestare o revocare il consenso su questa
            Applicazione
          </h2>
          <div class="legal__prose">
            <p>
              Qualora l’utilizzo dei Tracker sia basato sul consenso, l’Utente può
              fornire o revocare tale consenso impostando o aggiornando le proprie
              preferenze tramite il relativo pannello delle scelte in materia di privacy
              disponibile su questa Applicazione.
            </p>
          </div>
        </section>

        <section v-reveal class="legal__card">
          <h2 class="legal__heading">
            <span class="legal__num">04</span>
            Come controllare o eliminare Cookie e tecnologie simili tramite le
            impostazioni del tuo dispositivo
          </h2>
          <div class="legal__prose">
            <p>
              Gli Utenti possono utilizzare le impostazioni del proprio browser per:
            </p>
            <ul>
              <li>
                Vedere quali Cookie o altre tecnologie simili sono stati impostati sul
                dispositivo;
              </li>
              <li>Bloccare Cookie o tecnologie simili;</li>
              <li>Cancellare i Cookie o tecnologie simili dal browser.</li>
            </ul>
            <p>
              Le impostazioni del browser, tuttavia, non consentono un controllo
              granulare del consenso per categoria.
            </p>
            <p>
              Gli Utenti possono, per esempio, trovare informazioni su come gestire i
              Cookie in alcuni dei browser più diffusi ai seguenti indirizzi:
            </p>
          </div>
          <!-- I browser come pillole cliccabili invece di un elenco di link. -->
          <ul class="legal__browsers">
            <li v-for="browser in browsers" :key="browser.label">
              <a :href="browser.href" class="legal__browser">
                {{ browser.label }}
                <Icon name="heroicons:arrow-up-right-20-solid" size="16" />
              </a>
            </li>
          </ul>
          <div class="legal__prose legal__prose--after">
            <p>
              Gli Utenti possono inoltre gestire alcuni Strumenti di Tracciamento per
              applicazioni mobili disattivandoli tramite le apposite impostazioni del
              dispositivo, quali le impostazioni di pubblicità per dispositivi mobili o
              le impostazioni relative al tracciamento in generale (gli Utenti possono
              consultare le impostazioni del dispositivo per individuare quella
              pertinente).
            </p>
          </div>
        </section>

        <section v-reveal class="legal__card">
          <h2 class="legal__heading">
            <span class="legal__num">05</span>
            Conseguenze legate al rifiuto dell'utilizzo di Strumenti di Tracciamento
          </h2>
          <div class="legal__prose">
            <p>
              Gli Utenti sono liberi di decidere se permettere o meno l'utilizzo di
              Strumenti di Tracciamento. Tuttavia, si noti che gli Strumenti di
              Tracciamento consentono a questa Applicazione di fornire agli Utenti
              un'esperienza migliore e funzionalità avanzate (in linea con le finalità
              delineate nel presente documento). Pertanto, qualora l'Utente decida di
              bloccare l'utilizzo di Strumenti di Tracciamento, il Titolare potrebbe non
              essere in grado di fornire le relative funzionalità.
            </p>
          </div>
        </section>

        <section v-reveal class="legal__card">
          <h2 class="legal__heading">
            <span class="legal__num">06</span>
            Definizioni e riferimenti legali
          </h2>
          <dl class="legal__defs">
            <div v-for="item in definitions" :key="item.term" class="legal__def">
              <dt>{{ item.term }}</dt>
              <dd>{{ item.description }}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Elenchi lunghi in dati, così il markup resta leggibile; i testi sono
// quelli dell'informativa, invariati.
const browsers = [
  {
    label: "Google Chrome",
    href: "https://support.google.com/chrome/answer/95647?hl=it",
  },
  {
    label: "Mozilla Firefox",
    href: "https://support.mozilla.org/it/kb/Gestione%20dei%20cookie",
  },
  {
    label: "Apple Safari",
    href: "https://support.apple.com/it-it/guide/safari/sfri11471/mac",
  },
  {
    label: "Microsoft Internet Explorer",
    href: "https://support.microsoft.com/it-it/help/17442/windows-internet-explorer-delete-manage-cookies",
  },
  {
    label: "Microsoft Edge",
    href: "https://support.microsoft.com/it-it/edge",
  },
  {
    label: "Brave",
    href: "https://support.brave.com/hc/it/articles/360018519412-Cookie",
  },
  {
    label: "Opera",
    href: "https://help.opera.com/it/latest/web-preferences/#cookies",
  },
];

const definitions = [
  {
    term: "Dati Personali (o Dati)",
    description:
      "Costituisce dato personale qualunque informazione che, direttamente o indirettamente, anche in collegamento con qualsiasi altra informazione, ivi compreso un numero di identificazione personale, renda identificata o identificabile una persona fisica.",
  },
  {
    term: "Dati di Utilizzo",
    description:
      "Sono le informazioni raccolte automaticamente attraverso questa Applicazione (anche da applicazioni di parti terze integrate in questa Applicazione), tra cui: gli indirizzi IP o i nomi a dominio dei computer utilizzati dall’Utente che si connette con questa Applicazione, gli indirizzi in notazione URI (Uniform Resource Identifier), l’orario della richiesta, il metodo utilizzato nell’inoltrare la richiesta al server, la dimensione del file ottenuto in risposta, il codice numerico indicante lo stato della risposta dal server (buon fine, errore, ecc.) il paese di provenienza, le caratteristiche del browser e del sistema operativo utilizzati dal visitatore, le varie connotazioni temporali della visita (ad esempio il tempo di permanenza su ciascuna pagina) e i dettagli relativi all’itinerario seguito all’interno dell’Applicazione, con particolare riferimento alla sequenza delle pagine consultate, ai parametri relativi al sistema operativo e all’ambiente informatico dell’Utente.",
  },
  {
    term: "Utente",
    description:
      "L'individuo che utilizza questa Applicazione che, salvo ove diversamente specificato, coincide con l'Interessato.",
  },
  {
    term: "Interessato",
    description: "La persona fisica cui si riferiscono i Dati Personali.",
  },
  {
    term: "Responsabile del Trattamento (o Responsabile)",
    description:
      "La persona fisica, giuridica, la pubblica amministrazione e qualsiasi altro ente che tratta dati personali per conto del Titolare, secondo quanto esposto nella presente privacy policy.",
  },
  {
    term: "Titolare del Trattamento (o Titolare)",
    description:
      "La persona fisica o giuridica, l'autorità pubblica, il servizio o altro organismo che, singolarmente o insieme ad altri, determina le finalità e i mezzi del trattamento di dati personali e gli strumenti adottati, ivi comprese le misure di sicurezza relative al funzionamento ed alla fruizione di questa Applicazione. Il Titolare del Trattamento, salvo quanto diversamente specificato, è il titolare di questa Applicazione.",
  },
  {
    term: "Questa Applicazione",
    description:
      "Lo strumento hardware o software mediante il quale sono raccolti e trattati i Dati Personali degli Utenti.",
  },
  {
    term: "Servizio",
    description:
      "Il Servizio fornito da questa Applicazione così come definito nei relativi termini (se presenti) su questo sito/applicazione.",
  },
  {
    term: "Unione Europea (o UE)",
    description:
      "Salvo ove diversamente specificato, ogni riferimento all’Unione Europea contenuto in questo documento si intende esteso a tutti gli attuali stati membri dell’Unione Europea e dello Spazio Economico Europeo.",
  },
  {
    term: "Riferimenti legali",
    description:
      "Ove non diversamente specificato, questa informativa privacy riguarda esclusivamente questa Applicazione.",
  },
];
</script>

<style scoped>
.legal {
  padding-bottom: 96px;
}

/* ---------- Testata ---------- */
.legal__hero {
  padding-top: 48px;
  padding-bottom: 32px;
}

@media (min-width: 1024px) {
  .legal__hero {
    padding-top: 72px;
    padding-bottom: 48px;
  }
}

.legal__pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--im-teal);
  box-shadow: 0 0 0 4px rgba(92, 200, 224, 0.18);
}

.legal__title {
  margin-top: 14px;
  font-size: clamp(36px, 7vw, 76px);
  overflow-wrap: break-word;
}

.legal__title span {
  font-family: inherit;
}

.legal__lead {
  max-width: 60ch;
  margin-top: 18px;
}

/* ---------- Documento ---------- */
/* Colonna di lettura: righe sotto i 70 caratteri, sezioni in vetro. */
.legal__doc {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 920px;
}

.legal__owner {
  display: flex;
  gap: 16px;
  padding: 24px 20px;
  border-radius: 24px;
  border: 1px solid rgba(92, 200, 224, 0.28);
  background:
    radial-gradient(80% 140% at 100% 0%, rgba(92, 200, 224, 0.16), transparent 60%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
}

@media (min-width: 768px) {
  .legal__owner {
    padding: 28px 32px;
  }
}

.legal__owner-icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  color: #2a0a14;
  background: linear-gradient(135deg, #fde4e8, var(--im-pink-strong));
}

.legal__owner-title {
  margin-bottom: 8px;
  font-size: 19px;
  line-height: 1.25;
  color: var(--im-ink);
}

.legal__owner-text {
  line-height: 1.7;
  color: var(--im-muted);
  overflow-wrap: anywhere;
}

.legal__card {
  padding: 24px 20px;
  border-radius: 24px;
  border: 1px solid var(--im-line);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02));
}

@media (min-width: 768px) {
  .legal__card {
    padding: 32px;
  }
}

.legal__heading {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 18px;
  font-size: 19px;
  line-height: 1.3;
  color: var(--im-ink);
}

@media (min-width: 1024px) {
  .legal__heading {
    font-size: 22px;
  }
}

/* Su mobile il numero sta sopra al titolo: accanto gli toglieva mezza riga
   e i titoli lunghi andavano a capo una parola alla volta. */
@media (max-width: 639px) {
  .legal__heading {
    flex-direction: column;
    gap: 10px;
  }
}

.legal__num {
  display: inline-grid;
  flex: none;
  place-items: center;
  min-width: 44px;
  height: 30px;
  margin-top: -2px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid rgba(247, 210, 216, 0.4);
  background: rgba(247, 210, 216, 0.08);
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--im-pink);
}

/* Tipografia del testo legale: paragrafi ariosi, sottotitoli con un filo
   sfumato, elenchi con il rombo del brand. */
.legal__prose {
  max-width: 70ch;
}

.legal__prose--after {
  margin-top: 18px;
}

.legal__prose p {
  line-height: 1.75;
  color: var(--im-muted);
}

.legal__prose p + p {
  margin-top: 14px;
}

.legal__prose h3 {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--im-ink);
}

.legal__prose ul {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 14px 0;
}

/* Stessa misura dei paragrafi (che la prendono dal CSS di base). */
.legal__prose li {
  position: relative;
  padding-left: 24px;
  font-size: 16px;
  line-height: 1.7;
  color: var(--im-muted);
}

@media (min-width: 1024px) {
  .legal__prose li {
    font-size: 18px;
  }
}

.legal__prose li::before {
  content: "";
  position: absolute;
  top: 0.68em;
  left: 4px;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: linear-gradient(135deg, var(--im-pink), var(--im-teal));
  transform: rotate(45deg);
}

.legal__browsers {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.legal__browser {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.04);
  font-size: 14px;
  font-weight: 600;
  color: var(--im-ink);
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.legal__browser,
.legal__browser * {
  cursor: pointer;
}

.legal__browser:hover {
  border-color: rgba(247, 210, 216, 0.5);
  background: rgba(247, 210, 216, 0.1);
  color: var(--im-pink);
  transform: translateY(-1px);
}

.legal__browser:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
}

.legal__defs {
  display: grid;
  gap: 10px;
}

@media (min-width: 768px) {
  .legal__defs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.legal__def {
  padding: 16px;
  border-radius: 16px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.03);
}

.legal__def dt {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 12px;
  line-height: 1.5;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--im-pink);
}

.legal__def dd {
  margin-top: 6px;
  font-size: 15px;
  line-height: 1.6;
  color: var(--im-muted);
}

@media (prefers-reduced-motion: reduce) {
  .legal__browser {
    transition: none;
  }

  .legal__browser:hover {
    transform: none;
  }
}
</style>
