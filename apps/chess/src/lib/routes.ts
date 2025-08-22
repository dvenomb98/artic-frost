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
    INDEX: "/app",
    HISTORY: "/app/history",
    ANALYTICS: "/app/analytics",
    PLAY: "/app/play",
    REVIEW: "/app/review",
    PROFILE: "/app/profile",
  },
} as const;

export {ROUTES};
