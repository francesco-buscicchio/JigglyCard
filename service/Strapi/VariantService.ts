import { StrapiCollectionCRUD } from "./StrapiCollectionCRUD";

export interface Variant {
  documentId: string;
  name: string;
  price: number;
  quantity: number;
  language: any;
  condition: any;
  product: any;
}

class VariantStrapiService extends StrapiCollectionCRUD<Variant> {
  constructor(strapiBaseUrl: string, accessToken: string) {
    super(strapiBaseUrl, accessToken, "variants");
  }

  async getAllVariants(): Promise<Variant[]> {
    return await this.getAllItems("en");
  }

  async getVariantById(documentID: string): Promise<any> {
    return await this.getItemById(documentID);
  }
}

export { VariantStrapiService };
