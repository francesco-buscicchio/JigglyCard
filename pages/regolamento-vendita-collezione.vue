<template>
  <div class="rules">
    <!-- Header -->
    <header class="im-container rules__hero">
      <p class="im-eyebrow rules__enter">
        <span class="rules__pulse" aria-hidden="true"></span>
        Vendi la tua collezione
      </p>
      <h1 class="im-display rules__title rules__enter" style="--d: 0.08s">
        Regolamento
        <span class="im-gradient-text">Vendita Collezioni</span>
      </h1>
      <p class="im-lead rules__lead rules__enter" style="--d: 0.16s">
        Leggi attentamente le condizioni per la vendita delle tue carte
        Pokémon presso Jigglycard.
      </p>
    </header>

    <!-- Content -->
    <div class="im-container">
      <div class="rules__body">
        <div class="rules__intro rules__enter" style="--d: 0.24s">
          <span class="rules__intro-icon" aria-hidden="true">
            <Icon name="heroicons:document-text-20-solid" size="22" />
          </span>
          <div>
            <h2 class="rules__intro-title">Regolamento di Vendita</h2>
            <p class="rules__text">
              Queste condizioni regolano la vendita di collezioni di carte Pokémon
              presso Jigglycard. La lettura e l'accettazione di questo regolamento
              sono obbligatorie per procedere con qualsiasi transazione.
            </p>
          </div>
        </div>

        <!-- Sezione 1 -->
        <section v-reveal class="rules__section">
          <h3 class="rules__heading">
            <span class="rules__num">01</span>
            Oggetto del Servizio
          </h3>
          <p class="rules__text">
            Jigglycard offre un servizio di valutazione e acquisto di
            collezioni di carte Pokémon. Il servizio include la valutazione
            gratuita delle carte presentate e, in caso di accordo, l'acquisto
            delle stesse secondo le condizioni qui descritte.
          </p>
        </section>

        <!-- Sezione 2 -->
        <section v-reveal class="rules__section">
          <h3 class="rules__heading">
            <span class="rules__num">02</span>
            Processo di Valutazione
          </h3>
          <ul class="rules__bullets">
            <li>
              La valutazione avviene sia online che presso la nostra sede
              fisica.
            </li>
            <li>
              È necessario prenotare un appuntamento tramite il nostro sito
              web.
            </li>
            <li>La valutazione è gratuita e non vincolante.</li>
            <li>Il cliente deve presentare un documento d'identità valido.</li>
            <li>
              Le carte devono essere presentate in condizioni tali da
              permettere una corretta valutazione.
            </li>
          </ul>
        </section>

        <!-- Sezione 3 -->
        <section v-reveal class="rules__section">
          <h3 class="rules__heading">
            <span class="rules__num">03</span>
            Criteri di Valutazione
          </h3>
          <p class="rules__text">
            La valutazione tiene conto dei seguenti fattori:
          </p>
          <ul class="rules__bullets rules__bullets--terms">
            <li>
              <strong>Rarità:</strong> Carte rare, olografiche, 1st Edition
              hanno valori superiori.
            </li>
            <li>
              <strong>Condizioni:</strong> Near Mint (NM), Lightly Played
              (LP), Moderately Played (MP), Heavily Played (HP), Damaged (D).
            </li>
            <li>
              <strong>Domanda di mercato:</strong> Prezzi aggiornati secondo i
              principali marketplace (Cardmarket, Cardtrader, ecc.).
            </li>
            <li>
              <strong>Set e anno:</strong> Alcuni set hanno valori più elevati
              per collezionismo.
            </li>
            <li>
              <strong>Completezza:</strong> Collezioni complete o con carte
              chiave hanno maggior valore.
            </li>
          </ul>
        </section>

        <!-- Sezione 4 -->
        <section v-reveal class="rules__section">
          <h3 class="rules__heading">
            <span class="rules__num">04</span>
            Offerta e Accettazione
          </h3>
          <ul class="rules__bullets">
            <li>
              L'offerta è valida per 7 giorni lavorativi dalla data di
              valutazione.
            </li>
            <li>Il cliente può accettare, rifiutare o contrattare l'offerta.</li>
            <li>
              In caso di accettazione, il cliente firma un contratto di
              vendita.
            </li>
            <li>
              Il pagamento avviene esclusivamente tramite bonifico bancario o
              assegno circolare.
            </li>
            <li>
              Le carte acquistate diventano proprietà di Jigglycard solo dopo
              avvenuto pagamento.
            </li>
          </ul>
        </section>

        <!-- Sezione 5 -->
        <section v-reveal class="rules__section">
          <h3 class="rules__heading">
            <span class="rules__num">05</span>
            Valutazione per Carte a Peso in Italiano
          </h3>
          <p class="rules__text">
            Per le carte comuni e non rare (bulk), applichiamo una valutazione
            a peso basata sul tipo di pagamento e rarità. Di seguito la
            tabella dei prezzi per carte italiane:
          </p>
          <div class="rules__table-wrap">
            <table class="rules__table">
              <thead>
                <tr>
                  <th scope="col">Tipo di pagamento</th>
                  <th scope="col">Comuni, non comuni e Rare non Holo</th>
                  <th scope="col">Holo, Reverse Holo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Contanti o Bonifico</th>
                  <td>5 €/kg</td>
                  <td>10 €/kg</td>
                </tr>
                <tr>
                  <th scope="row">Buono Sconto</th>
                  <td>6 €/kg</td>
                  <td>12 €/kg</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Sezione 6 -->
        <section v-reveal class="rules__section">
          <h3 class="rules__heading">
            <span class="rules__num">06</span>
            Valutazione per Carte a Peso in Giapponese
          </h3>
          <p class="rules__text">
            Di seguito la tabella dei prezzi per carte giapponesi bulk:
          </p>
          <div class="rules__table-wrap">
            <table class="rules__table">
              <thead>
                <tr>
                  <th scope="col">Tipo di pagamento</th>
                  <th scope="col">Comuni, non comuni e Rare non Holo</th>
                  <th scope="col">Holo, Reverse Holo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Contanti o Bonifico</th>
                  <td>4 €/kg</td>
                  <td>8 €/kg</td>
                </tr>
                <tr>
                  <th scope="row">Buono Sconto</th>
                  <td>5 €/kg</td>
                  <td>10 €/kg</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Sezione 7 -->
        <section v-reveal class="rules__section">
          <h3 class="rules__heading">
            <span class="rules__num">07</span>
            Condizioni delle Carte
          </h3>
          <p class="rules__text">
            Jigglycard acquista carte in qualsiasi condizione, ma il valore
            diminuisce significativamente per carte danneggiate:
          </p>
          <!-- Ogni condizione ha una barra con la quota del valore riconosciuta:
               il confronto si legge a colpo d'occhio. -->
          <ul class="rules__grades">
            <li v-for="grade in grades" :key="grade.name" class="rules__grade">
              <p class="rules__grade-text">
                <strong>{{ grade.name }}:</strong> {{ grade.text }}
              </p>
              <span class="rules__meter" aria-hidden="true">
                <span :style="{ width: `${grade.value}%` }"></span>
              </span>
            </li>
          </ul>
        </section>

        <!-- Sezione 8 -->
        <section v-reveal class="rules__section">
          <h3 class="rules__heading">
            <span class="rules__num">08</span>
            Esclusioni e Limitazioni
          </h3>
          <ul class="rules__bullets">
            <li>Non acquistiamo carte contraffatte, alterate o rubate.</li>
            <li>
              Carte provenienti da edizioni non ufficiali potrebbero non
              essere accettate.
            </li>
            <li>
              Riserviamo il diritto di rifiutare qualsiasi collezione senza
              motivazione.
            </li>
            <li>
              Il servizio è riservato a maggiorenni o minori accompagnati da
              tutore legale.
            </li>
          </ul>
        </section>

        <!-- Sezione 9 -->
        <section v-reveal class="rules__section">
          <h3 class="rules__heading">
            <span class="rules__num">09</span>
            Privacy e Trattamento Dati
          </h3>
          <p class="rules__text">
            I dati personali forniti saranno trattati nel rispetto del GDPR
            (Regolamento UE 2016/679). I dati sono utilizzati esclusivamente
            per gestire la richiesta di appuntamento e la valutazione. Per
            maggiori informazioni, consulta la nostra
            <NuxtLink to="/privacy-policy" class="rules__link"
              >Privacy Policy</NuxtLink
            >.
          </p>
        </section>

        <!-- Sezione 10 -->
        <section v-reveal class="rules__section">
          <h3 class="rules__heading">
            <span class="rules__num">10</span>
            Modifiche al Regolamento
          </h3>
          <p class="rules__text">
            Jigglycard si riserva il diritto di modificare questo regolamento
            in qualsiasi momento. Le modifiche saranno pubblicate sul sito web
            e entreranno in vigore immediatamente.
          </p>
        </section>

        <!-- Contatto -->
        <section v-reveal class="rules__contact">
          <h3 class="rules__contact-title">Hai domande?</h3>
          <p class="rules__contact-text">
            Se hai dubbi sul regolamento o sul processo di vendita,
            contattaci:
          </p>
          <div class="rules__ctas">
            <NuxtLink to="/assistenza" class="im-btn im-btn--primary">
              <Icon name="heroicons:phone" size="20" />
              Contattaci
            </NuxtLink>
            <NuxtLink to="/valuta-la-tua-collezione" class="im-btn im-btn--ghost">
              <Icon name="heroicons:calendar" size="20" />
              Prenota appuntamento
            </NuxtLink>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
