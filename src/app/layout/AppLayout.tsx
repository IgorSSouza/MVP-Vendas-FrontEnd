import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { getCurrentYear } from '@shared/utils/get-current-year'
import { AppSidebar } from '@presentation/components/AppSidebar'
import { AppTopbar } from '@presentation/components/AppTopbar'

const SIDEBAR_STORAGE_KEY = 'app-sidebar-collapsed'

export function AppLayout() {
  const location = useLocation()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  useEffect(() => {
    const savedValue = window.localStorage.getItem(SIDEBAR_STORAGE_KEY)
    setIsSidebarCollapsed(savedValue === 'true')
  }, [])

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isSidebarCollapsed))
  }, [isSidebarCollapsed])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen w-full">
        <AppSidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed((currentValue) => !currentValue)}
        />

        <div className="flex min-h-screen flex-1 flex-col">
          <AppTopbar />

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div
              key={location.pathname}
              className="app-route-transition mx-auto w-full max-w-[1680px]"
            >
              <Outlet />
            </div>
          </main>

          <footer className="border-t border-slate-200/80 bg-white/95 px-4 py-4 text-sm text-slate-500 sm:px-6 lg:px-8">
            <p>Base inicial do MVP de vendas preparada para evolucao gradual. {getCurrentYear()}</p>
          </footer>
        </div>
      </div>
    </div>
  )
}
