import { StrapiCollectionCRUD } from "./StrapiCollectionCRUD";

// Interfaccia che rappresenta la struttura di un ordine
interface Order {
  documentID: string;
  user: string;
  date: Date;
  shipment_method: string;
  paid: boolean;
  order_value: number;
  shipment_value: number;
  total_value: number;
  variant: string[];
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

  async createOrder(orderData: Omit<Order, "date">): Promise<Order> {
    const now = new Date();
    const newOrder: Order = {
      ...orderData,
      date: now,
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