usePageSeo({
  title: "Regolamento vendita collezioni",
  description:
    "Come funziona la vendita della tua collezione di carte Pokémon a Jigglycard: valutazione, condizioni delle carte e percentuali sul valore di mercato.",
});

// Condizioni delle carte (sezione 7): testi del regolamento e quota del
// valore di mercato, che disegna la barra accanto.
const grades = [
  {
    name: "Near Mint (NM)",
    text: "Come nuove, senza segni visibili - 70% del valore di mercato .",
    value: 70,
  },
  {
    name: "Lightly Played (LP)",
    text: "Segni minimi d'uso - valore 60%.",
    value: 60,
  },
  {
    name: "Moderately Played (MP)",
    text: "Segni evidenti d'uso - valore 50%.",
    value: 50,
  },
  {
    name: "Heavily Played (HP)",
    text: "Molto usurate - valore 40%.",
    value: 40,
  },
  {
    name: "Damaged (D)",
    text: "Danneggiate o incomplete - valore minimo o rifiuto.",
    value: 10,
  },
];
</script>

<style scoped>
.rules {
  padding-bottom: 96px;
}

/* ---------- Testata ---------- */
.rules__hero {
  padding-top: 48px;
  padding-bottom: 32px;
}

@media (min-width: 1024px) {
  .rules__hero {
    padding-top: 72px;
    padding-bottom: 48px;
  }
}

