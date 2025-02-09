export type ProductType = {
    id: string;
    productName: string;
    code: string;
    expansion: string;
    price: string;
    imageUrl: string;
    tcg: string;
    category: string;
  };
  
  export interface SearchProductResult {
    hits: Hit[];
    nbHits: number;
    page: number;
    nbPages: number;
    hitsPerPage: number;
    exhaustiveNbHits: boolean;
    exhaustiveTypo: boolean;
    exhaustive: {
      nbHits: boolean;
      typo: boolean;
    };
    query: string;
    params: string;
    renderingContent: Record<string, unknown>;
    processingTimeMS: number;
    processingTimingsMS: {
      _request: {
        roundTrip: number;
      };
      total: number;
    };
    serverTimeMS: number;
  }
  
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
  
  interface VariantDetail {
    id: string;
    language: string;
    condition: string;
    price: number;
  }
  
  interface HighlightResult {
    name: {
      value: string;
      matchLevel: string;
      fullyHighlighted: boolean;
      matchedWords: string[];
    };
    tags: Array<{
      value: string;
      matchLevel: string;
      matchedWords: string[];
    }>;
  }
  