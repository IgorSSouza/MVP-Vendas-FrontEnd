import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '@app/providers/AuthProvider'
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

function UserBadgeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M10 10.25A3.25 3.25 0 1 0 10 3.75A3.25 3.25 0 0 0 10 10.25ZM4.75 16.25A5.25 5.25 0 0 1 15.25 16.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CompanyBadgeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M4.75 16.25V5.25L10.5 3.75V16.25M4.75 16.25H15.25M12.75 16.25V9.75H15.25V16.25"
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
  const navigate = useNavigate()
  const { session, signOut } = useAuth()
  const currentSection = resolveCurrentSection(pathname)

  const userName = session?.user?.name ?? 'Usuário autenticado'
  const userEmail = session?.user?.email ?? null
  const companyName = session?.companyName ?? 'Empresa atual'

  function handleSignOut() {
    signOut()
    navigate(appRoutes.login, { replace: true })
  }

  return (
    <header className="border-b border-slate-200/80 bg-white/95 px-3 py-3 backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-950/95 sm:px-5 sm:py-4 lg:px-6 xl:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
            Painel operacional
          </p>
          <h2 className="mt-2 truncate text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 sm:text-2xl">
            {currentSection.label}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {currentSection.description}
          </p>
        </div>

        <div className="flex flex-col gap-3 xl:items-end">
          <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-end">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/90 px-3 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/70 dark:text-slate-200">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                  <CompanyBadgeIcon />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Empresa
                  </span>
                  <span className="block truncate font-medium text-slate-900 dark:text-slate-100">
                    {companyName}
                  </span>
                </span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/90 px-3 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/70 dark:text-slate-200">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                  <UserBadgeIcon />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium text-slate-900 dark:text-slate-100">
                    {userName}
                  </span>
                  {userEmail ? (
                    <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                      {userEmail}
                    </span>
                  ) : (
                    <span className="block text-xs text-slate-500 dark:text-slate-400">
                      Sessão ativa
                    </span>
                  )}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={onToggleTheme}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-300/80 bg-white text-slate-700 shadow-sm transition hover:border-slate-400/70 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:focus:ring-slate-700/50"
                aria-label={themeMode === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
                title={themeMode === 'dark' ? 'Tema claro' : 'Tema escuro'}
              >
                {themeMode === 'dark' ? <SunIcon /> : <MoonIcon />}
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="app-button-secondary min-w-0 rounded-xl px-4 py-2 text-center"
              >
                Sair
              </button>

              <Link
                to={appRoutes.sales}
                className="app-button-secondary min-w-0 rounded-xl px-4 py-2 text-center"
              >
                Ver vendas
              </Link>

              <Link
                to={appRoutes.newSale}
                className="app-button-primary min-w-0 rounded-xl px-4 py-2 text-center"
              >
                Nova venda
              </Link>
            </div>
          </div>
        </div>
      </div>

      <nav className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 lg:hidden">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === appRoutes.sales || item.to === appRoutes.newSale}
            className={({ isActive }) =>
              [
                'shrink-0 rounded-full border px-3 py-2 text-sm font-medium transition shadow-sm',
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
