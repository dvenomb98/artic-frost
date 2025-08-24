const API_ROUTES = {
  PLAY: {
    GET_MOVES: (id: string) => `/play/${id}/api/get-moves`,
    MAKE_MOVE: (id: string) => `/play/${id}/api/make-move`,
  },
};

export {API_ROUTES};
