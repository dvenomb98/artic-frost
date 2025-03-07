import {ProfileSchemaExtended} from "@/services/supabase/models";

function formatUserId(id: string) {
  return id.slice(0, 6);
}

function formatUserDisplayName(
  id: string,
  profile: ProfileSchemaExtended | null
) {
  if (!profile) {
    return formatUserId(id);
  }
  if (profile.isAnonymous) {
    return "Guest_" + formatUserId(id);
  }

  if (profile.username) {
    return profile.username;
  }

  return "User_" + formatUserId(id);
}

export {formatUserDisplayName, formatUserId};
