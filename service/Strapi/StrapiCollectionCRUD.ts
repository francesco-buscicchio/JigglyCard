import {
  strapi,
  type API,
  type CollectionTypeManager,
  type StrapiClient,
} from "@strapi/client";

class StrapiCollectionCRUD<T> {
  private clientStrapi: StrapiClient;
  private collection: CollectionTypeManager;

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
    return (await this.collection.find({ locale })) as unknown as T[];
  }

  // Fetch a single item by ID
  async getItemById(itemId: string): Promise<T> {
    return (await this.collection.findOne(itemId, { populate: "*" })) as T;
  }

  // Create a new item in the collection
  async createItem(itemData: Omit<T, "documentID">): Promise<T> {
    return (await this.collection.create(itemData)) as T;
  }

  // Update an existing item in the collection
  async updateItem(itemId: string, updateData: Partial<T>): Promise<T> {
    return (await this.collection.update(itemId, updateData)) as T;
  }

  // Delete an item by ID
  async deleteItem(itemId: string): Promise<void> {
    await this.collection.delete(itemId);
  }
}

export { StrapiCollectionCRUD };
