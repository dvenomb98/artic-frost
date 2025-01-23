import { createClient } from "../../client";
import { Tables } from "../../tables";
import { ProvidedClient, UserGamesData } from "../../definitions";

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

  /**
   *
   * Get user games history from USER_GAMES_HISTORY table
   *
   **/
  public static async getUserGamesHistory(providedClient?: ProvidedClient) {
    const client = this.getClient(providedClient);
    const userData = await this.getUserData(client);

    const { data, error } = await client
      .from(Tables.USER_GAMES_HISTORY)
      .select("game_id")
      .eq("user_id", userData.id)
      .returns<UserGamesData[]>();

    if (error) throw error;

    return { data, userData };
  }

  private static getClient(providedClient?: ProvidedClient) {
    return providedClient ?? createClient();
  }
}

export { ClientUserService };
