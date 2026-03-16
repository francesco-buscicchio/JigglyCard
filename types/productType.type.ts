import type { Variant } from "./variant.type";

export type ProductType = {
  id: string;
  productName: string;
  code: string;
  expansion: string;
  price: string;
  imageUrl: string;
  tcg: string;
  category: string;
  available: boolean;
  variants: Variant[];
};
