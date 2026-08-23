/**
 * Machine-readable error codes returned as GraphQL error messages.
 * The backend never localizes error text — clients map these codes
 * to a message in the user's language themselves.
 */
export const ErrorCode = {
  AUTH_EMAIL_ALREADY_REGISTERED: "AUTH_EMAIL_ALREADY_REGISTERED",
  AUTH_INVALID_CREDENTIALS: "AUTH_INVALID_CREDENTIALS",
  AUTH_REFRESH_TOKEN_MISSING: "AUTH_REFRESH_TOKEN_MISSING",
  AUTH_SESSION_INVALID: "AUTH_SESSION_INVALID",

  SKILL_GROUP_NOT_FOUND: "SKILL_GROUP_NOT_FOUND",
  SKILL_NOT_FOUND: "SKILL_NOT_FOUND",

  EXPERIENCE_NOT_FOUND: "EXPERIENCE_NOT_FOUND",

  PROFILE_FACT_NOT_FOUND: "PROFILE_FACT_NOT_FOUND",
  PROFILE_LANGUAGE_NOT_FOUND: "PROFILE_LANGUAGE_NOT_FOUND",
} as const

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode]
