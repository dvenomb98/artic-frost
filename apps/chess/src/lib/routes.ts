const ROUTES = {
  INDEX: "/",
  AUTH: {
    INDEX: "/auth",
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",
    UPDATE_PASSWORD: "/update-password",
    FORGOT_PASSWORD: "/forgot-password",
  },
  MAIN: {
    INDEX: "/main",
    HISTORY: "/main/history",
    ANALYTICS: "/main/analytics",
    PLAY: "/main/play",
    REVIEW: "/main/review",
    PROFILE: "/main/profile",
  },
} as const;

export {ROUTES};
