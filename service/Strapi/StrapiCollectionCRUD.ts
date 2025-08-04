import { strapi } from "@strapi/client";

class StrapiCollectionCRUD<T> {
  private clientStrapi: any;
  private collection: any;

  constructor(
    strapiBaseUrl: string,
    accessToken: string,
    collectionName: string
  ) {
    this.clientStrapi = strapi({
      baseURL: strapiBaseUrl,
      auth: accessToken,
    });
    this.collection = this.clientStrapi.collection(collectionName);
  }

  // Fetch all items in the collection
  async getAllItems(locale: string = "en"): Promise<T[]> {
    return await this.collection.find({ locale });
  }

  // Fetch a single item by ID
  async getItemById(itemId: string): Promise<T | null> {
    return await this.collection.findOne(itemId, { populate: "*" });
  }

  // Create a new item in the collection
  async createItem(itemData: Omit<T, "documentID">): Promise<T> {
    return await this.collection.create(itemData);
  }

  // Update an existing item in the collection
  async updateItem(itemId: string, updateData: Partial<T>): Promise<T> {
    return await this.collection.update(itemId, updateData);
  }

  // Delete an item by ID
  async deleteItem(itemId: string): Promise<void> {
    await this.collection.delete(itemId);
  }
}

export { StrapiCollectionCRUD };
