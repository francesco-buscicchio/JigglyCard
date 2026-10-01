import type { ProductType } from "~/types/productType.type";
import type { Variant } from "~/types/variant.type";
import type {
  CmsFacetEntry,
  CmsProduct,
  CmsProductList,
  CmsVariant,
} from "~/types/shop";

/**
 * Adatta le risposte del CMS alle forme già usate dai componenti del catalogo.
 *
 * Sostituisce `mapper/products.mapper.ts`, che leggeva da Algolia. Il contratto
 * verso i componenti resta identico — prezzi in euro come stringhe formattate,
 * faccette come mappa valore → conteggio — così le card, i filtri e il
 * selettore di variante della scheda prodotto non vanno toccati.
 */

const centsToEuro = (cents: number) => Number(cents ?? 0) / 100;

export function mapStorefrontVariants(variants: CmsVariant[] = []): Variant[] {
  return variants.map((variant) => ({
    id: variant.variantId,
    // Il carrello identifica la riga con l'id variante: nel modello CMS non
    // esiste più un documentId separato, i due coincidono.
    documentId: variant.variantId,
    language: variant.language ?? "",
    condition: variant.condition ?? "",
    price: centsToEuro(variant.priceCents),
    quantity: Number(variant.quantity ?? 0),
  }));
}

/**
 * Nome nella lingua dell'utente.
 *
 * I set usciti anche in Italia hanno il nome italiano da TCGdex; quelli
 * giapponesi no, e per quelli resta l'originale.
 */
const localized = (original: string, italian?: string, locale = "it") =>
  locale.startsWith("it") && italian ? italian : original;

export function mapStorefrontProduct(
  product: CmsProduct,
  locale = "it",
): ProductType {
  return {
    // Lo slug è l'identificativo pubblico: le URL della scheda prodotto lo usano.
    id: product.slug,
    blueprintId: product.blueprintId,
    productName: localized(product.name, product.nameIt, locale),
    code: product.collectorNumber ? `(${product.collectorNumber})` : "",
    expansion:
      localized(product.expansion, product.expansionIt, locale) || "N.A.",
    price: centsToEuro(product.minPriceCents).toFixed(2),
    imageUrl: product.images?.[0] ?? "",
    imageUrlLarge: product.imagesLarge?.[0] ?? product.images?.[0] ?? "",
    tcg: product.game,
    category: product.category,
    tcgSlug: product.gameSlug,
    categorySlug: product.categorySlug,
    available: product.available,
    languages: product.languages ?? [],
    conditions: product.conditions ?? [],
    quantity: product.totalAvailableQty ?? 0,
    variants: mapStorefrontVariants(product.variants),
  };
}

export function mapStorefrontProducts(
  products: CmsProduct[] = [],
  locale = "it",
) {
  return products.map((product) => mapStorefrontProduct(product, locale));
}

const toFacetMap = (entries: CmsFacetEntry[] = []) =>
  Object.fromEntries(entries.map((entry) => [entry.value, entry.count]));

/**
 * I componenti dei filtri leggono `Record<attributo, Record<valore, conteggio>>`
 * con i nomi degli attributi Algolia: la mappatura li conserva.
 */
export function mapStorefrontFacets(facets: CmsProductList["facets"]) {
  return {
    languages: toFacetMap(facets?.languages),
    conditions: toFacetMap(facets?.conditions),
    tcg: toFacetMap(facets?.games),
    type: toFacetMap(facets?.categories),
    setSlug: toFacetMap(facets?.expansions),
  } as Record<string, Record<string, number>>;
}

/**
 * Dizionario slug -> nome leggibile per le faccette che filtrano per slug.
 *
 * Il filtro continua a inviare lo slug al CMS; questo serve solo a mostrare
 * "Ascended Heroes" al posto di "ascended-heroes".
 */
export function mapStorefrontFacetLabels(facets: CmsProductList["facets"]) {
  const toLabelMap = (entries: CmsFacetEntry[] = []) =>
    Object.fromEntries(
      entries
        .filter((entry) => entry.label)
        .map((entry) => [entry.value, entry.label as string]),
    );

  return {
    tcg: toLabelMap(facets?.games),
    type: toLabelMap(facets?.categories),
    setSlug: toLabelMap(facets?.expansions),
  } as Record<string, Record<string, string>>;
}

export function mapStorefrontPriceStats(facets: CmsProductList["facets"]) {
  return {
    min: centsToEuro(facets?.price?.min ?? 0),
    max: centsToEuro(facets?.price?.max ?? 0),
  };
}

/** Ordinamenti di `data/sorting.ts` (suffissi delle repliche Algolia) → CMS. */
export const SORT_MAP: Record<string, string> = {
  "": "relevance",
  _price_asc: "price_asc",
  _price_desc: "price_desc",
  _name_asc: "name_asc",
  _name_desc: "name_desc",
  // Il CMS non indicizza il numero da collezione come chiave d'ordinamento:
  // si ricade sull'ordine alfabetico, che è il più vicino per l'utente.
  _number_lowest: "name_asc",
  _number_highest: "name_desc",
};
