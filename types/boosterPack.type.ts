/** Una busta in vendita, pronta per essere aperta virtualmente in home. */
export type BoosterPack = {
  /** Slug del prodotto. */
  key: string;
  name: string;
  expansion: string;
  /** Il set della busta: le carte che "escono" sono solo di questo set. */
  expansionSlug: string;
  image: string;
  /** Prezzo in euro già formattato con due decimali. */
  price: string;
  url: string;
  /** Carte singole del set disponibili a magazzino (dalle faccette). */
  cardsInStock: number;
};
