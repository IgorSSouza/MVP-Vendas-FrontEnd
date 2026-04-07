import type { DashboardRecentSale } from '@shared/api/dashboard-api'

import { formatCurrency, formatDateTime } from '@presentation/components/sales/sale-utils'
import { SalePaymentBadge } from '@presentation/components/sales/SalePaymentBadge'

type RecentSalesCardProps = {
  sales: DashboardRecentSale[]
}

export function RecentSalesCard({ sales }: RecentSalesCardProps) {
  return (
    <section className="app-surface p-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Vendas recentes</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Últimas vendas registradas no sistema.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {sales.length ? (
          sales.map((sale) => (
            <article
              key={sale.id}
              className="rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/40"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{sale.id}</p>
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
            Nenhuma venda registrada até o momento.
          </div>
        )}
      </div>
    </section>
  )
}
