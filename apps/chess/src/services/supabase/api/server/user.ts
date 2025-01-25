import "server-only";

import { createClient } from "../../server";
import { Tables } from "../../tables";
import { ProvidedClient, RAW_GAME_SCHEMA } from "../../models"
import { z } from "zod";

class UserService {
  /**
   *
   * Get user data from supabase-auth-db
   *
   **/
  public static async getUserData(providedClient?: ProvidedClient) {
    const client = await this.getClient(providedClient);
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

    const client = await this.getClient(providedClient);
    const userData = await this.getUserData(client);

    const { data, error } = await client
      .from(Tables.GAMES_DATA)
      .select("*")
      .neq("status", "CANCELLED")
      .or(`user_black_id.eq.${userData.id},user_white_id.eq.${userData.id}`)
  
    if (error) throw error;

    const parsedData = z.array(RAW_GAME_SCHEMA).parse(data);

    return { data: parsedData, userData };
  }

  private static async getClient(providedClient?: ProvidedClient) {
    return providedClient ?? (await createClient());
  }
}

export { UserService };
