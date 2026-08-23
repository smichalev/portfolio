import type { Lang } from "@/lib/lang"

/**
 * Backend errors arrive as English machine-readable codes (see
 * backend/src/common/error-codes.ts). The frontend owns localization —
 * this maps each known code to a message in the current UI language.
 */
const ERROR_MESSAGES: Record<string, Record<Lang, string>> = {
  AUTH_INVALID_CREDENTIALS: {
    ru: "Неверный email или пароль",
    en: "Invalid email or password",
  },
  AUTH_EMAIL_ALREADY_REGISTERED: {
    ru: "Этот email уже зарегистрирован",
    en: "This email is already registered",
  },
  AUTH_REFRESH_TOKEN_MISSING: {
    ru: "Сессия истекла — войдите снова",
    en: "Your session has expired — please sign in again",
  },
  AUTH_SESSION_INVALID: {
    ru: "Сессия истекла — войдите снова",
    en: "Your session has expired — please sign in again",
  },
  SKILL_GROUP_NOT_FOUND: {
    ru: "Группа навыков не найдена",
    en: "Skill group not found",
  },
  SKILL_NOT_FOUND: {
    ru: "Навык не найден",
    en: "Skill not found",
  },
  EXPERIENCE_NOT_FOUND: {
    ru: "Запись об опыте работы не найдена",
    en: "Experience entry not found",
  },
  PROFILE_FACT_NOT_FOUND: {
    ru: "Факт не найден",
    en: "Fact not found",
  },
  PROFILE_LANGUAGE_NOT_FOUND: {
    ru: "Язык не найден",
    en: "Language not found",
  },
  NETWORK_ERROR: {
    ru: "Не удалось подключиться к серверу",
    en: "Could not connect to the server",
  },
  // Framework-level messages thrown by Passport guards before request
  // reaches our own code (missing/invalid/expired token) — already
  // English by default, just given proper translations here too.
  Unauthorized: {
    ru: "Сессия истекла — войдите снова",
    en: "Your session has expired — please sign in again",
  },
  Forbidden: {
    ru: "Недостаточно прав для этого действия",
    en: "You don't have permission to do this",
  },
}

const FALLBACK_MESSAGE: Record<Lang, string> = {
  ru: "Что-то пошло не так. Попробуйте ещё раз.",
  en: "Something went wrong. Please try again.",
}

export function translateError(code: unknown, lang: Lang): string {
  if (typeof code === "string" && code in ERROR_MESSAGES) {
    return ERROR_MESSAGES[code][lang]
  }
  return FALLBACK_MESSAGE[lang]
}
