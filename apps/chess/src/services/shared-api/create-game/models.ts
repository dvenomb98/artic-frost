import {z} from "zod/v4";

const CREATE_GAME_REQUEST = z.object({
  color: z.enum(["white_player", "black_player"]),
});

type CreateGameRequest = z.infer<typeof CREATE_GAME_REQUEST>;

type CreateGameResponse = {
  id: string;
};

export {type CreateGameResponse, type CreateGameRequest, CREATE_GAME_REQUEST};
