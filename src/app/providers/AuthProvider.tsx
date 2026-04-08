import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import type { SetupCompanyPayload } from '@presentation/pages/setup-company-form-schema'
import { authenticateWithGoogle } from '@shared/api/auth-api'
import { setupInitialCompany } from '@shared/api/companies-api'
import { AUTH_UNAUTHORIZED_EVENT } from '@shared/auth/auth-events'
import {
  clearStoredAuthSession,
  readStoredAuthSession,
  writeStoredAuthSession,
  type AuthSession,
} from '@shared/auth/session'

type AuthStatus = 'guest' | 'onboarding' | 'authenticated'

type AuthContextValue = {
  session: AuthSession | null
  authStatus: AuthStatus
  isAuthenticated: boolean
  needsCompanySetup: boolean
  signInWithGoogle: (idToken: string) => Promise<AuthSession>
  completeCompanySetup: (payload: SetupCompanyPayload) => Promise<AuthSession>
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

type AuthProviderProps = {
  children: ReactNode
}

function resolveAuthStatus(session: AuthSession | null): AuthStatus {
  if (!session?.accessToken) {
    return 'guest'
  }

  return session.needsCompanySetup ? 'onboarding' : 'authenticated'
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(readStoredAuthSession)

  const persistSession = useCallback((nextSession: AuthSession | null) => {
    setSession(nextSession)

    if (nextSession) {
      writeStoredAuthSession(nextSession)
      return
    }

    clearStoredAuthSession()
  }, [])

  useEffect(() => {
    function handleUnauthorized() {
      persistSession(null)
    }

    function handleStorageSync(event: StorageEvent) {
      if (event.key !== 'app-auth-session') {
        return
      }

      setSession(readStoredAuthSession())
    }

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
    window.addEventListener('storage', handleStorageSync)

    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
      window.removeEventListener('storage', handleStorageSync)
    }
  }, [persistSession])

  const signInWithGoogle = useCallback(
    async (idToken: string) => {
      const nextSession = await authenticateWithGoogle(idToken)
      persistSession(nextSession)
      return nextSession
    },
    [persistSession],
  )

  const completeCompanySetup = useCallback(
    async (payload: SetupCompanyPayload) => {
      const nextSession = await setupInitialCompany(payload)
      persistSession(nextSession)
      return nextSession
    },
    [persistSession],
  )

  const signOut = useCallback(() => {
    persistSession(null)
  }, [persistSession])

  const authStatus = useMemo(() => resolveAuthStatus(session), [session])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      authStatus,
      isAuthenticated: authStatus !== 'guest',
      needsCompanySetup: authStatus === 'onboarding',
      signInWithGoogle,
      completeCompanySetup,
      signOut,
    }),
    [session, authStatus, signInWithGoogle, completeCompanySetup, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
