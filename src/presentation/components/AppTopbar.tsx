import { Link, NavLink, useLocation } from 'react-router-dom'

import { useAuth } from '@app/providers/AuthProvider'
import { appRoutes, navigationItems } from '@shared/constants/app-routes'

type AppTopbarProps = {}

function resolveCurrentSection(pathname: string) {
  return (
    navigationItems.find((item) =>
      item.to === appRoutes.sales ? pathname === item.to : pathname.startsWith(item.to),
    ) ?? navigationItems[0]
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

export function AppTopbar(_props: AppTopbarProps) {
  const { pathname } = useLocation()
  const { session } = useAuth()
  const currentSection = resolveCurrentSection(pathname)

  const userName = session?.user?.name ?? 'Usuário autenticado'
  const userEmail = session?.user?.email ?? null
  const companyName = session?.companyName ?? 'Empresa atual'

  return (
    <header className="border-b border-slate-200/80 bg-white/95 px-3 py-3 backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-950/95 sm:px-5 sm:py-4 lg:px-6 xl:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
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

        <div className="flex w-full flex-col gap-3 xl:max-w-[700px] xl:items-end">
          <div className="grid gap-2 sm:grid-cols-2 xl:min-w-[420px] xl:max-w-[460px]">
            <div className="inline-flex min-w-0 items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/90 px-3 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/70 dark:text-slate-200">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
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

            <div className="inline-flex min-w-0 items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/90 px-3 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/70 dark:text-slate-200">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                <UserBadgeIcon />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-medium text-slate-900 dark:text-slate-100">
                  {userName}
                </span>
                <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                  {userEmail ?? 'Sessão ativa'}
                </span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-start gap-2 xl:justify-end">
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
