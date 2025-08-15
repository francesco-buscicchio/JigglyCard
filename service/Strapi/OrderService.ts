import { StrapiCollectionCRUD } from "./StrapiCollectionCRUD";

// Interfaccia che rappresenta la struttura di un ordine
interface Order {
  documentID: string;
  customer: string;
  date: Date;
  shipment_method: string;
  paid?: boolean;
  order_value: number;
  shipment_value: number;
  total_value: number;
  variants: string[];
  country?: string;
  city: string;
  cap: string;
  street: string;
  trackingCode?: string;
  shipped?: boolean;
  invoiced?: boolean;
}

class OrderStrapiService extends StrapiCollectionCRUD<Order> {
  constructor(strapiBaseUrl: string, accessToken: string) {
    super(strapiBaseUrl, accessToken, "orders");
  }

  async getAllOrders(): Promise<Order[]> {
    return await this.getAllItems("en");
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    return await this.getItemById(orderId);
  }

  async createOrder(
    orderData: Omit<Order, "date" | "documentID">
  ): Promise<Order> {
    const now = new Date();
    const newOrder: Omit<Order, "documentID"> = {
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

export { OrderStrapiService };
