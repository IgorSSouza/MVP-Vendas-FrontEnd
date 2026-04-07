import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { getCurrentYear } from '@shared/utils/get-current-year'
import { AppSidebar } from '@presentation/components/AppSidebar'
import { AppTopbar } from '@presentation/components/AppTopbar'

const SIDEBAR_STORAGE_KEY = 'app-sidebar-collapsed'
const THEME_STORAGE_KEY = 'app-theme'

type ThemeMode = 'light' | 'dark'

export function AppLayout() {
  const location = useLocation()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [themeMode, setThemeMode] = useState<ThemeMode>('light')

  useEffect(() => {
    const savedValue = window.localStorage.getItem(SIDEBAR_STORAGE_KEY)
    setIsSidebarCollapsed(savedValue === 'true')

    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

    if (savedTheme === 'light' || savedTheme === 'dark') {
      setThemeMode(savedTheme)
      return
    }

    setThemeMode(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  }, [])

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isSidebarCollapsed))
  }, [isSidebarCollapsed])

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode)
    document.documentElement.classList.toggle('dark', themeMode === 'dark')
  }, [themeMode])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex min-h-screen w-full">
        <AppSidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed((currentValue) => !currentValue)}
        />

        <div className="flex min-h-screen flex-1 flex-col">
          <AppTopbar
            themeMode={themeMode}
            onToggleTheme={() =>
              setThemeMode((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
            }
          />

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div
              key={location.pathname}
              className="app-route-transition mx-auto w-full max-w-[1680px]"
            >
              <Outlet />
            </div>
          </main>

          <footer className="border-t border-slate-200/80 bg-white/95 px-4 py-4 text-sm text-slate-500 dark:border-slate-800/80 dark:bg-slate-950/95 dark:text-slate-400 sm:px-6 lg:px-8">
            <p>Base inicial do MVP de vendas preparada para evolução gradual. {getCurrentYear()}</p>
          </footer>
        </div>
      </div>
    </div>
  )
}
