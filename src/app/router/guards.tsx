import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '@app/providers/AuthProvider'
import { appRoutes } from '@shared/constants/app-routes'

type GuardProps = {
  children: ReactNode
}

export function RootRedirect() {
  const { authStatus } = useAuth()

  if (authStatus === 'guest') {
    return <Navigate to={appRoutes.login} replace />
  }

  return (
    <Navigate
      to={authStatus === 'onboarding' ? appRoutes.setupCompany : appRoutes.dashboard}
      replace
    />
  )
}

export function RequireGuest({ children }: GuardProps) {
  const { authStatus } = useAuth()

  if (authStatus === 'onboarding') {
    return <Navigate to={appRoutes.setupCompany} replace />
  }

  if (authStatus === 'authenticated') {
    return <Navigate to={appRoutes.dashboard} replace />
  }

  return <>{children}</>
}

export function RequireAuth({ children }: GuardProps) {
  const location = useLocation()
  const { authStatus } = useAuth()

  if (authStatus === 'guest') {
    return <Navigate to={appRoutes.login} replace state={{ from: location }} />
  }

  if (authStatus === 'onboarding') {
    return <Navigate to={appRoutes.setupCompany} replace />
  }

  return <>{children}</>
}

export function RequireCompanySetup({ children }: GuardProps) {
  const location = useLocation()
  const { authStatus } = useAuth()

  if (authStatus === 'guest') {
    return <Navigate to={appRoutes.login} replace state={{ from: location }} />
  }

  if (authStatus === 'authenticated') {
    return <Navigate to={appRoutes.dashboard} replace />
  }

  return <>{children}</>
}
