import type { DashboardPaymentSummaryItem } from '@shared/api/dashboard-api'
import { formatCurrency, getPaymentMethodLabel } from '@presentation/components/sales/sale-utils'

type PaymentSummaryCardProps = {
  items: DashboardPaymentSummaryItem[]
}

export function PaymentSummaryCard({ items }: PaymentSummaryCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Vendas por pagamento</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Distribuicao atual das vendas por forma de pagamento.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div
            key={item.paymentMethod}
            className="flex flex-col gap-3 rounded-2xl border border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-slate-900">
                {getPaymentMethodLabel(item.paymentMethod)}
              </p>
              <p className="mt-1 text-sm text-slate-500">{item.count} venda(s)</p>
            </div>

            <strong className="text-sm text-slate-900 sm:text-right">
              {formatCurrency(item.total)}
            </strong>
          </div>
        ))}
      </div>
    </section>
  )
}
