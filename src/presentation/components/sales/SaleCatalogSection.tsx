import type { Product, Service } from '@domain/entities'
import { SaleItemType } from '@domain/enums'

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
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      </div>

      <div className="mt-5 space-y-3">
        {items.length ? (
          items.map((item) => {
            const isProduct = 'stockQuantity' in item

            return (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">{item.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {isProduct ? item.category : item.description || 'Sem descricao cadastrada.'}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1">
                        Venda: {formatCurrency(item.salePrice)}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1">
                        Custo: {formatCurrency(item.costPrice)}
                      </span>
                      {isProduct ? (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1">
                          Estoque: {item.stockQuantity}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isDisabled}
                    onClick={() => onAdd(item)}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isDisabled ? 'Aguarde...' : 'Adicionar'}
                  </button>
                </div>
              </article>
            )
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  )
}
