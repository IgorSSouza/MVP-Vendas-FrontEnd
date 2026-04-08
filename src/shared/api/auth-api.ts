import { httpRequest } from '@shared/api/http-client'
import type { AuthSession } from '@shared/auth/session'

type GoogleAuthRequest = {
  idToken: string
}

export async function authenticateWithGoogle(idToken: string) {
  return httpRequest<AuthSession>('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({
      idToken,
    } satisfies GoogleAuthRequest),
  })
}
