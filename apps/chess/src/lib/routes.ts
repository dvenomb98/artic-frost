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
    INDEX: "/play",
    PLAY: (id: string) => `/play/${id}`,
    LIBRARY: "/library",
    ACCOUNT: "/account",
  },
  DOCUMENTS: {
    INDEX: "/documents",
    PRIVACY_POLICY: "/documents/privacy-policy",
    TERMS_OF_SERVICE: "/documents/terms-of-service",
  },
} as const;

export {ROUTES};
