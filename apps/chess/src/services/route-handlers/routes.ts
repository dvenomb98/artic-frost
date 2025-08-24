const API_ROUTES = {
  PLAY: {
    GET_MOVES: (id: string) => `/play/${id}/api/get-moves`,
    MAKE_MOVE: (id: string) => `/play/${id}/api/make-move`,
    CREATE_GAME: "/play/api/create-game",
  },
};

export {API_ROUTES};
