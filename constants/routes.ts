export const API_ROUTES = {
  AUTH: {
    SIGN_UP: "/api/auth/sign-up",
    SIGN_IN: "/api/auth/sign-in",
    SIGN_OUT: "/api/auth/sign-out",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
  },
  DOCUMENTS: {
    CREATE: "/api/documents",
    UPDATE: "/api/documents/:id",
    DELETE: "/api/documents/:id",
    JOIN: "/api/documents/:id/join",
    COLLABORATORS: {
      LIST: "/api/documents/:id/collaborators",
      ADD: "/api/documents/:id/collaborators",
      REMOVE: "/api/documents/:id/collaborators",
    },
  },
  USER: {
    DOCUMENTS: "/api/user/documents",
    PROFILE: "/api/user/profile",
    CURRENT: "/api/user",
  },
} as const;
