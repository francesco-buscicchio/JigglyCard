<template>
  <OrganismsLegalPage
    eyebrow="Condizioni"
    title="Condizioni di"
    title-accent="vendita"
    lead="Le regole che valgono quando acquisti su jigglycard.com: ordine, pagamento, spedizione, recesso e garanzia."
    owner-title="Venditore"
    updated-at="2 ottobre 2026"
  >
    <OrganismsLegalSection num="01" title="Ambito di applicazione">
      <p>
        Le presenti condizioni generali di vendita regolano la vendita a distanza dei
        prodotti offerti sul sito <a :href="SELLER.website">www.jigglycard.com</a> (il
        "Sito") da {{ SELLER.name }}, con sede in {{ SELLER_ADDRESS }}, P.IVA
        {{ SELLER.vatNumber }} (il "Venditore"), a chi acquista sul Sito (il "Cliente").
      </p>
      <p>
        Il Cliente che agisce per scopi estranei alla propria attività imprenditoriale,
        commerciale, artigianale o professionale è un "Consumatore" ai sensi dell'art. 3
        del Codice del Consumo (D.Lgs. 206/2005) e gode delle tutele che la legge gli
        riconosce, che queste condizioni non limitano in alcun modo.
      </p>
      <p>
        Le condizioni applicabili sono quelle pubblicate sul Sito al momento dell'ordine:
        il Cliente le accetta spuntando l'apposita casella prima del pagamento e può
        salvarle o stamparle in qualsiasi momento. La vendita di collezioni al Venditore
        segue invece il
        <NuxtLink to="/regolamento-vendita-collezione">regolamento dedicato</NuxtLink>.
      </p>
    </OrganismsLegalSection>

    <OrganismsLegalSection num="02" title="Prodotti">
      <p>
        Il Sito vende carte collezionabili Pokémon singole e prodotti sigillati (buste,
        box, blister e simili). Ogni scheda prodotto riporta le caratteristiche
        essenziali: per le carte singole in particolare la <strong>condizione</strong>
        (Near Mint, Excellent, Good, Played, Poor), la <strong>lingua</strong> e
        l'eventuale versione (ad esempio foil o reverse).
      </p>
      <p>
        Le immagini delle carte singole possono mostrare l'illustrazione ufficiale della
        carta e non l'esemplare spedito: fa fede la condizione indicata nella scheda. I
        prodotti sigillati vengono spediti integri, nella confezione originale del
        produttore.
      </p>
      <p>
        Il magazzino è condiviso con altri canali di vendita del Venditore: la
        disponibilità viene verificata e riservata al momento del pagamento. Se, nonostante
        questo, un prodotto risultasse non disponibile, il Venditore lo comunica al
        Cliente e rimborsa integralmente quanto pagato per quel prodotto entro 14 giorni.
      </p>
    </OrganismsLegalSection>

    <OrganismsLegalSection num="03" title="Prezzi e spese di spedizione">
      <p>
        I prezzi sono espressi in euro e sono prezzi finali per il Consumatore, comprensivi
        di IVA ove applicabile. Le spese di spedizione dipendono dal metodo scelto, sono
        indicate nella pagina <NuxtLink to="/spedizioni">Spedizioni</NuxtLink> e vengono
        mostrate nel riepilogo prima del pagamento, insieme a eventuali sconti. Non sono
        previsti altri costi.
      </p>
      <p>
        In caso di errore evidente nell'indicazione del prezzo (ad esempio un prezzo
        palesemente sproporzionato rispetto al valore di mercato), il Venditore può
        annullare l'ordine dandone comunicazione al Cliente e rimborsando integralmente
        quanto pagato.
      </p>
    </OrganismsLegalSection>

    <OrganismsLegalSection num="04" title="Ordine e conclusione del contratto">
      <p>
        Il Cliente aggiunge i prodotti al carrello, inserisce i dati di spedizione,
        sceglie il metodo di spedizione, accetta queste condizioni e procede al
        pagamento. Il contratto si conclude quando il pagamento va a buon fine.
      </p>
      <p>
        Subito dopo, il Venditore invia all'indirizzo email indicato dal Cliente la
        <strong>conferma d'ordine</strong>, con il riepilogo dei prodotti, dei prezzi,
        delle spese di spedizione, dell'indirizzo di consegna e le informazioni sul
        diritto di recesso. Il Cliente è invitato a verificarla e a segnalare subito
        eventuali errori nei dati inseriti scrivendo a
        <a :href="`mailto:${SELLER.email}`">{{ SELLER.email }}</a>.
      </p>
    </OrganismsLegalSection>

    <OrganismsLegalSection num="05" title="Pagamento">
      <p>
        Il pagamento avviene online al momento dell'ordine tramite
        <strong>Stripe</strong>, con i metodi mostrati nella pagina di pagamento (carte di
        credito e di debito e gli altri metodi abilitati). I dati della carta vengono
        inseriti e trattati direttamente da Stripe con protocolli sicuri: il Venditore
        non li riceve e non li conserva.
      </p>
      <p>
        L'importo viene addebitato alla conferma del pagamento. I codici sconto, se
        disponibili, si applicano alle condizioni indicate al momento della loro
        diffusione e non sono cumulabili salvo diversa indicazione.
      </p>
    </OrganismsLegalSection>

    <OrganismsLegalSection num="06" title="Spedizione e consegna">
      <p>
        I prodotti vengono spediti all'indirizzo indicato dal Cliente con il metodo scelto
        tra quelli elencati nella pagina <NuxtLink to="/spedizioni">Spedizioni</NuxtLink>,
        imballati per proteggerli durante il trasporto. Salvo diverso accordo, la
        consegna avviene entro 30 giorni dalla conclusione del contratto (art. 61 del
        Codice del Consumo).
      </p>
      <p>
        Il rischio di perdita o danneggiamento dei prodotti passa al Consumatore solo
        quando questi, o un terzo da lui designato diverso dal vettore, ne entra
        materialmente in possesso (art. 63 del Codice del Consumo). Al ricevimento il
        Cliente è invitato a verificare l'integrità del pacco e a segnalare
        tempestivamente eventuali danni o manomissioni, possibilmente con fotografie.
      </p>
    </OrganismsLegalSection>

    <OrganismsLegalSection id="recesso" num="07" title="Diritto di recesso">
      <p>
        Il Consumatore ha diritto di recedere dal contratto, senza dover fornire alcuna
        motivazione, entro <strong>14 giorni</strong> dal giorno in cui riceve i prodotti
        (o l'ultimo prodotto, in caso di consegne separate), ai sensi degli artt. 52 e
        seguenti del Codice del Consumo.
      </p>
      <h3>Come esercitarlo</h3>
      <p>
        Prima della scadenza del termine, il Consumatore comunica la propria decisione con
        una dichiarazione esplicita inviata a
        <a :href="`mailto:${SELLER.email}`">{{ SELLER.email }}</a> o per posta a
        {{ SELLER.name }}, {{ SELLER_ADDRESS }}, indicando il numero d'ordine. Può usare il
        modulo tipo riportato qui sotto, ma non è obbligatorio. Il Venditore conferma
        senza ritardo la ricezione della comunicazione.
      </p>
      <h3>Restituzione dei prodotti</h3>
      <p>
        I prodotti vanno restituiti a {{ SELLER.name }}, {{ SELLER_ADDRESS }}, senza
        indebiti ritardi e comunque entro 14 giorni dalla comunicazione del recesso. Le
        <strong>spese di restituzione sono a carico del Consumatore</strong>. Si consiglia
        una spedizione tracciata e un imballo adeguato: le carte vanno rispedite protette
        (bustina e toploader o equivalenti) come sono state ricevute.
      </p>
      <h3>Rimborso</h3>
      <p>
        Il Venditore rimborsa tutti i pagamenti ricevuti, comprese le spese di consegna
        (escluse le eventuali spese aggiuntive di un metodo di consegna più costoso di
        quello standard scelto dal Consumatore), entro 14 giorni dal giorno in cui ha
        ricevuto la comunicazione del recesso, con lo stesso mezzo di pagamento usato per
        l'acquisto e senza costi per il Consumatore. Il rimborso può essere sospeso fino al
        ricevimento dei prodotti o fino alla prova della loro spedizione, se precedente.
      </p>
      <h3>Condizioni dei prodotti restituiti</h3>
      <p>
        Il Consumatore è responsabile della diminuzione del valore dei prodotti
        risultante da una manipolazione diversa da quella necessaria per stabilirne la
        natura, le caratteristiche e il funzionamento (art. 57 del Codice del Consumo).
        Per le carte collezionabili il valore dipende dalla condizione: una carta
        restituita in condizioni peggiori di quelle indicate, o un
        <strong>prodotto sigillato aperto</strong>, comporta una riduzione del rimborso
        pari alla diminuzione di valore, che per un prodotto sigillato aperto può arrivare
        al suo intero prezzo.
      </p>
      <p>
        Il diritto di recesso spetta ai soli Consumatori. Restano salvi i diritti
        derivanti dalla garanzia legale di conformità.
      </p>
    </OrganismsLegalSection>

    <OrganismsLegalSection id="modulo-recesso" num="08" title="Modulo di recesso tipo">
      <p>
        Allegato I, parte B, del Codice del Consumo. Compilare e restituire il presente
        modulo solo se si desidera recedere dal contratto.
      </p>
      <div class="legal__box">
        <p>
          Destinatario: {{ SELLER.name }}, {{ SELLER_ADDRESS }} — email
          {{ SELLER.email }}
        </p>
        <p>
          Con la presente io/noi (*) notifico/notifichiamo (*) il recesso dal mio/nostro
          (*) contratto di vendita dei seguenti beni (*)/per la prestazione del seguente
          servizio (*):
        </p>
        <p>Ordinato il (*)/ricevuto il (*): ______________ &nbsp; Numero d'ordine: ______________</p>
        <p>Nome del/dei consumatore(i): ______________</p>
        <p>Indirizzo del/dei consumatore(i): ______________</p>
        <p>
          Firma del/dei consumatore(i) (solo se il presente modulo è notificato in
          versione cartacea): ______________
        </p>
        <p>Data: ______________</p>
        <p>(*) Cancellare la dicitura inutile.</p>
      </div>
    </OrganismsLegalSection>

    <OrganismsLegalSection num="09" title="Garanzia legale di conformità">
      <p>
        Tutti i prodotti venduti al Consumatore sono coperti dalla garanzia legale di
        conformità prevista dagli artt. 128 e seguenti del Codice del Consumo, per i
        difetti di conformità che si manifestano entro <strong>2 anni dalla
        consegna</strong>. Per le carte singole è conforme il prodotto che corrisponde alla
        descrizione della scheda, in particolare per condizione, lingua e versione.
      </p>
      <p>
        In caso di difetto di conformità il Consumatore ha diritto, senza spese, al
        ripristino della conformità mediante sostituzione (ove possibile, trattandosi di
        pezzi da collezione spesso unici) oppure a una congrua riduzione del prezzo o alla
        risoluzione del contratto, nei casi previsti dalla legge. Per farla valere basta
        scrivere a <a :href="`mailto:${SELLER.email}`">{{ SELLER.email }}</a> indicando il
        numero d'ordine e descrivendo il difetto, possibilmente con fotografie.
      </p>
    </OrganismsLegalSection>

    <OrganismsLegalSection num="10" title="Assistenza e reclami">
      <p>
        Per informazioni, assistenza e reclami il Cliente può scrivere a
        <a :href="`mailto:${SELLER.email}`">{{ SELLER.email }}</a>, chiamare o scrivere su
        WhatsApp al <a :href="`tel:${SELLER.phone.replace(/\s/g, '')}`">{{ SELLER.phone }}</a>
        o usare il modulo nella pagina <NuxtLink to="/assistenza">Assistenza</NuxtLink>. Il
        Venditore risponde di norma entro 48 ore lavorative.
      </p>
      <p>
        Per la risoluzione stragiudiziale delle controversie, il Consumatore può
        rivolgersi agli organismi di risoluzione alternativa delle controversie (ADR)
        previsti dagli artt. 141 e seguenti del Codice del Consumo.
      </p>
    </OrganismsLegalSection>

    <OrganismsLegalSection num="11" title="Legge applicabile e foro competente">
      <p>
        Il contratto è regolato dalla legge italiana. Per le controversie con il
        Consumatore è competente il giudice del luogo di residenza o domicilio del
        Consumatore (art. 66-bis del Codice del Consumo). Restano salve le norme
        inderogabili a tutela del Consumatore del Paese in cui risiede abitualmente. Per i
        Clienti che non sono Consumatori è competente in via esclusiva il Foro di
        Taranto.
      </p>
    </OrganismsLegalSection>

    <OrganismsLegalSection num="12" title="Dati personali">
      <p>
        I dati del Cliente sono trattati per gestire l'ordine e gli obblighi di legge,
        come descritto nella <NuxtLink to="/privacy-policy">Privacy Policy</NuxtLink>. L'uso
        dei cookie è descritto nella <NuxtLink to="/cookies">Cookie Policy</NuxtLink>.
      </p>
    </OrganismsLegalSection>
  </OrganismsLegalPage>
</template>

<script setup lang="ts">
import { SELLER, SELLER_ADDRESS } from "~/data/const";

useHead({
  title: "Condizioni di vendita | Jigglycard",
  meta: [
    {
      name: "description",
      content:
        "Condizioni generali di vendita di Jigglycard: ordini, pagamenti, spedizioni, diritto di recesso e garanzia legale.",
    },
  ],
});
</script>
