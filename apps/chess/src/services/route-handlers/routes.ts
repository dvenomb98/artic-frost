const API_ROUTES = {
  PLAY: {
    GET_MOVES: (id: string) => `/play/${id}/api/get-moves`,
    MAKE_MOVE: (id: string) => `/play/${id}/api/make-move`,
    SURRENDER: (id: string) => `/play/${id}/api/surrender`,
  },
  LIBRARY: {
    DELETE_SAVE: "/library/api/delete-save",
  },
  SHARED: {
    SAVE_POSITION: "/api/save-position",
    EDIT_POSITION: "/api/edit-position",
    CREATE_GAME: "/api/create-game",
  },
};

export {API_ROUTES};
