export type AuthSessionUser = {
  name: string
  email?: string | null
}

export type AuthSession = {
  accessToken: string
  companyId: string | null
  companyName?: string | null
  needsCompanySetup: boolean
  user?: AuthSessionUser | null
}

const AUTH_SESSION_STORAGE_KEY = 'app-auth-session'

function isValidUser(value: unknown): value is AuthSessionUser {
  if (!value || typeof value !== 'object') {
    return false
  }

  const record = value as Record<string, unknown>

  return (
    typeof record.name === 'string' &&
    (typeof record.email === 'string' ||
      typeof record.email === 'undefined' ||
      record.email === null)
  )
}

function isValidSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== 'object') {
    return false
  }

  const record = value as Record<string, unknown>

  return (
    typeof record.accessToken === 'string' &&
    typeof record.needsCompanySetup === 'boolean' &&
    (typeof record.companyId === 'string' || record.companyId === null) &&
    (typeof record.companyName === 'string' ||
      typeof record.companyName === 'undefined' ||
      record.companyName === null) &&
    (typeof record.user === 'undefined' || record.user === null || isValidUser(record.user))
  )
}

function normalizeSession(session: AuthSession): AuthSession {
  return {
    accessToken: session.accessToken,
    companyId: session.companyId,
    companyName: session.companyName ?? null,
    needsCompanySetup: session.needsCompanySetup,
    user: session.user
      ? {
          name: session.user.name,
          email: session.user.email ?? null,
        }
      : null,
  }
}

export function readStoredAuthSession() {
  if (typeof window === 'undefined') {
    return null
  }

  const rawValue = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY)

  if (!rawValue) {
    return null
  }

  try {
    const parsedValue = JSON.parse(rawValue) as unknown

    return isValidSession(parsedValue) ? normalizeSession(parsedValue) : null
  } catch {
    return null
  }
}

export function writeStoredAuthSession(session: AuthSession) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(
    AUTH_SESSION_STORAGE_KEY,
    JSON.stringify(normalizeSession(session)),
  )
}

export function clearStoredAuthSession() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
}

export function getStoredAccessToken() {
  return readStoredAuthSession()?.accessToken ?? null
}
