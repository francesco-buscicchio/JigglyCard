import { StrapiCollectionCRUD } from "./StrapiCollectionCRUD";

// Interfaccia che rappresenta la struttura di un utente
export interface User {
  documentId: string;
  username: string;
  name: string;
  surname: string;
  email: string;
}

class UserStrapiService extends StrapiCollectionCRUD<User> {
  constructor(strapiBaseUrl: string, accessToken: string) {
    super(strapiBaseUrl, accessToken, "customers");
  }

  async getAllUsers(): Promise<User[]> {
    return await this.getAllItems("en");
  }

  async getUserById(userID: string): Promise<User | null> {
    return await this.getItemById(userID);
  }

  async getUserByEmail(email: string): Promise<User[]> {
    const users = await this.getItemFromProperty("email", email);
    return users;
  }

  async createUser(userData: Omit<User, "documentId">): Promise<User> {
    return await this.createItem(userData);
  }

  async updateUser(cartId: string, updateData: Partial<User>): Promise<User> {
    return await this.updateItem(cartId, updateData);
  }

  async deleteUser(cartId: string): Promise<void> {
    await this.deleteItem(cartId);
  }
}

export { UserStrapiService };
