import type { DashboardPaymentSummaryItem } from '@shared/api/dashboard-api'

import { formatCurrency, getPaymentMethodLabel } from '@presentation/components/sales/sale-utils'

type PaymentSummaryCardProps = {
  items: DashboardPaymentSummaryItem[]
  periodLabel: string
}

export function PaymentSummaryCard({
  items,
  periodLabel,
}: PaymentSummaryCardProps) {
  const maxTotal = Math.max(...items.map((item) => item.total), 0)

  return (
    <section className="app-surface p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-700/80 dark:text-cyan-300/80">
            Gráfico
          </p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Receita por pagamento
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Comparativo simples da receita acumulada por forma de pagamento em {periodLabel.toLowerCase()}.
          </p>
        </div>

        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          Baseada no histórico filtrado
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {items.length ? (
          items.map((item) => {
            const width = maxTotal > 0 ? `${Math.max((item.total / maxTotal) * 100, 12)}%` : '0%'

            return (
              <div key={item.paymentMethod} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                      {getPaymentMethodLabel(item.paymentMethod)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.count} venda(s)
                    </p>
                  </div>

                  <strong className="shrink-0 text-sm text-slate-900 dark:text-slate-100">
                    {formatCurrency(item.total)}
                  </strong>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-cyan-500 shadow-sm shadow-cyan-500/30 transition-[width] duration-300 dark:bg-cyan-400"
                    style={{ width }}
                  />
                </div>
              </div>
            )
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
            Nenhuma venda encontrada no período selecionado para gerar o gráfico.
          </div>
        )}
      </div>
    </section>
  )
}
