import { StrapiCollectionCRUD } from "./StrapiCollectionCRUD";
import type { Variant } from "./VariantService";

// Interfaccia che rappresenta la struttura di un carrello
export interface Cart {
  documentId: string;
  session_id: string;
  creation_date: Date;
  expired_date: Date | string;
  variants: string[] | Variant[];
  quantity: QuantityType[] | string;
}

type QuantityType = {
  variant: string;
  quantity: number;
};

class CartStrapiService extends StrapiCollectionCRUD<Cart> {
  constructor(strapiBaseUrl: string, accessToken: string) {
    super(strapiBaseUrl, accessToken, "carts");
  }

  generateSessionId(): string {
    const sessionId = [...Array(16)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");
    return sessionId;
  }

  async getAllCarts(): Promise<Cart[]> {
    return await this.getAllItems("en");
  }

  async getCartById(documentID: string): Promise<any> {
    if (documentID) return await this.getItemById(documentID);
    else return undefined;
  }

  async createCart(
    cartData: Omit<Cart, "creation_date" | "expired_date" | "documentId">
  ): Promise<{ data: Cart }> {
    const now = new Date();
    const expiredDate = new Date();
    expiredDate.setMinutes(expiredDate.getMinutes() + 30);

    const newCart: Omit<Cart, "documentId"> = {
      ...cartData,
      creation_date: now,
      expired_date: expiredDate,
    };
    return (await this.createItem(newCart as Cart)) as unknown as {
      data: Cart;
    };
  }

  async updateCart(cartId: string, updateData: Partial<Cart>): Promise<Cart> {
    const expiredDate = new Date();
    expiredDate.setMinutes(expiredDate.getMinutes() + 30);

    const newCart: Partial<Cart> = {
      ...updateData,
      expired_date: expiredDate,
    };
    return await this.updateItem(cartId, newCart);
  }

  async deleteCart(cartId: string): Promise<void> {
    await this.deleteItem(cartId);
  }
}

export { CartStrapiService };
