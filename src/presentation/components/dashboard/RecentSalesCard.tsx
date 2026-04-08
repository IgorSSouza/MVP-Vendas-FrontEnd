import type { DashboardRecentSale } from '@shared/api/dashboard-api'

import { formatCurrency, formatDateTime } from '@presentation/components/sales/sale-utils'
import { SalePaymentBadge } from '@presentation/components/sales/SalePaymentBadge'

type RecentSalesCardProps = {
  sales: DashboardRecentSale[]
  periodLabel: string
}

export function RecentSalesCard({ sales, periodLabel }: RecentSalesCardProps) {
  return (
    <section className="app-surface p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500 dark:text-slate-400">
            Histórico recente
          </p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Últimas vendas do período
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Visualize rapidamente as vendas mais recentes registradas em {periodLabel.toLowerCase()}.
          </p>
        </div>

        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          {sales.length} registro(s)
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {sales.length ? (
          sales.map((sale) => (
            <article
              key={sale.id}
              className="rounded-2xl border border-slate-200 px-4 py-4 transition hover:border-slate-300 hover:bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-slate-700 dark:hover:bg-slate-900/60"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900 dark:text-slate-100">{sale.id}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {formatDateTime(sale.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <SalePaymentBadge paymentMethod={sale.paymentMethod} />
                  <strong className="text-sm text-slate-900 dark:text-slate-100">
                    {formatCurrency(sale.total)}
                  </strong>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
            Nenhuma venda encontrada no período selecionado.
          </div>
        )}
      </div>
    </section>
  )
}
