import {DbProfileTableRow} from "../types";
import {User} from "@supabase/supabase-js";
import {UserFlags} from "./types";

/**
 * Generate an profile for a user that is anonymous.
 */
function generateAnonymousProfile(user: User): DbProfileTableRow {
  return {
    id: Date.now() + Math.random(),
    user_id: user.id,
    nickname: "Anonymous",
    avatar_url: null,
    created_at: new Date().toISOString(),
  };
}

/**
 * Generate flags for a user.
 */
function generateUserFlags(user: User): UserFlags {
  return {
    disableEditProfile: user.is_anonymous || false,
  };
}

export {generateAnonymousProfile, generateUserFlags};
