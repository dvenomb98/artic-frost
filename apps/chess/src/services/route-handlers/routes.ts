const API_ROUTES = {
  PLAY: {
    GET_MOVES: (id: string) => `/play/${id}/api/get-moves`,
    MAKE_MOVE: (id: string) => `/play/${id}/api/make-move`,
    SURRENDER: (id: string) => `/play/${id}/api/surrender`,
    CREATE_GAME: "/play/api/create-game",
  },
  SHARED: {
    SAVE_POSITION: "/api/save-position",
  },
};

export {API_ROUTES};
