import type { Variant } from "~/types/variant.type";

export function mapProducts(algoliaProducts: any) {
  const products = [];
  for (let hit of algoliaProducts.hits) {
    const obj = mapProductItem(hit);
    products.push(obj);
  }
  return products;
}

export function mapProductItem(algoliaProductsItem: any) {
  return {
    productName: algoliaProductsItem.name,
    code: algoliaProductsItem.code ? `(${algoliaProductsItem.code})` : "",
    expansion: algoliaProductsItem.expansion || "N.A.",
    price: algoliaProductsItem.salePrice
      ? algoliaProductsItem.salePrice.toFixed(2)
      : "0.00",
    imageUrl:
      algoliaProductsItem.thumbnailImage ||
      (algoliaProductsItem.images && algoliaProductsItem.images.length > 0
        ? algoliaProductsItem.images[0]
        : null),
    tcg: algoliaProductsItem.tcg,
    category: algoliaProductsItem.type,
    id: algoliaProductsItem.objectID,
    available: algoliaProductsItem.available,
    variants: mapVariants(algoliaProductsItem.variantsDetails),
  };
}

function mapVariants(variants: any): Variant[] {
  if (!Array.isArray(variants)) return [];

  return variants.map((variant) => ({
    id: String(variant.id ?? ""),
    documentId: variant.documentId ?? "",
    language: variant.language ?? "",
    condition: variant.condition ?? "",
    price: Number(variant.price ?? 0),
    quantity: Number(variant.quantity ?? 0),
  }));
}
