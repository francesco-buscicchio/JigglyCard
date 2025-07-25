import { StrapiCollectionCRUD } from "./StrapiCollectionCRUD";

// Interfaccia che rappresenta la struttura di un ordine
interface Order {
  userId: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
  total: number;
  status: string; // E.g., "pending", "completed"
  createdAt: Date;
  updatedAt: Date;
}

class OrderService extends StrapiCollectionCRUD<Order> {
  constructor(strapiBaseUrl: string, accessToken: string) {
    super(strapiBaseUrl, accessToken, "orders");
  }

  // Metodi personalizzati per OrderService, se necessari
  async getAllOrders(): Promise<Order[]> {
    return await this.getAllItems("en"); // Puoi personalizzare locale se necessario
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    return await this.getItemById(orderId);
  }

  async createOrder(
    orderData: Omit<Order, "createdAt" | "updatedAt">
  ): Promise<Order> {
    const now = new Date();
    const newOrder = {
      ...orderData,
      createdAt: now,
      updatedAt: now,
    };
    return await this.createItem(newOrder);
  }

  async updateOrder(
    orderId: string,
    updateData: Partial<Order>
  ): Promise<Order> {
    return await this.updateItem(orderId, updateData);
  }

  async deleteOrder(orderId: string): Promise<void> {
    await this.deleteItem(orderId);
  }
}

export { OrderService };
