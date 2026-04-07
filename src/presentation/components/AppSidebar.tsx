import { NavLink } from 'react-router-dom'

import { appBrand } from '@shared/constants/app-brand'
import { appRoutes, navigationItems } from '@shared/constants/app-routes'

type AppSidebarProps = {
  isCollapsed: boolean
  onToggle: () => void
}

type SidebarIconProps = {
  className?: string
}

function SidebarToggleIcon({ className = '' }: SidebarIconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 5H14M6 10H14M6 15H14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

function DashboardIcon({ className = '' }: SidebarIconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 4.75H8.25V9H4V4.75ZM11.75 4.75H16V11H11.75V4.75ZM4 11H8.25V16H4V11ZM11.75 13H16V16H11.75V13Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BoxIcon({ className = '' }: SidebarIconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M10 3.5L15.5 6.5V13.5L10 16.5L4.5 13.5V6.5L10 3.5ZM10 3.5V9.5M15.5 6.5L10 9.5L4.5 6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function WrenchIcon({ className = '' }: SidebarIconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M12.9 4.3A3.35 3.35 0 0 0 8.3 8.9L4.6 12.6A1.5 1.5 0 1 0 6.7 14.7L10.4 11A3.35 3.35 0 0 0 15 6.4L12.6 8.1L11 6.5L12.9 4.3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ReceiptIcon({ className = '' }: SidebarIconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 4H14V16L12 14.7L10 16L8 14.7L6 16V4ZM8 7.25H12M8 10.25H12M8 13.25H11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PlusCircleIcon({ className = '' }: SidebarIconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M10 6.25V13.75M6.25 10H13.75M17 10A7 7 0 1 1 3 10A7 7 0 0 1 17 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const navigationIcons = {
  Dashboard: DashboardIcon,
  Produtos: BoxIcon,
  Serviços: WrenchIcon,
  Vendas: ReceiptIcon,
  'Nova venda': PlusCircleIcon,
} as const

export function AppSidebar({ isCollapsed, onToggle }: AppSidebarProps) {
  return (
    <aside
      className={[
        'hidden shrink-0 border-r border-slate-900/80 bg-slate-950 text-slate-100 transition-[width] duration-200 ease-out lg:flex lg:flex-col',
        isCollapsed ? 'w-24' : 'w-72',
      ].join(' ')}
    >
      <div className="border-b border-white/10 px-4 py-5">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={onToggle}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-slate-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-4 focus:ring-white/10"
              aria-label="Expandir menu lateral"
              title="Expandir"
            >
              <SidebarToggleIcon className="h-4 w-4 rotate-180 transition-transform duration-200" />
            </button>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-200 shadow-sm shadow-cyan-950/20">
              <span className="text-sm font-semibold tracking-[0.16em]">
                {appBrand.shortName}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-200 shadow-sm shadow-cyan-950/20">
                <span className="text-sm font-semibold tracking-[0.16em]">
                  {appBrand.shortName}
                </span>
              </div>

              <div className="ml-3 min-w-0 overflow-hidden transition-all duration-200">
                <p className="truncate text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/90">
                  {appBrand.clientName}
                </p>
                <h1 className="mt-2 truncate text-lg font-semibold tracking-tight text-white">
                  {appBrand.systemName}
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggle}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-4 focus:ring-white/10"
              aria-label="Recolher menu lateral"
              title="Recolher"
            >
              <SidebarToggleIcon className="h-4 w-4 transition-transform duration-200" />
            </button>
          </div>
        )}

      </div>

      <nav className="flex-1 space-y-2.5 px-3 py-5">
        {navigationItems.map((item) => {
          const Icon = navigationIcons[item.label]

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === appRoutes.sales || item.to === appRoutes.newSale}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                [
                  'group relative flex min-h-[66px] items-center rounded-2xl border py-3 transition duration-150 focus:outline-none',
                  isCollapsed ? 'justify-center px-0' : 'gap-3 px-3.5',
                  isActive
                    ? 'border-cyan-400/25 bg-cyan-400/10 text-white shadow-sm shadow-cyan-950/15'
                    : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <span className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-cyan-300" />
                  ) : null}

                  <span
                    className={[
                      'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition',
                      isActive
                        ? 'border-cyan-300/20 bg-cyan-300/10 text-cyan-100'
                        : 'border-white/10 bg-white/[0.04] text-slate-300 group-hover:border-white/15 group-hover:bg-white/[0.07] group-hover:text-white',
                    ].join(' ')}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>

                  <div
                    className={[
                      'min-w-0 overflow-hidden transition-all duration-200',
                      isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100',
                    ].join(' ')}
                  >
                    <p className="truncate text-sm font-medium">{item.label}</p>
                    <p className="mt-1 truncate text-xs leading-5 text-slate-400/90">
                      {item.description}
                    </p>
                  </div>
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-white/10 px-3 py-4">
        <div
          className={[
            'rounded-2xl border border-white/10 bg-white/[0.04] transition-all duration-200',
            isCollapsed ? 'px-2 py-3 text-center' : 'px-3 py-3',
          ].join(' ')}
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            {isCollapsed ? 'ERP' : 'Ambiente local'}
          </p>
          <p
            className={[
              'mt-2 text-sm leading-6 text-slate-400 transition-all duration-200',
              isCollapsed ? 'mx-auto w-10 truncate' : 'block',
            ].join(' ')}
          >
            {isCollapsed ? 'API' : 'Sistema integrado com a API para operação e acompanhamento.'}
          </p>
        </div>
      </div>
    </aside>
  )
}
