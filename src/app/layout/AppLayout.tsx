import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { AppSidebar } from '@presentation/components/AppSidebar'
import { AppTopbar } from '@presentation/components/AppTopbar'
import {
  applyThemeMode,
  getStoredThemeMode,
  type ThemeMode,
} from '@shared/theme/theme-mode'
import { getCurrentYear } from '@shared/utils/get-current-year'

const SIDEBAR_STORAGE_KEY = 'app-sidebar-collapsed'

function getInitialSidebarState() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true'
}

export function AppLayout() {
  const location = useLocation()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(getInitialSidebarState)
  const [themeMode, setThemeMode] = useState<ThemeMode>(getStoredThemeMode)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isSidebarCollapsed))
  }, [isSidebarCollapsed])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem('app-theme', themeMode)
    applyThemeMode(themeMode)
  }, [themeMode])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex min-h-screen w-full">
        <AppSidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed((currentValue) => !currentValue)}
          themeMode={themeMode}
          onToggleTheme={() =>
            setThemeMode((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
          }
        />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <AppTopbar />

          <main className="flex-1 px-3 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6 xl:px-8">
            <div
              key={location.pathname}
              className="app-route-transition mx-auto w-full max-w-[1680px]"
            >
              <Outlet />
            </div>
          </main>

          <footer className="border-t border-slate-200/80 bg-white/95 px-3 py-4 text-sm text-slate-500 dark:border-slate-800/80 dark:bg-slate-950/95 dark:text-slate-400 sm:px-5 lg:px-6 xl:px-8">
            <p className="leading-6">
              Base inicial do MVP de vendas preparada para evolução gradual. {getCurrentYear()}
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}
