<template>
  <div class="legal">
    <header class="im-container legal__hero">
      <p class="im-eyebrow">
        <span class="legal__pulse" aria-hidden="true"></span>
        {{ eyebrow }}
      </p>
      <h1 class="im-display legal__title">
        {{ title }} <span class="im-gradient-text">{{ titleAccent }}</span>
      </h1>
      <p class="im-lead legal__lead">{{ lead }}</p>
      <p v-if="updatedAt" class="legal__updated">Ultimo aggiornamento: {{ updatedAt }}</p>
    </header>

    <div class="im-container">
      <div class="legal__doc">
        <section class="legal__owner">
          <span class="legal__owner-icon" aria-hidden="true">
            <Icon name="heroicons:building-storefront-20-solid" size="22" />
          </span>
          <div>
            <h2 class="legal__owner-title">{{ ownerTitle }}</h2>
            <p class="legal__owner-text">
              {{ SELLER.name }}<br />
              {{ SELLER_ADDRESS }}<br />
              P.IVA {{ SELLER.vatNumber }} · C.F. {{ SELLER.taxCode }}<br />
              Email:
              <a :href="`mailto:${SELLER.email}`" class="legal__owner-link">{{ SELLER.email }}</a>
              · Tel.
              <a :href="`tel:${SELLER.phone.replace(/\s/g, '')}`" class="legal__owner-link">{{ SELLER.phone }}</a>
            </p>
          </div>
        </section>

        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Impaginazione comune delle pagine legali (condizioni di vendita, privacy,
 * cookie): testata, riquadro con i dati del venditore/titolare e, nello slot,
 * le sezioni numerate (OrganismsLegalSection).
 */
import { SELLER, SELLER_ADDRESS } from "~/data/const";

defineProps<{
  eyebrow: string;
  title: string;
  titleAccent: string;
  lead: string;
  ownerTitle: string;
  updatedAt?: string;
}>();
</script>

<style>
/*
 * Non scoped: il testo delle sezioni arriva dalle pagine tramite slot, e gli
 * stili scoped di questo componente non lo raggiungerebbero. Tutto resta
 * sotto `.legal` per non toccare il resto del sito.
 */
.legal {
  padding-bottom: 96px;
}

/* ---------- Testata ---------- */
.legal .legal__hero {
  padding-top: 48px;
  padding-bottom: 32px;
}

@media (min-width: 1024px) {
  .legal .legal__hero {
    padding-top: 72px;
    padding-bottom: 48px;
  }
}

.legal .legal__pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--im-teal);
  box-shadow: 0 0 0 4px rgba(92, 200, 224, 0.18);
}

.legal .legal__title {
  margin-top: 14px;
  font-size: clamp(36px, 7vw, 76px);
  overflow-wrap: break-word;
}

.legal .legal__title span {
  font-family: inherit;
}

.legal .legal__lead {
  max-width: 60ch;
  margin-top: 18px;
}

.legal .legal__updated {
  margin-top: 12px;
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--im-muted);
}

/* ---------- Documento ---------- */
/* Colonna di lettura: righe sotto i 70 caratteri, sezioni in vetro. */
.legal .legal__doc {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 920px;
}

.legal .legal__owner {
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
  .legal .legal__owner {
    padding: 28px 32px;
  }
}

.legal .legal__owner-icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  color: #2a0a14;
  background: linear-gradient(135deg, #fde4e8, var(--im-pink-strong));
}

.legal .legal__owner-title {
  margin-bottom: 8px;
  font-size: 19px;
  line-height: 1.25;
  color: var(--im-ink);
}

.legal .legal__owner-text {
  line-height: 1.7;
  color: var(--im-muted);
  overflow-wrap: anywhere;
}

.legal .legal__owner-link {
  color: var(--im-pink);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.legal .legal__card {
  padding: 24px 20px;
  border-radius: 24px;
  border: 1px solid var(--im-line);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02));
  scroll-margin-top: 110px;
}

@media (min-width: 768px) {
  .legal .legal__card {
    padding: 32px;
  }
}

.legal .legal__heading {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 18px;
  font-size: 19px;
  line-height: 1.3;
  color: var(--im-ink);
}

@media (min-width: 1024px) {
  .legal .legal__heading {
    font-size: 22px;
  }
}

/* Su mobile il numero sta sopra al titolo: accanto gli toglieva mezza riga
   e i titoli lunghi andavano a capo una parola alla volta. */
@media (max-width: 639px) {
  .legal .legal__heading {
    flex-direction: column;
    gap: 10px;
  }
}

.legal .legal__num {
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
.legal .legal__prose {
  max-width: 70ch;
}

.legal .legal__prose p {
  line-height: 1.75;
  color: var(--im-muted);
}

.legal .legal__prose p + p {
  margin-top: 14px;
}

.legal .legal__prose strong {
  color: var(--im-ink);
}

.legal .legal__prose h3 {
  position: relative;
  margin: 28px 0 12px;
  padding-top: 20px;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--im-ink);
}

.legal .legal__prose h3::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, rgba(247, 210, 216, 0.4), rgba(92, 200, 224, 0.3) 50%, transparent);
}

.legal .legal__prose h3:first-child {
  margin-top: 0;
  padding-top: 0;
}

.legal .legal__prose h3:first-child::before {
  display: none;
}

.legal .legal__prose ul {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 14px 0;
}

/* Stessa misura dei paragrafi (che la prendono dal CSS di base). */
.legal .legal__prose li {
  position: relative;
  padding-left: 24px;
  font-size: 16px;
  line-height: 1.7;
  color: var(--im-muted);
}

@media (min-width: 1024px) {
  .legal .legal__prose li {
    font-size: 18px;
  }
}

.legal .legal__prose li::before {
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

.legal .legal__prose a {
  font-weight: 600;
  color: var(--im-pink);
  text-decoration: underline;
  text-decoration-color: rgba(247, 210, 216, 0.4);
  text-underline-offset: 3px;
  transition: text-decoration-color 0.2s ease;
}

.legal .legal__prose a:hover {
  text-decoration-color: var(--im-pink);
}

.legal .legal__prose a:focus-visible {
  border-radius: 4px;
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
}

/* Riquadro evidenziato (modulo di recesso, avvisi). */
.legal .legal__box {
  margin: 16px 0;
  padding: 18px 20px;
  border-radius: 16px;
  border: 1px dashed rgba(247, 210, 216, 0.4);
  background: rgba(255, 255, 255, 0.03);
}

.legal .legal__box p {
  color: var(--im-ink);
}

/* Tabelle (cookie e servizi terzi): su mobile scorrono in orizzontale. */
.legal .legal__table-wrap {
  margin: 14px 0;
  overflow-x: auto;
}

.legal .legal__table {
  width: 100%;
  min-width: 560px;
  border-collapse: collapse;
  font-size: 14px;
}

.legal .legal__table th,
.legal .legal__table td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--im-line);
  text-align: left;
  vertical-align: top;
  line-height: 1.5;
}

.legal .legal__table th {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--im-pink);
}

.legal .legal__table td {
  color: var(--im-muted);
}

.legal .legal__table td:first-child {
  color: var(--im-ink);
  font-weight: 600;
}

.legal .legal__button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 10px 20px;
  border-radius: 999px;
  border: 1px solid rgba(247, 210, 216, 0.45);
  background: rgba(247, 210, 216, 0.1);
  font-weight: 700;
  color: var(--im-ink);
  cursor: pointer;
}

.legal .legal__button:hover {
  border-color: var(--im-pink);
}

@media (prefers-reduced-motion: reduce) {
  .legal .legal__prose a {
    transition: none;
  }
}
</style>
