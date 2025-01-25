import { GameState } from "./definitions";

import { Status } from "./definitions";

function convertTimestampToTime(timestamp: string | number) {
  const date = new Date(+timestamp * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedHours = hours < 10 ? "0" + hours : hours;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  const timeString = `${formattedHours}:${formattedMinutes}`;

  return timeString;
}

function getUserMap(
  userId: string,
  userWhiteId: string | null,
  userBlackId: string | null
) {
  return {
    current: userWhiteId === userId ? userWhiteId : userBlackId,
    opponent: userWhiteId === userId ? userBlackId : userWhiteId,
  };
}


function getUserRole(
  userId: string,
  userWhiteId: string | null,
) {
  return userWhiteId === userId ? "WHITE" : "BLACK";
}

function getNextStatus(gameState: GameState, status: Status): Status {
  if (
    gameState === "CHECKMATE" ||
    gameState === "DRAW" ||
    gameState === "SURRENDER"
  )
    return "FINISHED";

  return status
}

export { convertTimestampToTime, getUserMap, getUserRole, getNextStatus };
