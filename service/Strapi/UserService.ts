import { StrapiCollectionCRUD } from "./StrapiCollectionCRUD";

// Interfaccia che rappresenta la struttura di un utente
interface User {
  documentID: string;
  username: string;
  email: string;
  provider: string;
  password: string;
  resetPasswordToken: string;
  confirmationToken: string;
  confirmed: boolean;
  blocked: boolean;
  role: string;
}

class UserStrapiService extends StrapiCollectionCRUD<User> {
  constructor(strapiBaseUrl: string, accessToken: string) {
    super(strapiBaseUrl, accessToken, "users");
  }

  async getAllUsers(): Promise<User[]> {
    return await this.getAllItems("en");
  }

  async getUserById(userID: string): Promise<User | null> {
    return await this.getItemById(userID);
  }

  async createUser(userData: Omit<User, "documentID">): Promise<User> {
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
