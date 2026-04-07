import { Link, NavLink, useLocation } from 'react-router-dom'

import { appRoutes, navigationItems } from '@shared/constants/app-routes'

function resolveCurrentSection(pathname: string) {
  return (
    navigationItems.find((item) =>
      item.to === appRoutes.sales ? pathname === item.to : pathname.startsWith(item.to),
    ) ?? navigationItems[0]
  )
}

export function AppTopbar() {
  const { pathname } = useLocation()
  const currentSection = resolveCurrentSection(pathname)

  return (
    <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            Painel operacional
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            {currentSection.label}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{currentSection.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={appRoutes.sales}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Ver vendas
          </Link>

          <Link
            to={appRoutes.newSale}
            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Nova venda
          </Link>
        </div>
      </div>

      <nav className="mt-4 flex flex-wrap gap-2 lg:hidden">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                'rounded-full border px-3 py-2 text-sm font-medium transition',
                isActive
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50',
              ].join(' ')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
