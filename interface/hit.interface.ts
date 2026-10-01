/**
 * Risultato della ricerca rapida nell'header.
 *
 * Era la forma dei record Algolia; ora è solo il contratto fra il layout e i
 * due header, riempito a partire dai prodotti del CMS.
 */
export interface Hit {
  /** Slug del prodotto, usato per costruire il link alla scheda. */
  objectID: string;
  name: string;
  thumbnailImage: string;
  salePrice: number;
  expansion: string;
  tcg: string;
  type: string;
}