.rules__pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--im-pink-strong);
  box-shadow: 0 0 0 4px rgba(236, 145, 160, 0.18);
}

.rules__title {
  max-width: 16ch;
  margin-top: 14px;
  font-size: clamp(32px, 6vw, 68px);
  line-height: 1.02;
  overflow-wrap: break-word;
}

.rules__title span {
  display: block;
  font-family: inherit;
}

.rules__lead {
  max-width: 60ch;
  margin-top: 18px;
}

/* Entrata della testata, a cascata. */
.rules__enter {
  animation: rules-up 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) backwards;
  animation-delay: var(--d, 0s);
}

/* ---------- Corpo ---------- */
/* Colonna di lettura allineata alla testata, non a tutta pagina. */
.rules__body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 920px;
}

.rules__intro {
  display: flex;
  gap: 16px;
  padding: 24px 20px;
  border-radius: 24px;
  border: 1px solid rgba(247, 210, 216, 0.28);
  background:
    radial-gradient(80% 140% at 100% 0%, rgba(92, 200, 224, 0.16), transparent 60%),
    radial-gradient(80% 140% at 0% 100%, rgba(236, 145, 160, 0.18), transparent 60%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
}

@media (min-width: 768px) {
  .rules__intro {
    padding: 32px;
  }
}

.rules__intro-icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  color: #2a0a14;
  background: linear-gradient(135deg, #fde4e8, var(--im-pink-strong));
  box-shadow: 0 12px 28px -12px rgba(236, 145, 160, 0.8);
}

.rules__intro-title {
  margin-bottom: 8px;
  font-size: 22px;
  line-height: 1.2;
  color: var(--im-ink);
}

.rules__section {
  padding: 24px 20px;
  border-radius: 24px;
  border: 1px solid var(--im-line);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02));
  transition: border-color 0.3s ease;
}

@media (min-width: 768px) {
  .rules__section {
    padding: 32px;
  }
}

.rules__section:hover {
  border-color: rgba(255, 255, 255, 0.18);
}

.rules__heading {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
  font-size: 19px;
  line-height: 1.25;
  color: var(--im-ink);
}

@media (min-width: 1024px) {
  .rules__heading {
    font-size: 22px;
  }
}

/* Su mobile il numero sta sopra al titolo, che così non va a capo a ogni
   parola. */
