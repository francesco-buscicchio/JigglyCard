/**
 * Carta pronta per le sezioni della home immersiva: un prodotto del catalogo
 * ridotto a ciò che serve per mostrarlo, oppure una carta d'esempio quando il
 * CMS non risponde (in quel caso senza `url` né prezzo: non è in vendita).
 */
export type ShowcaseCard = {
  key: string;
  name: string;
  image: string;
  /** Scansione ad alta risoluzione, per le carte mostrate in grande. */
  imageLarge: string;
  expansion?: string;
  /** Prezzo in euro già formattato con due decimali. */
  price?: string;
  url?: string;
  available?: boolean;
  /** Rarità come la scrive CardTrader ("Illustration Rare", "Common"…). */
  rarity?: string;
};
