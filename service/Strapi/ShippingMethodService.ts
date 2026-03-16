import { StrapiCollectionCRUD } from "./StrapiCollectionCRUD";

export interface ShippingMethod {
  documentId?: string;
  id?: string | number;
  name?: string;
  price?: number | string;
  max_weight?: number | string;
  maxWeight?: number | string;
  max_value?: number | string;
  maxValue?: number | string;
  international?: boolean | string;
  [key: string]: any;
}

class ShippingMethodStrapiService extends StrapiCollectionCRUD<ShippingMethod> {
  constructor(strapiBaseUrl: string, accessToken: string) {
    super(strapiBaseUrl, accessToken, "shipping-methods");
  }

  async getAllShippingMethods(): Promise<ShippingMethod[]> {
    const result: any = await this.getAllItems("en");
    return Array.isArray(result) ? result : result?.data ?? [];
  }
}

export { ShippingMethodStrapiService };
