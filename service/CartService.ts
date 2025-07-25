import { StrapiCollectionCRUD } from "./StrapiCollectionCRUD";

// Interfaccia che rappresenta la struttura di un carrello
interface Cart {
  userId: string;
  items: Array<{ productId: string; quantity: number }>;
  total: number;
  createdAt: Date;
  updatedAt: Date;
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
    cartData: Omit<Cart, "createdAt" | "updatedAt">
  ): Promise<Cart> {
    const now = new Date();
    const newCart = {
      ...cartData,
      createdAt: now,
      updatedAt: now,
    };
    return await this.createItem(newCart);
  }

  async updateCart(cartId: string, updateData: Partial<Cart>): Promise<Cart> {
    return await this.updateItem(cartId, updateData);
  }

  async deleteCart(cartId: string): Promise<void> {
    await this.deleteItem(cartId);
  }
}

export { CartService };
