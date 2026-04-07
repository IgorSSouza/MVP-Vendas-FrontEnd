import type { Product } from '@domain/entities'

import { ProductStatusBadge } from '@presentation/components/products/ProductStatusBadge'
import { formatCurrency, isLowStock } from '@presentation/components/products/product-utils'

type ProductTableProps = {
  products: Product[]
  isLoading: boolean
  processingId: string | null
  onEdit: (product: Product) => void
  onToggleActive: (product: Product) => Promise<void>
}

export function ProductTable({
  products,
  isLoading,
  processingId,
  onEdit,
  onToggleActive,
}: ProductTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
        Carregando produtos...
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Nenhum produto encontrado</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Ajuste os filtros ou cadastre um novo produto para iniciar a listagem.
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
              <th className="px-6 py-4">Produto</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Custo</th>
              <th className="px-6 py-4">Venda</th>
              <th className="px-6 py-4">Estoque</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Acoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {products.map((product) => {
              const lowStock = isLowStock(product.stockQuantity)
              const isProcessing = processingId === product.id

              return (
                <tr key={product.id} className="text-sm text-slate-600">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">{product.name}</p>
                      <p className="mt-1 text-xs text-slate-500">ID: {product.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">{formatCurrency(product.costPrice)}</td>
                  <td className="px-6 py-4">{formatCurrency(product.salePrice)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={[
                          'font-medium',
                          lowStock ? 'text-amber-600' : 'text-slate-700',
                        ].join(' ')}
                      >
                        {product.stockQuantity}
                      </span>
                      {lowStock ? (
                        <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                          Baixo
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <ProductStatusBadge isActive={product.isActive} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => onEdit(product)}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => void onToggleActive(product)}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isProcessing
                          ? 'Atualizando...'
                          : product.isActive
                            ? 'Inativar'
                            : 'Reativar'}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
