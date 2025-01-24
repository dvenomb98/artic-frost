import "server-only";

import { createClient } from "../../server";
import { Tables } from "../../tables";
import { ProvidedClient, USER_GAMES_SCHEMA } from "../../models";
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
      .from(Tables.USER_GAMES_HISTORY)
      .select("game_id")
      .eq("user_id", userData.id)
      .returns<unknown[]>();

    if (error) throw error;

    const parsedData = z.array(USER_GAMES_SCHEMA).parse(data);

    return { data: parsedData, userData };
  }

  private static async getClient(providedClient?: ProvidedClient) {
    return providedClient ?? (await createClient());
  }
}

export { UserService };
