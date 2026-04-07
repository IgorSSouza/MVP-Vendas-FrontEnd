import type { SaleItem } from '@domain/entities'

import { formatCurrency, getItemTypeLabel } from '@presentation/components/sales/sale-utils'

type DraftSaleItem = Omit<SaleItem, 'id'> & {
  availableStock?: number
}

type SaleItemsListProps = {
  items: DraftSaleItem[]
  onQuantityChange: (itemId: string, quantity: number) => void
  onRemove: (itemId: string) => void
}

export function SaleItemsList({
  items,
  onQuantityChange,
  onRemove,
}: SaleItemsListProps) {
  if (!items.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Nenhum item na venda</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Adicione produtos ou servicos para montar a venda.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-4 py-5 sm:px-6">
        <h2 className="text-lg font-semibold text-slate-900">Itens da venda</h2>
        <p className="mt-2 text-sm text-slate-500">Ajuste as quantidades antes de finalizar.</p>
      </div>

      <div className="divide-y divide-slate-200">
        {items.map((item) => (
          <article key={`${item.itemType}-${item.itemId}`} className="px-4 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{item.name}</h3>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {getItemTypeLabel(item.itemType)}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
                  <span>Unitario: {formatCurrency(item.unitSalePrice)}</span>
                  <span>Subtotal: {formatCurrency(item.subtotal)}</span>
                  <span>Lucro: {formatCurrency(item.profit)}</span>
                  {typeof item.availableStock === 'number' ? (
                    <span>Estoque disponivel: {item.availableStock}</span>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <label className="grid gap-1">
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                    Quantidade
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) => onQuantityChange(item.itemId, Number(event.target.value))}
                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 sm:w-28"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => onRemove(item.itemId)}
                  className="w-full rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 sm:w-auto"
                >
                  Remover
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
