import "server-only";

import {createClient} from "../../server";
import {ProvidedClient} from "../../models";

class AuthService {
  public static async signInAnonymously(providedClient?: ProvidedClient) {
    const client = await this.getClient(providedClient);
    const {error} = await client.auth.signInAnonymously();
    if (error) throw error;
  }

  public static async signOut(providedClient?: ProvidedClient) {
    const client = await this.getClient(providedClient);
    const {error} = await client.auth.signOut();
    if (error) throw error;
  }

  public static async signIn(
    email: string,
    password: string,
    providedClient?: ProvidedClient
  ) {
    const client = await this.getClient(providedClient);
    const {error} = await client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }

  public static async signUp(
    email: string,
    password: string,
    providedClient?: ProvidedClient
  ) {
    const client = await this.getClient(providedClient);
    const {data, error} = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://chess.danielbilek.com",
      },
    });
    if (error) throw error;
    return data;
  }

  public static async resetPassword(
    email: string,
    providedClient?: ProvidedClient
  ) {
    const client = await this.getClient(providedClient);
    const {error} = await client.auth.resetPasswordForEmail(email, {
      redirectTo:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://chess.danielbilek.com",
    });
    if (error) throw error;
  }

  public static async updatePassword(
    newPassword: string,
    providedClient?: ProvidedClient
  ) {
    const client = await this.getClient(providedClient);
    const {error} = await client.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  }

  private static async getClient(providedClient?: ProvidedClient) {
    return providedClient ?? (await createClient());
  }
}

export {AuthService};
