<template>
  <div class="legal">
    <header class="im-container legal__hero">
      <p class="im-eyebrow">
        <span class="legal__pulse" aria-hidden="true"></span>
        Informativa
      </p>
      <h1 class="im-display legal__title">
        Privacy <span class="im-gradient-text">Policy</span>
      </h1>
      <p class="im-lead legal__lead">
        Quali Dati Personali tratta questa Applicazione, come li tratta e quali
        diritti ha l'Utente.
      </p>
    </header>

    <div class="im-container">
      <div class="legal__doc">
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
            <span class="legal__num">01</span>
            Tipo di Dati che raccogliamo
          </h2>
          <div class="legal__prose">
            <p>
              Il Titolare non fornisce una lista di tipologie di Dati Personali
              raccolti.
            </p>
            <p>
              Dettagli completi su ciascuna tipologia di Dati Personali raccolti sono
              forniti nelle sezioni dedicate di questa privacy policy o mediante
              specifici testi informativi visualizzati prima della raccolta dei Dati
              stessi.
            </p>
            <p>
              I Dati Personali possono essere liberamente forniti dall'Utente o, nel
              caso di Dati di Utilizzo, raccolti automaticamente durante l'uso di questa
              Applicazione.
            </p>
            <p>
              Se non diversamente specificato, tutti i Dati richiesti da questa
              Applicazione sono obbligatori. Se l’Utente rifiuta di comunicarli,
              potrebbe essere impossibile per questa Applicazione fornire il Servizio.
              Nei casi in cui questa Applicazione indichi alcuni Dati come facoltativi,
              gli Utenti sono liberi di astenersi dal comunicare tali Dati, senza che
              ciò abbia alcuna conseguenza sulla disponibilità del Servizio o sulla sua
              operatività.
            </p>
            <p>
              Gli Utenti che dovessero avere dubbi su quali Dati siano obbligatori sono
              incoraggiati a contattare il Titolare.
            </p>
            <p>
              L’eventuale utilizzo di Cookie - o di altri strumenti di tracciamento - da
              parte di questa Applicazione o dei titolari dei servizi terzi utilizzati
              da questa Applicazione ha la finalità di fornire il Servizio richiesto
              dall'Utente, oltre alle ulteriori finalità descritte nel presente
              documento e nella Cookie Policy.
            </p>
            <p>
              L'Utente si assume la responsabilità dei Dati Personali di terzi ottenuti,
              pubblicati o condivisi mediante questa Applicazione.
            </p>
          </div>
        </section>

        <section v-reveal class="legal__card">
          <h2 class="legal__heading">
            <span class="legal__num">02</span>
            Modalità e luogo del trattamento dei Dati raccolti
          </h2>
          <div class="legal__prose">
            <h3>Modalità di trattamento</h3>
            <p>
              Il Titolare adotta le opportune misure di sicurezza volte ad impedire
              l’accesso, la divulgazione, la modifica o la distruzione non autorizzate
              dei Dati Personali.
            </p>
            <p>
              Il trattamento viene effettuato mediante strumenti informatici e/o
              telematici, con modalità organizzative e con logiche strettamente
              correlate alle finalità indicate. Oltre al Titolare, in alcuni casi,
              potrebbero avere accesso ai Dati altri soggetti coinvolti
              nell’organizzazione di questa Applicazione (personale amministrativo,
              commerciale, marketing, legali, amministratori di sistema) ovvero soggetti
              esterni (come fornitori di servizi tecnici terzi, corrieri postali,
              hosting provider, società informatiche, agenzie di comunicazione) nominati
              anche, se necessario, Responsabili del Trattamento da parte del Titolare.
              L’elenco aggiornato dei Responsabili potrà sempre essere richiesto al
              Titolare del Trattamento.
            </p>

            <h3>Luogo</h3>
            <p>
              I Dati sono trattati presso le sedi operative del Titolare ed in ogni
              altro luogo in cui le parti coinvolte nel trattamento siano localizzate.
              Per ulteriori informazioni, contatta il Titolare.
            </p>
            <p>
              I Dati Personali dell’Utente potrebbero essere trasferiti in un paese
              diverso da quello in cui l’Utente si trova. Per ottenere ulteriori
              informazioni sul luogo del trattamento l’Utente può fare riferimento alla
              sezione relativa ai dettagli sul trattamento dei Dati Personali.
            </p>

            <h3>Periodo di conservazione</h3>
            <p>
              Se non diversamente indicato in questo documento, i Dati Personali sono
              trattati e conservati per il tempo richiesto dalla finalità per la quale
              sono stati raccolti e potrebbero essere conservati per un periodo più
              lungo a causa di eventuali obbligazioni legali o sulla base del consenso
              degli Utenti.
            </p>
          </div>
        </section>

        <section v-reveal class="legal__card">
          <h2 class="legal__heading">
            <span class="legal__num">03</span>
            Cookie Policy
          </h2>
          <div class="legal__prose">
            <p>
              Questa Applicazione fa utilizzo di Strumenti di Tracciamento. Per saperne
              di più, gli Utenti possono consultare la
              <NuxtLink to="/cookies">Cookie Policy</NuxtLink>.
            </p>
          </div>
        </section>

        <section v-reveal class="legal__card">
          <h2 class="legal__heading">
            <span class="legal__num">04</span>
            Ulteriori informazioni per gli utenti nell'Unione Europea
          </h2>
          <div class="legal__prose">
            <h3>Base giuridica del trattamento</h3>
            <p>
              Il Titolare tratta Dati Personali relativi all’Utente in caso sussista una
              delle seguenti condizioni:
            </p>
            <ul>
              <li>
                l’Utente ha prestato il consenso per una o più finalità specifiche;
              </li>
              <li>
                il trattamento è necessario all'esecuzione di un contratto con l’Utente
                e/o all'esecuzione di misure precontrattuali;
              </li>
              <li>
                il trattamento è necessario per adempiere un obbligo legale al quale è
                soggetto il Titolare;
              </li>
              <li>
                il trattamento è necessario per l'esecuzione di un compito di interesse
                pubblico o per l'esercizio di pubblici poteri di cui è investito il
                Titolare;
              </li>
              <li>
                il trattamento è necessario per il perseguimento del legittimo interesse
                del Titolare o di terzi.
              </li>
            </ul>
            <p>
              È comunque sempre possibile richiedere al Titolare di chiarire la concreta
              base giuridica di ciascun trattamento ed in particolare di specificare se
              il trattamento sia basato sulla legge, previsto da un contratto o
              necessario per concludere un contratto.
            </p>

            <h3>Ulteriori informazioni sul tempo di conservazione</h3>
            <p>
              Se non diversamente indicato in questo documento, i Dati Personali sono
              trattati e conservati per il tempo richiesto dalla finalità per la quale
              sono stati raccolti e potrebbero essere conservati per un periodo più
              lungo a causa di eventuali obbligazioni legali o sulla base del consenso
              degli Utenti.
            </p>
            <p>Pertanto:</p>
            <ul>
              <li>
                I Dati Personali raccolti per scopi collegati all’esecuzione di un
                contratto tra il Titolare e l’Utente saranno trattenuti sino a quando
                sia completata l’esecuzione di tale contratto.
              </li>
              <li>
                I Dati Personali raccolti per finalità riconducibili all’interesse
                legittimo del Titolare saranno trattenuti sino al soddisfacimento di
                tale interesse. L’Utente può ottenere ulteriori informazioni in merito
                all’interesse legittimo perseguito dal Titolare nelle relative sezioni
                di questo documento o contattando il Titolare.
              </li>
              <li>
                Quando il trattamento è basato sul consenso dell’Utente, il Titolare può
                conservare i Dati Personali più a lungo sino a quando detto consenso non
                venga revocato. Inoltre, il Titolare potrebbe essere obbligato a
                conservare i Dati Personali per un periodo più lungo per adempiere ad un
                obbligo di legge o per ordine di un’autorità.
              </li>
            </ul>
          </div>
        </section>

        <section v-reveal class="legal__card">
          <h2 class="legal__heading">
            <span class="legal__num">05</span>
            Diritti dell’Utente sulla base del Regolamento Generale sulla Protezione
            dei Dati (GDPR)
          </h2>
          <div class="legal__prose">
            <p>
              Gli Utenti possono esercitare determinati diritti con riferimento ai Dati
              trattati dal Titolare.
            </p>
          </div>
          <!-- I diritti come tessere con la spunta: si scorrono più in fretta
               di un elenco puntato. -->
          <ul class="legal__rights">
            <li v-for="right in rights" :key="right">
              <span class="legal__check" aria-hidden="true">
                <Icon name="heroicons:check-20-solid" size="14" />
              </span>
              {{ right }}
            </li>
          </ul>
        </section>

        <section v-reveal class="legal__card">
          <h2 class="legal__heading">
            <span class="legal__num">06</span>
            Come esercitare i diritti
          </h2>
          <div class="legal__prose">
            <p>
              Eventuali richieste di esercizio dei diritti dell'Utente possono essere
              indirizzate al Titolare attraverso i recapiti forniti in questo documento.
              La richiesta è gratuita e il Titolare risponderà nel più breve tempo
              possibile, in ogni caso entro un mese.
            </p>
          </div>
        </section>

        <section v-reveal class="legal__card">
          <h2 class="legal__heading">
            <span class="legal__num">07</span>
            Ulteriori informazioni sul trattamento
          </h2>
          <div class="legal__prose">
            <h3>Difesa in giudizio</h3>
            <p>
              I Dati Personali dell’Utente possono essere utilizzati da parte del
              Titolare in giudizio o nelle fasi preparatorie alla sua eventuale
              instaurazione per la difesa da abusi nell'utilizzo di questa Applicazione
              o dei Servizi connessi da parte dell’Utente.
            </p>
            <h3>Informative specifiche</h3>
            <p>
              Su richiesta dell’Utente, in aggiunta alle informazioni contenute in
              questa privacy policy, questa Applicazione potrebbe fornire all'Utente
              delle informative aggiuntive e contestuali riguardanti Servizi specifici,
              o la raccolta ed il trattamento di Dati Personali.
            </p>
            <h3>Log di sistema e manutenzione</h3>
            <p>
              Per necessità legate al funzionamento ed alla manutenzione, questa
              Applicazione e gli eventuali servizi terzi da essa utilizzati potrebbero
              raccogliere log di sistema, ossia file che registrano le interazioni e che
              possono contenere anche Dati Personali, quali l’indirizzo IP Utente.
            </p>
          </div>
        </section>

        <section v-reveal class="legal__card">
          <h2 class="legal__heading">
            <span class="legal__num">08</span>
            Informazioni non contenute in questa policy
          </h2>
          <div class="legal__prose">
            <p>
              Ulteriori informazioni in relazione al trattamento dei Dati Personali
              potranno essere richieste in qualsiasi momento al Titolare del Trattamento
              utilizzando gli estremi di contatto.
            </p>
          </div>
        </section>

        <section v-reveal class="legal__card">
          <h2 class="legal__heading">
            <span class="legal__num">09</span>
            Modifiche a questa privacy policy
          </h2>
          <div class="legal__prose">
            <p>
              Il Titolare del Trattamento si riserva il diritto di apportare modifiche
              alla presente privacy policy in qualunque momento notificandolo agli
              Utenti su questa pagina e, se possibile, su questa Applicazione.
            </p>
          </div>
        </section>

        <section v-reveal class="legal__card">
          <h2 class="legal__heading">
            <span class="legal__num">10</span>
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
const rights = [
  "revocare il consenso in ogni momento;",
  "opporsi al trattamento dei propri Dati;",
  "accedere ai propri Dati;",
  "verificare e chiedere la rettificazione;",
  "ottenere la limitazione del trattamento;",
  "ottenere la cancellazione o rimozione dei propri Dati Personali;",
  "ricevere i propri Dati o farli trasferire ad altro titolare;",
  "proporre reclamo.",
];

