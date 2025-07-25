import { StrapiCollectionCRUD } from "./StrapiCollectionCRUD";

// Interfaccia che rappresenta la struttura di un carrello
interface Cart {
  documentID: string;
  session_id: string;
  creation_date: Date;
  expired_date: Date;
  variant: string[];
}

class CartService extends StrapiCollectionCRUD<Cart> {
  constructor(strapiBaseUrl: string, accessToken: string) {
    super(strapiBaseUrl, accessToken, "carts");
  }

  async getAllCarts(): Promise<Cart[]> {
    return await this.getAllItems("en");
  }

  async getCartById(cartId: string): Promise<Cart | null> {
    return await this.getItemById(cartId);
  }

  async createCart(
    cartData: Omit<Cart, "creation_date" | "expired_date">
  ): Promise<Cart> {
    const now = new Date();
    const expiredDate = new Date();
    expiredDate.setMinutes(expiredDate.getMinutes() + 30);

    const newCart: Cart = {
      ...cartData,
      creation_date: now,
      expired_date: expiredDate,
    };
    return await this.createItem(newCart);
  }

  async updateCart(
    cartId: string,
    updateData: Omit<Cart, "expiredDate">
  ): Promise<Cart> {
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
