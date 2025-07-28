import { StrapiCollectionCRUD } from "./StrapiCollectionCRUD";

// Interfaccia che rappresenta la struttura di un carrello
interface Cart {
  documentID: string;
  session_id: string;
  creation_date: Date;
  expired_date: Date;
  variants: string[];
}

class CartService extends StrapiCollectionCRUD<Cart> {
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

  async getCartById(cartId: string): Promise<any> {
    return await this.getItemById(cartId);
  }

  async createCart(
    cartData: Omit<Cart, "creation_date" | "expired_date" | "documentID">
  ): Promise<any> {
    const now = new Date();
    const expiredDate = new Date();
    expiredDate.setMinutes(expiredDate.getMinutes() + 30);

    const newCart: Omit<Cart, "documentID"> = {
      ...cartData,
      creation_date: now,
      expired_date: expiredDate,
    };
    console.log(newCart);
    return await this.createItem(newCart);
  }

  async updateCart(
    cartId: string,
    updateData: Omit<Cart, "expiredDate">
  ): Promise<Cart> {
    console.log(cartId);
    const expiredDate = new Date();
    expiredDate.setMinutes(expiredDate.getMinutes() + 30);

    const newCart: Cart = {
      ...updateData,
      expired_date: expiredDate,
    };
    return await this.updateItem(cartId, newCart);
  }

  async deleteCart(cartId: string): Promise<void> {
    await this.deleteItem(cartId);
  }
}

export { CartService };
