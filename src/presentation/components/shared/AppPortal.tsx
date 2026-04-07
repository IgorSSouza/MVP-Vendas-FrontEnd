import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

type AppPortalProps = {
  children: ReactNode
}

export function AppPortal({ children }: AppPortalProps) {
  if (typeof document === 'undefined') {
    return null
  }

  return createPortal(children, document.body)
}
