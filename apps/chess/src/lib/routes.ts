const ROUTES = {
  INDEX: "/",
  AUTH: {
    INDEX: "/auth",
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",
    UPDATE_PASSWORD: "/update-password",
    FORGOT_PASSWORD: "/forgot-password",
  },
  APP: {
    INDEX: "/dashboard",
    PLAY: (id: string) => `/play/${id}`,
  },
} as const;

export {ROUTES};
