import type { HighlightResult } from "./highlightResult.interface";
import type { VariantDetail } from "./variantDetail.interface";

export interface Hit {
  name: string;
  code: string;
  shortDescription: string | null;
  thumbnailImage: string;
  salePrice: number;
  tcg: string;
  type: string;
  images: string[];
  expansion: string;
  tags: string[];
  variantsDetails: VariantDetail[];
  languages: string[];
  conditions: string[];
  quantity: number;
  available: boolean;
  objectID: string;
  _highlightResult: HighlightResult;
}
