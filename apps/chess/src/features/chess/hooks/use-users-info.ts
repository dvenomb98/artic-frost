import {use, useEffect, useState} from "react";
import {useChessManager} from "../context/chess-state-manager";
import {toast} from "sonner";
import {ClientUserService} from "@/services/supabase/api/client/user";
import {getUserMap} from "../store/utils";
import {formatUserDisplayName} from "@/lib/formatters";
import {UserClientContext} from "@/features/auth/providers/user-client-provider";
import {ENGINE_VERSION} from "@/services/stockfish/config";

const DISPLAY_NAME_FALLBACK = "...";
const ENGINE_DISPLAY_NAME = `Engine ${ENGINE_VERSION}`;

type UserInfo = {
  displayName: string;
};

type UsersInfo = {
  current: UserInfo;
  opponent: UserInfo;
};

function useUsersInfo() {
  const {profile, loading} = use(UserClientContext);

  const {
    state: {currentUserId, userWhiteId, userBlackId, type},
  } = useChessManager();

  const [usersInfo, setUsersInfo] = useState<UsersInfo>({
    current: {
      displayName: DISPLAY_NAME_FALLBACK,
    },
    opponent: {
      displayName:
        type === "engine" ? ENGINE_DISPLAY_NAME : DISPLAY_NAME_FALLBACK,
    },
  });

  useEffect(() => {
    if (loading) return;

    setUsersInfo(prev => ({
      ...prev,
      current: {
        displayName: formatUserDisplayName(currentUserId, profile),
      },
    }));
  }, [loading, profile, currentUserId]);

  useEffect(() => {
    if (type === "engine") return;
    if (usersInfo.opponent.displayName !== DISPLAY_NAME_FALLBACK) return;

    const usersMap = getUserMap(currentUserId, userWhiteId, userBlackId);

    async function getOpponentInfo() {
      if (!usersMap.opponent) return;

      try {
        const opponentProfile = await ClientUserService.getUserProfile(
          usersMap.opponent
        );

        console.log(opponentProfile, "opponentProfile");

        setUsersInfo(prev => ({
          ...prev,
          opponent: {
            displayName: formatUserDisplayName(
              opponentProfile.id,
              opponentProfile
            ),
          },
        }));
      } catch (e) {
        toast.error("Failed to fetch opponent info.");
      }
    }

    getOpponentInfo();
  }, [currentUserId, userWhiteId, userBlackId]);

  return {
    usersInfo,
  };
}

export {useUsersInfo, type UsersInfo, type UserInfo};
