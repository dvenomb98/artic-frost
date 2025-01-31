import { createClient } from "../../client";
import {
  PROFILE_SCHEMA,
  ProfileSchemaExtended,
  ProvidedClient,
} from "../../models";
import { Tables } from "../../tables";

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

    const client = this.getClient(providedClient);

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
          avatar_url: null,
          full_name: null,
        };

    return profileData;
  }

  private static getClient(providedClient?: ProvidedClient) {
    return providedClient ?? createClient();
  }
}

export { ClientUserService };
