import { NavLink } from 'react-router-dom'

import { navigationItems } from '@shared/constants/app-routes'

export function AppSidebar() {
  return (
    <aside className="hidden w-72 border-r border-slate-200 bg-slate-950 text-slate-100 lg:flex lg:flex-col">
      <div className="border-b border-white/10 px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300">
          Loja Tech
        </p>
        <h1 className="mt-3 text-xl font-semibold text-white">MVP de vendas</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Estrutura inicial para vendas, servicos e operacao da loja.
        </p>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-5">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                'block rounded-2xl border px-4 py-3 transition',
                isActive
                  ? 'border-cyan-400/40 bg-cyan-400/10 text-white'
                  : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white',
              ].join(' ')
            }
          >
            <p className="text-sm font-medium">{item.label}</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">{item.description}</p>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