@media (max-width: 639px) {
  .rules__heading {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}

/* Numero di sezione in monospace, in una capsula di vetro rosa. */
.rules__num {
  display: inline-grid;
  flex: none;
  place-items: center;
  min-width: 44px;
  height: 32px;
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

.rules__text {
  max-width: 70ch;
  line-height: 1.7;
  color: var(--im-muted);
}

.rules__text + .rules__bullets,
.rules__text + .rules__grades,
.rules__text + .rules__table-wrap {
  margin-top: 16px;
}

.rules__text strong,
.rules__bullets strong,
.rules__grade-text strong {
  font-weight: 700;
  color: var(--im-ink);
}

/* Elenchi con un rombo sfumato al posto del pallino del browser. */
.rules__bullets {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 70ch;
}

/* Stessa misura dei paragrafi (che la prendono dal CSS di base). */
.rules__bullets li {
  position: relative;
  padding-left: 24px;
  font-size: 16px;
  line-height: 1.65;
  color: var(--im-muted);
}

@media (min-width: 1024px) {
  .rules__bullets li {
    font-size: 18px;
  }
}

.rules__bullets li::before {
  content: "";
  position: absolute;
  top: 0.62em;
  left: 4px;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: linear-gradient(135deg, var(--im-pink), var(--im-teal));
  transform: rotate(45deg);
}

.rules__bullets--terms li {
  padding: 12px 14px 12px 36px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
}

.rules__bullets--terms li::before {
  top: calc(12px + 0.62em);
  left: 16px;
}

/* ---------- Tabelle ---------- */
.rules__table-wrap {
  overflow-x: auto;
  border-radius: 18px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.02);
}

.rules__table {
  width: 100%;
  min-width: 300px;
  border-collapse: collapse;
  text-align: left;
}

.rules__table thead th {
  padding: 14px 16px;
  border-bottom: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.04);
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  vertical-align: bottom;
  color: var(--im-muted);
}

.rules__table tbody th,
.rules__table td {
  padding: 14px 16px;
  font-size: 15px;
  line-height: 1.4;
}

.rules__table tbody th {
  font-weight: 600;
  color: var(--im-ink);
}

.rules__table td {
  font-weight: 700;
  white-space: nowrap;
  color: var(--im-pink);
}

.rules__table tbody tr + tr {
  border-top: 1px solid var(--im-line);
}

.rules__table tbody tr {
  transition: background-color 0.2s ease;
}

.rules__table tbody tr:hover {
  background: rgba(247, 210, 216, 0.05);
}

@media (max-width: 480px) {
  .rules__table thead th,
  .rules__table tbody th,
  .rules__table td {
    padding: 12px 10px;
  }

  .rules__table tbody th,
  .rules__table td {
    font-size: 14px;
  }
}

/* ---------- Condizioni ---------- */
.rules__grades {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rules__grade {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.03);
}

.rules__grade-text {
  font-size: 15px;
  line-height: 1.55;
  color: var(--im-muted);
}

.rules__meter {
  position: relative;
  display: block;
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
}

.rules__meter span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--im-pink-strong), var(--im-pink) 60%, var(--im-teal));
  box-shadow: 0 0 12px rgba(236, 145, 160, 0.6);
}

.rules__link {
  font-weight: 600;
  color: var(--im-pink);
  text-decoration: underline;
  text-decoration-color: rgba(247, 210, 216, 0.4);
  text-underline-offset: 3px;
  transition: text-decoration-color 0.2s ease;
}

.rules__link:hover {
  text-decoration-color: var(--im-pink);
}

.rules__link:focus-visible {
  border-radius: 4px;
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
}

/* ---------- Contatto ---------- */
.rules__contact {
  position: relative;
  overflow: hidden;
  margin-top: 16px;
  padding: 32px 20px;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background:
    radial-gradient(80% 120% at 100% 0%, rgba(92, 200, 224, 0.24), transparent 60%),
    radial-gradient(80% 120% at 0% 100%, rgba(236, 145, 160, 0.26), transparent 60%),
    linear-gradient(135deg, #1a1650 0%, #0e1238 100%);
}

@media (min-width: 768px) {
  .rules__contact {
    padding: 44px;
  }
}

.rules__contact-title {
  font-size: clamp(24px, 3vw, 34px);
  line-height: 1.1;
  color: var(--im-ink);
}

.rules__contact-text {
  max-width: 56ch;
  margin-top: 10px;
  color: var(--im-muted);
}

.rules__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.rules__ctas a * {
  cursor: pointer;
}

@media (max-width: 420px) {
  .rules__ctas a {
    width: 100%;
  }
}

@keyframes rules-up {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .rules__enter {
    animation: none;
  }

  .rules__section,
  .rules__table tbody tr,
  .rules__link {
    transition: none;
  }
}
</style>
