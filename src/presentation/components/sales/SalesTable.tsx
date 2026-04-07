import type { Sale } from '@domain/entities'

import { SalePaymentBadge } from '@presentation/components/sales/SalePaymentBadge'
import { formatCurrency, formatDateTime } from '@presentation/components/sales/sale-utils'

type SalesTableProps = {
  sales: Sale[]
  isLoading: boolean
  onOpenDetails: (sale: Sale) => void
}

export function SalesTable({ sales, isLoading, onOpenDetails }: SalesTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
        Carregando vendas...
      </div>
    )
  }

  if (!sales.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Nenhuma venda encontrada</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Ajuste os filtros ou realize uma nova venda para popular o historico.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              <th className="px-6 py-4">Venda</th>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Itens</th>
              <th className="px-6 py-4">Pagamento</th>
              <th className="px-6 py-4">Subtotal</th>
              <th className="px-6 py-4">Desconto</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Lucro</th>
              <th className="px-6 py-4 text-right">Acoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sales.map((sale) => (
              <tr key={sale.id} className="text-sm text-slate-600">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-slate-900">{sale.id}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {sale.items[0]?.name ?? 'Sem itens'}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">{formatDateTime(sale.createdAt)}</td>
                <td className="px-6 py-4">{sale.items.length}</td>
                <td className="px-6 py-4">
                  <SalePaymentBadge paymentMethod={sale.paymentMethod} />
                </td>
                <td className="px-6 py-4">{formatCurrency(sale.subtotal)}</td>
                <td className="px-6 py-4">{formatCurrency(sale.discount)}</td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(sale.total)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={sale.profit >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                    {formatCurrency(sale.profit)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => onOpenDetails(sale)}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                      Ver detalhes
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
