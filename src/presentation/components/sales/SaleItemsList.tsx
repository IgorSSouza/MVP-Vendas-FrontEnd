import type { SaleItem } from '@domain/entities'

import { formatCurrency, getItemTypeLabel } from '@presentation/components/sales/sale-utils'

type DraftSaleItem = Omit<SaleItem, 'id'> & {
  availableStock?: number
}

type SaleItemsListProps = {
  items: DraftSaleItem[]
  onQuantityChange: (itemId: string, quantity: number) => void
  onRemove: (itemId: string) => void
  lastAddedLabel?: string | null
}

export function SaleItemsList({
  items,
  onQuantityChange,
  onRemove,
  lastAddedLabel = null,
}: SaleItemsListProps) {
  if (!items.length) {
    return (
      <div className="app-empty-state">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Nenhum item na venda</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Adicione produtos ou serviços para montar a venda e revisar o resumo em tempo real.
        </p>
      </div>
    )
  }

  return (
    <div className="app-surface overflow-hidden">
      <div className="app-panel-header">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-50">Itens da venda</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Ajuste quantidades, valide estoque e deixe a venda pronta para finalizar.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              {items.length} item(ns)
            </div>
            {lastAddedLabel ? (
              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
                Último adicionado: {lastAddedLabel}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {items.map((item) => (
          <article
            key={`${item.itemType}-${item.itemId}`}
            className="px-4 py-5 transition-colors duration-200 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 sm:px-6"
          >
            <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</h3>
                  <span className="app-badge border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {getItemTypeLabel(item.itemType)}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="app-badge border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Unitário: {formatCurrency(item.unitSalePrice)}
                  </span>
                  <span className="app-badge border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Subtotal: {formatCurrency(item.subtotal)}
                  </span>
                  <span className="app-badge border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
                    Lucro: {formatCurrency(item.profit)}
                  </span>
                  {typeof item.availableStock === 'number' ? (
                    <span className="app-badge border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      Estoque disponível: {item.availableStock}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <label className="grid gap-1">
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                    Quantidade
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) => onQuantityChange(item.itemId, Number(event.target.value))}
                    className="app-input w-full px-3 py-2 sm:w-28"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => onRemove(item.itemId)}
                  className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-700 shadow-sm transition duration-150 hover:bg-rose-50 focus:outline-none focus:ring-4 focus:ring-rose-100 dark:border-rose-500/30 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-rose-500/10 dark:focus:ring-rose-500/10 sm:w-auto"
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
