import { StrapiCollectionCRUD } from "./StrapiCollectionCRUD";

export interface Product {
  name: string;
  rarity: any;
  release_date: Date;
  thumbnail: any;
  category: any;
  code: string;
  cardtraderID: number;
  set: any;
  slug: string;
  description: string;
  tag: any;
  blueprintID: number;
}

class ProductStrapiService extends StrapiCollectionCRUD<Product> {
  constructor(strapiBaseUrl: string, accessToken: string) {
    super(strapiBaseUrl, accessToken, "products");
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.getAllItems("en");
  }

  async getProductById(documentID: string): Promise<any> {
    return await this.getItemById(documentID);
  }
}

export { ProductStrapiService };
