import type { DashboardRecentSale } from '@shared/api/dashboard-api'

import { SalePaymentBadge } from '@presentation/components/sales/SalePaymentBadge'
import { formatCurrency, formatDateTime } from '@presentation/components/sales/sale-utils'

type RecentSalesCardProps = {
  sales: DashboardRecentSale[]
}

export function RecentSalesCard({ sales }: RecentSalesCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Vendas recentes</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Ultimas vendas registradas no sistema.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {sales.length ? (
          sales.map((sale) => (
            <article
              key={sale.id}
              className="rounded-2xl border border-slate-200 px-4 py-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-slate-900">{sale.id}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatDateTime(sale.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <SalePaymentBadge paymentMethod={sale.paymentMethod} />
                  <strong className="text-sm text-slate-900">
                    {formatCurrency(sale.total)}
                  </strong>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            Nenhuma venda registrada ate o momento.
          </div>
        )}
      </div>
    </section>
  )
}
