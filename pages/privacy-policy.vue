<template>
  <OrganismsLegalPage
    eyebrow="Informativa"
    title="Privacy"
    title-accent="Policy"
    lead="Quali dati personali trattiamo quando usi jigglycard.com, perché, per quanto tempo e quali diritti hai (artt. 13 e 14 del Regolamento UE 2016/679, GDPR)."
    owner-title="Titolare del trattamento"
    updated-at="2 ottobre 2026"
  >
    <OrganismsLegalSection num="01" title="Quali dati trattiamo e perché">
      <p>
        Trattiamo solo i dati necessari alle finalità indicate qui sotto. I dati
        richiesti per l'ordine sono obbligatori: senza di essi non possiamo concludere né
        eseguire il contratto.
      </p>
      <div class="legal__table-wrap">
        <table class="legal__table">
          <thead>
            <tr>
              <th>Finalità</th>
              <th>Dati</th>
              <th>Base giuridica</th>
              <th>Conservazione</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in purposes" :key="row.purpose">
              <td>{{ row.purpose }}</td>
              <td>{{ row.data }}</td>
              <td>{{ row.basis }}</td>
              <td>{{ row.retention }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Non usiamo i tuoi dati per inviarti comunicazioni promozionali e non prendiamo
        decisioni basate unicamente su trattamenti automatizzati.
      </p>
    </OrganismsLegalSection>

    <OrganismsLegalSection num="02" title="Pagamenti">
      <p>
        I pagamenti sono gestiti da <strong>Stripe</strong>. I dati della carta o degli
        altri strumenti di pagamento vengono inseriti direttamente nei moduli di Stripe e
        trattati da Stripe secondo la propria
        <a href="https://stripe.com/it/privacy" target="_blank" rel="noopener">informativa</a>:
        noi non li riceviamo e non li conserviamo. Da Stripe riceviamo solo l'esito e
        l'importo del pagamento.
      </p>
    </OrganismsLegalSection>

    <OrganismsLegalSection num="03" title="A chi comunichiamo i dati">
      <p>
        I dati sono trattati dal Titolare e, per suo conto, dai fornitori che gli
        permettono di erogare il servizio, nominati responsabili del trattamento o, dove
        previsto, titolari autonomi:
      </p>
      <ul>
        <li v-for="provider in providers" :key="provider.name">
          <strong>{{ provider.name }}</strong> — {{ provider.role }}
        </li>
      </ul>
      <p>
        I dati possono inoltre essere comunicati al consulente fiscale per gli
        adempimenti contabili e alle autorità quando la legge lo richiede. Non vendiamo né
        cediamo i dati a terzi per finalità proprie.
      </p>
    </OrganismsLegalSection>

    <OrganismsLegalSection num="04" title="Trasferimenti fuori dall'Unione Europea">
      <p>
        Alcuni fornitori (ad esempio Netlify, Stripe, Google e MongoDB) hanno sede o
        infrastrutture negli Stati Uniti. In questi casi il trasferimento avviene sulla
        base della decisione di adeguatezza della Commissione europea sul Data Privacy
        Framework UE-USA, per le società certificate, oppure delle clausole contrattuali
        standard approvate dalla Commissione (art. 46 GDPR).
      </p>
    </OrganismsLegalSection>

    <OrganismsLegalSection num="05" title="Cookie e statistiche">
      <p>
        Il Sito usa strumenti tecnici necessari al funzionamento (carrello, pagamento,
        memorizzazione delle scelte sui cookie) e, solo se lo consenti, Google Analytics
        per statistiche di utilizzo. Il dettaglio è nella
        <NuxtLink to="/cookies">Cookie Policy</NuxtLink>, dove puoi anche modificare le tue
        scelte in qualsiasi momento.
      </p>
    </OrganismsLegalSection>

    <OrganismsLegalSection num="06" title="I tuoi diritti">
      <p>In qualsiasi momento puoi esercitare i diritti previsti dagli artt. 15-22 del GDPR:</p>
      <ul>
        <li v-for="right in rights" :key="right">{{ right }}</li>
      </ul>
      <p>
        Per esercitarli scrivi a <a :href="`mailto:${SELLER.email}`">{{ SELLER.email }}</a>:
        rispondiamo entro un mese. Se ritieni che il trattamento violi la normativa, puoi
        proporre reclamo al Garante per la protezione dei dati personali
        (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener">www.garanteprivacy.it</a>).
      </p>
    </OrganismsLegalSection>

    <OrganismsLegalSection num="07" title="Sicurezza e modifiche">
      <p>
        Adottiamo misure tecniche e organizzative adeguate a proteggere i dati, tra cui
        connessioni cifrate (HTTPS), accessi riservati ai sistemi e fornitori che offrono
        garanzie di sicurezza. Questa informativa può essere aggiornata: la data
        dell'ultimo aggiornamento è indicata in cima alla pagina.
      </p>
    </OrganismsLegalSection>
  </OrganismsLegalPage>
</template>

<script setup lang="ts">
import { SELLER } from "~/data/const";

useHead({
  title: "Privacy Policy | Jigglycard",
  meta: [
    {
      name: "description",
      content:
        "Informativa sul trattamento dei dati personali di Jigglycard: ordini, pagamenti, assistenza, cookie e diritti dell'interessato.",
    },
  ],
});

const purposes = [
  {
    purpose: "Gestione degli ordini e consegna",
    data: "Nome, cognome, email, indirizzo di spedizione, prodotti acquistati, importi",
    basis: "Esecuzione del contratto (art. 6.1.b GDPR)",
    retention: "10 anni dall'ordine per gli obblighi civilistici e fiscali",
  },
  {
    purpose: "Email di conferma d'ordine e comunicazioni sull'ordine",
    data: "Nome, email, dati dell'ordine",
    basis: "Esecuzione del contratto e obbligo di legge (Codice del Consumo, art. 51)",
    retention: "Come i dati dell'ordine",
  },
  {
    purpose: "Assistenza (modulo, email, telefono, WhatsApp)",
    data: "Nome, cognome, email o telefono, contenuto del messaggio",
    basis: "Riscontro a una tua richiesta (art. 6.1.b GDPR) e legittimo interesse (art. 6.1.f)",
    retention: "Fino a 24 mesi dall'ultimo contatto, salvo che servano per un ordine",
  },
  {
    purpose: "Prenotazione della valutazione di una collezione",
    data: "Dati inseriti nel modulo di prenotazione (nome, email, data e ora)",
    basis: "Misure precontrattuali su tua richiesta (art. 6.1.b GDPR)",
    retention: "Fino a 24 mesi dall'appuntamento",
  },
  {
    purpose: "Statistiche di utilizzo del Sito (Google Analytics)",
    data: "Dati di navigazione pseudonimi, identificativi dei cookie, indirizzo IP",
    basis: "Consenso (art. 6.1.a GDPR), revocabile in qualsiasi momento",
    retention: "Secondo le impostazioni del servizio, al massimo 14 mesi",
  },
  {
    purpose: "Memorizzazione delle scelte sui cookie",
    data: "Preferenze espresse, data, identificativo del consenso",
    basis: "Obbligo di legge di documentare il consenso (art. 6.1.c GDPR)",
    retention: "Fino a 12 mesi, poi la scelta viene richiesta di nuovo",
  },
  {
    purpose: "Funzionamento e sicurezza del Sito",
    data: "Indirizzo IP, dati tecnici di navigazione nei log del server",
    basis: "Legittimo interesse alla sicurezza (art. 6.1.f GDPR)",
    retention: "Per il tempo strettamente necessario, di norma pochi giorni",
  },
];

const providers = [
  { name: "Netlify Inc.", role: "hosting del Sito e del gestionale (USA)" },
  { name: "MongoDB Inc.", role: "database in cloud del gestionale degli ordini" },
  { name: "Aruba S.p.A.", role: "posta elettronica per conferme d'ordine e assistenza" },
  { name: "Stripe Payments Europe Ltd.", role: "elaborazione dei pagamenti" },
  { name: "Poste Italiane e altri corrieri", role: "consegna dei prodotti" },
  { name: "Google Ireland Ltd.", role: "statistiche di utilizzo, solo con il tuo consenso" },
  { name: "iubenda S.r.l.", role: "raccolta e registrazione delle scelte sui cookie" },
  { name: "Koalendar", role: "prenotazione degli appuntamenti di valutazione collezioni" },
];

const rights = [
  "accedere ai tuoi dati e riceverne copia;",
  "chiederne la rettifica o l'integrazione;",
  "chiederne la cancellazione, nei casi previsti;",
  "chiedere la limitazione del trattamento;",
  "opporti al trattamento basato sul legittimo interesse;",
  "ricevere i dati in un formato strutturato (portabilità);",
  "revocare il consenso, senza effetti sui trattamenti già svolti.",
];
</script>
