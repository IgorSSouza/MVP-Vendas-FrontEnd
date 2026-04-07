import { Link, NavLink, useLocation } from 'react-router-dom'

import { appRoutes, navigationItems } from '@shared/constants/app-routes'

type AppTopbarProps = {
  themeMode: 'light' | 'dark'
  onToggleTheme: () => void
}

function resolveCurrentSection(pathname: string) {
  return (
    navigationItems.find((item) =>
      item.to === appRoutes.sales ? pathname === item.to : pathname.startsWith(item.to),
    ) ?? navigationItems[0]
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M10 3V5.25M10 14.75V17M5.05 5.05L6.65 6.65M13.35 13.35L14.95 14.95M3 10H5.25M14.75 10H17M5.05 14.95L6.65 13.35M13.35 6.65L14.95 5.05M13 10A3 3 0 1 1 7 10A3 3 0 0 1 13 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M15.25 11.9A6.75 6.75 0 0 1 8.1 4.75A6.75 6.75 0 1 0 15.25 11.9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function AppTopbar({ themeMode, onToggleTheme }: AppTopbarProps) {
  const { pathname } = useLocation()
  const currentSection = resolveCurrentSection(pathname)

  return (
    <header className="border-b border-slate-200/80 bg-white/95 px-4 py-4 backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-950/95 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
            Painel operacional
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            {currentSection.label}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {currentSection.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-300/80 bg-white text-slate-700 shadow-sm transition hover:border-slate-400/70 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:focus:ring-slate-700/50"
            aria-label={themeMode === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
            title={themeMode === 'dark' ? 'Tema claro' : 'Tema escuro'}
          >
            {themeMode === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          <Link to={appRoutes.sales} className="app-button-secondary rounded-xl px-4 py-2">
            Ver vendas
          </Link>

          <Link to={appRoutes.newSale} className="app-button-primary rounded-xl px-4 py-2">
            Nova venda
          </Link>
        </div>
      </div>

      <nav className="mt-4 flex flex-wrap gap-2 lg:hidden">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === appRoutes.sales || item.to === appRoutes.newSale}
            className={({ isActive }) =>
              [
                'rounded-full border px-3 py-2 text-sm font-medium transition shadow-sm',
                isActive
                  ? 'border-slate-900 bg-slate-900 text-white dark:border-cyan-500 dark:bg-cyan-500 dark:text-slate-950'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
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
