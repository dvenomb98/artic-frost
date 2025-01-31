import "server-only";

import { createClient } from "../../server";
import {
  PROFILE_SCHEMA,
  ProfileSchema,
  ProfileSchemaExtended,
  ProvidedClient,
} from "../../models";
import { Tables } from "../../tables";

class UserService {
  /**
   *
   * Get user authentication data from supabase-auth-db
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
   * Get user profile data from PROFILE table
   * Profiles are public, so we cant access a different user's profile if needed
   * Profile dont contain any sensitive data!
   *
   **/
  public static async getUserProfile(
    targetId?: string,
    providedClient?: ProvidedClient
  ): Promise<ProfileSchemaExtended> {
    let userId = targetId;

    const client = await this.getClient(providedClient);

    if (!userId) {
      const userData = await this.getUserData(providedClient);
      userId = userData.id;
    }

    const { data: userProfile, error } = await client
      .from(Tables.PROFILE)
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw error;

    const profileData = userProfile
      ? { ...PROFILE_SCHEMA.parse(userProfile), isAnonymous: false }
      : {
          id: userId,
          isAnonymous: true,
          username: null,
          full_name: null,
          avatar_url: null,
        };

    return profileData;
  }

  /**
   *
   * Upsert user profile data in PROFILE table
   *
   **/
  public static async updateUserProfile(
    profileData: ProfileSchema,
    providedClient?: ProvidedClient
  ) {
    const client = await this.getClient(providedClient);
    const userData = await this.getUserData(providedClient);

    const { error } = await client
      .from(Tables.PROFILE)
      .update(profileData)
      .eq("id", userData.id);
    if (error) throw error;
  }

  private static async getClient(providedClient?: ProvidedClient) {
    return providedClient ?? (await createClient());
  }
}

export { UserService };
