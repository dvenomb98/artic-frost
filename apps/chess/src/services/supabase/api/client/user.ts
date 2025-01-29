import { createClient } from "../../client";
import { ProvidedClient } from "../../models";


class ClientUserService {
  /**
   *
   * Get user data from supabase-auth-db
   *
   **/
  public static async getUserData(providedClient?: ProvidedClient) {
    const client = this.getClient(providedClient);
    const { data: userData, error } = await client.auth.getUser();
    if (error) throw error;
    return userData.user;
  }


  private static getClient(providedClient?: ProvidedClient) {
    return providedClient ?? createClient();
  }
}

export { ClientUserService };
