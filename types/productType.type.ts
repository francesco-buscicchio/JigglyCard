import type { Variant } from "./variant.type";

export type ProductType = {
  /** Slug del prodotto: identificativo pubblico usato nelle URL. */
  id: string;
  /** Id CardTrader della carta, richiesto dal CMS per creare l'ordine. */
  blueprintId?: number;
  productName: string;
  code: string;
  expansion: string;
  price: string;
  imageUrl: string;
  /** Immagine ad alta risoluzione usata dalla scheda prodotto. */
  imageUrlLarge?: string;
  /** Nomi visualizzati. */
  tcg: string;
  category: string;
  /** Slug per costruire le URL: i nomi contengono spazi e accenti. */
  tcgSlug: string;
  categorySlug: string;
  available: boolean;
  /** Lingue e condizioni disponibili, mostrate sulla card. */
  languages: string[];
  conditions: string[];
  /** Pezzi disponibili in totale, per l'avviso "ultimi pezzi". */
  quantity: number;
  variants: Variant[];
};
