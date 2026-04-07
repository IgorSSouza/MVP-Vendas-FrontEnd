import type { SaleListItem } from '@shared/api/sales-api'

import { SalePaymentBadge } from '@presentation/components/sales/SalePaymentBadge'
import { formatCurrency, formatDateTime } from '@presentation/components/sales/sale-utils'

type SalesTableProps = {
  sales: SaleListItem[]
  isLoading: boolean
  onOpenDetails: (sale: SaleListItem) => void
}

export function SalesTable({ sales, isLoading, onOpenDetails }: SalesTableProps) {
  if (isLoading) {
    return (
      <div className="app-empty-state text-sm text-slate-500">
        Carregando vendas...
      </div>
    )
  }

  if (!sales.length) {
    return (
      <div className="app-empty-state">
        <h3 className="text-lg font-semibold text-slate-900">Nenhuma venda encontrada</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Ajuste os filtros ou realize uma nova venda para popular o histórico.
        </p>
      </div>
    )
  }

  return (
    <div className="app-table-shell">
      <div className="overflow-x-auto">
        <table className="app-table">
          <thead>
            <tr>
              <th className="px-6 py-4">Venda</th>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Itens</th>
              <th className="px-6 py-4">Pagamento</th>
              <th className="px-6 py-4">Subtotal</th>
              <th className="px-6 py-4">Desconto</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Lucro</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-slate-900">{sale.id}</p>
                    <p className="mt-1 text-xs text-slate-500">Venda registrada na API</p>
                  </div>
                </td>
                <td className="px-6 py-4">{formatDateTime(sale.createdAt)}</td>
                <td className="px-6 py-4">{sale.itemCount}</td>
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
                      className="app-button-secondary rounded-xl px-3 py-2"
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
