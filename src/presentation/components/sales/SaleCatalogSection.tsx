import type { Product, Service } from '@domain/entities'
import { SaleItemType } from '@domain/enums'

import { formatCurrency } from '@presentation/components/sales/sale-utils'
import { InlineSpinner } from '@presentation/components/shared/InlineSpinner'

type SaleCatalogProduct = Product & {
  type: SaleItemType
}

type SaleCatalogService = Service & {
  type: SaleItemType
}

type SaleCatalogSectionProps = {
  title: string
  description: string
  searchValue: string
  searchPlaceholder: string
  onSearchChange: (value: string) => void
  items: Array<SaleCatalogProduct | SaleCatalogService>
  totalItems: number
  emptyMessage: string
  isDisabled?: boolean
  onAdd: (item: SaleCatalogProduct | SaleCatalogService) => void
}

export function SaleCatalogSection({
  title,
  description,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  items,
  totalItems,
  emptyMessage,
  isDisabled = false,
  onAdd,
}: SaleCatalogSectionProps) {
  return (
    <section className="app-surface p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-50">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {description}
            </p>
          </div>

          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            {items.length}/{totalItems} visíveis
          </div>
        </div>

        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Buscar
          </span>
          <input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="app-input"
          />
        </label>
      </div>

      <div className="mt-5 space-y-3">
        {items.length ? (
          items.map((item) => {
            const isProduct = 'stockQuantity' in item
            const stockIsLow = isProduct && item.stockQuantity <= 3

            return (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200/80 p-4 shadow-sm shadow-slate-950/5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md hover:shadow-slate-950/5 dark:border-slate-800/80 dark:bg-slate-950/40 dark:shadow-black/20 dark:hover:border-slate-700 dark:hover:bg-slate-900/70"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-slate-900 dark:text-slate-100">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {isProduct ? item.category : item.description || 'Sem descrição cadastrada.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isDisabled}
                      onClick={() => onAdd(item)}
                      className="app-button-secondary shrink-0 rounded-xl px-3 py-2"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {isDisabled ? <InlineSpinner className="h-3.5 w-3.5" /> : null}
                        <span>{isDisabled ? 'Aguarde...' : 'Adicionar'}</span>
                      </span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="app-badge border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      Venda: {formatCurrency(item.salePrice)}
                    </span>
                    <span className="app-badge border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      Custo: {formatCurrency(item.costPrice)}
                    </span>
                    {isProduct ? (
                      <span
                        className={[
                          'app-badge',
                          stockIsLow
                            ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200'
                            : 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
                        ].join(' ')}
                      >
                        Estoque: {item.stockQuantity}
                      </span>
                    ) : null}
                  </div>
                </div>
              </article>
            )
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-4 py-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  )
}
