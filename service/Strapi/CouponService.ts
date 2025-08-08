import { StrapiCollectionCRUD } from "./StrapiCollectionCRUD";

// Interfaccia che rappresenta la struttura di un coupon
export interface Coupon {
  documentId: string;
  code: string;
  available: number;
  used: number;
  expired_date: Date;
  coupon_type: CouponType;
}

type CouponType = {
  type: string;
  discount: number;
  free_shipping: boolean;
};

class CouponStrapiService extends StrapiCollectionCRUD<Coupon> {
  constructor(strapiBaseUrl: string, accessToken: string) {
    super(strapiBaseUrl, accessToken, "coupons");
  }

  async getCouponByCode(code: string): Promise<any> {
    if (code) return await this.getItemFromProperty("code", code);
    else return undefined;
  }

  async getCouponById(documentID: string): Promise<any> {
    if (documentID) return await this.getItemById(documentID);
    else return undefined;
  }

  async updateCoupon(
    couponId: string,
    updateData: Partial<Coupon>
  ): Promise<Coupon> {
    const newCart: Partial<Coupon> = {
      ...updateData,
    };
    return await this.updateItem(couponId, newCart);
  }
}

export { CouponStrapiService };
