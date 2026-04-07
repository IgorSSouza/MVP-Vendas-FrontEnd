import { Outlet } from 'react-router-dom'

import { getCurrentYear } from '@shared/utils/get-current-year'
import { AppSidebar } from '@presentation/components/AppSidebar'
import { AppTopbar } from '@presentation/components/AppTopbar'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-screen-2xl">
        <AppSidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <AppTopbar />

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>

          <footer className="border-t border-slate-200 bg-white px-4 py-4 text-sm text-slate-500 sm:px-6 lg:px-8">
            <p>Base inicial do MVP de vendas preparada para evolucao gradual. {getCurrentYear()}</p>
          </footer>
        </div>
      </div>
    </div>
  )
}