const definitions = [
  {
    term: "Dati Personali (o Dati)",
    description:
      "Costituisce dato personale qualunque informazione che, direttamente o indirettamente, rende identificata o identificabile una persona fisica.",
  },
  {
    term: "Dati di Utilizzo",
    description:
      "Sono le informazioni raccolte automaticamente attraverso questa Applicazione.",
  },
  {
    term: "Utente",
    description: "L'individuo che utilizza questa Applicazione.",
  },
  {
    term: "Interessato",
    description: "La persona fisica cui si riferiscono i Dati Personali.",
  },
  {
    term: "Responsabile del Trattamento (o Responsabile)",
    description:
      "La persona fisica o giuridica che tratta dati personali per conto del Titolare.",
  },
  {
    term: "Titolare del Trattamento (o Titolare)",
    description:
      "La persona fisica o giuridica che determina le finalità e i mezzi del trattamento dei dati.",
  },
  {
    term: "Questa Applicazione",
    description:
      "Lo strumento hardware o software tramite cui vengono raccolti i Dati Personali.",
  },
  {
    term: "Servizio",
    description: "Il Servizio fornito da questa Applicazione.",
  },
  {
    term: "Unione Europea (o UE)",
    description:
      "Ogni riferimento all’Unione Europea in questo documento si intende esteso a tutti gli stati membri dell'Unione Europea e dello Spazio Economico Europeo.",
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

.legal__prose p {
  line-height: 1.75;
  color: var(--im-muted);
}

.legal__prose p + p {
  margin-top: 14px;
}

.legal__prose h3 {
  position: relative;
  margin: 28px 0 12px;
  padding-top: 20px;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--im-ink);
}

.legal__prose h3::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, rgba(247, 210, 216, 0.4), rgba(92, 200, 224, 0.3) 50%, transparent);
}

.legal__prose h3:first-child {
  margin-top: 0;
  padding-top: 0;
}

.legal__prose h3:first-child::before {
  display: none;
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

.legal__prose a {
  font-weight: 600;
  color: var(--im-pink);
  text-decoration: underline;
  text-decoration-color: rgba(247, 210, 216, 0.4);
  text-underline-offset: 3px;
  transition: text-decoration-color 0.2s ease;
}

.legal__prose a:hover {
  text-decoration-color: var(--im-pink);
}

.legal__prose a:focus-visible {
  border-radius: 4px;
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
}

.legal__rights {
  display: grid;
  gap: 8px;
  margin-top: 16px;
}

@media (min-width: 640px) {
  .legal__rights {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.legal__rights li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.03);
  font-size: 15px;
  line-height: 1.5;
  color: var(--im-ink);
}

.legal__check {
  display: grid;
  flex: none;
  place-items: center;
  width: 22px;
  height: 22px;
  margin-top: 1px;
  border-radius: 50%;
  color: #2a0a14;
  background: linear-gradient(135deg, #fde4e8, var(--im-pink-strong));
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
  .legal__prose a {
    transition: none;
  }
}
</style>
