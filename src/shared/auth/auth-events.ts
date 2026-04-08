export const AUTH_UNAUTHORIZED_EVENT = 'app-auth-unauthorized'

export function dispatchUnauthorizedAuthEvent() {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT))
}
