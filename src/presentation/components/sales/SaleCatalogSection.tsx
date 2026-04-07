import type { Product, Service } from '@domain/entities'
import { SaleItemType } from '@domain/enums'

import { InlineSpinner } from '@presentation/components/shared/InlineSpinner'
import { formatCurrency } from '@presentation/components/sales/sale-utils'

type SaleCatalogProduct = Product & {
  type: SaleItemType
}

type SaleCatalogService = Service & {
  type: SaleItemType
}

type SaleCatalogSectionProps = {
  title: string
  description: string
  items: Array<SaleCatalogProduct | SaleCatalogService>
  emptyMessage: string
  isDisabled?: boolean
  onAdd: (item: SaleCatalogProduct | SaleCatalogService) => void
}

export function SaleCatalogSection({
  title,
  description,
  items,
  emptyMessage,
  isDisabled = false,
  onAdd,
}: SaleCatalogSectionProps) {
  return (
    <section className="app-surface p-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      </div>

      <div className="mt-5 space-y-3">
        {items.length ? (
          items.map((item) => {
            const isProduct = 'stockQuantity' in item

            return (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200/80 p-4 shadow-sm shadow-slate-950/5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md hover:shadow-slate-950/5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">{item.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {isProduct ? item.category : item.description || 'Sem descricao cadastrada.'}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span className="app-badge border-slate-200 bg-slate-100 text-slate-600">
                        Venda: {formatCurrency(item.salePrice)}
                      </span>
                      <span className="app-badge border-slate-200 bg-slate-100 text-slate-600">
                        Custo: {formatCurrency(item.costPrice)}
                      </span>
                      {isProduct ? (
                        <span className="app-badge border-slate-200 bg-slate-100 text-slate-600">
                          Estoque: {item.stockQuantity}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isDisabled}
                    onClick={() => onAdd(item)}
                    className="app-button-secondary rounded-xl px-3 py-2"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isDisabled ? <InlineSpinner className="h-3.5 w-3.5" /> : null}
                      <span>{isDisabled ? 'Aguarde...' : 'Adicionar'}</span>
                    </span>
                  </button>
                </div>
              </article>
            )
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-4 py-6 text-sm text-slate-500">
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  )
}
