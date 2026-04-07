import type { Product } from '@domain/entities'

import { InlineSpinner } from '@presentation/components/shared/InlineSpinner'
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
      <div className="app-empty-state text-sm text-slate-500">
        Carregando produtos...
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="app-empty-state">
        <h3 className="text-lg font-semibold text-slate-900">Nenhum produto encontrado</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Ajuste os filtros ou cadastre um novo produto para iniciar a listagem.
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
                <tr key={product.id}>
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
                        <span className="app-badge border-amber-200 bg-amber-50 text-amber-800">
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
                        className="app-button-secondary rounded-xl px-3 py-2"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => void onToggleActive(product)}
                        className="app-button-secondary rounded-xl px-3 py-2"
                      >
                        <span className="flex items-center justify-center gap-2">
                          {isProcessing ? <InlineSpinner className="h-3.5 w-3.5" /> : null}
                          <span>
                            {isProcessing
                              ? 'Atualizando...'
                              : product.isActive
                                ? 'Inativar'
                                : 'Reativar'}
                          </span>
                        </span>
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
