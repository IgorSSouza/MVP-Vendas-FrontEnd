import type { Product } from '@domain/entities'

import { ProductStatusBadge } from '@presentation/components/products/ProductStatusBadge'
import { formatCurrency, isLowStock } from '@presentation/components/products/product-utils'
import { AppSelect } from '@presentation/components/shared/AppSelect'
import { InlineSpinner } from '@presentation/components/shared/InlineSpinner'

type ProductTableProps = {
  products: Product[]
  isLoading: boolean
  processingId: string | null
  sortOption: 'name-asc' | 'name-desc' | 'created-desc' | 'created-asc' | 'stock-asc' | 'stock-desc'
  pageSize: number
  totalItems: number
  currentPage: number
  totalPages: number
  pageStart: number
  pageEnd: number
  pageSizeOptions: number[]
  onEdit: (product: Product) => void
  onToggleActive: (product: Product) => Promise<void>
  onSortChange: (
    value: 'name-asc' | 'name-desc' | 'created-desc' | 'created-asc' | 'stock-asc' | 'stock-desc',
  ) => void
  onPageSizeChange: (value: number) => void
  onPreviousPage: () => void
  onNextPage: () => void
}

export function ProductTable({
  products,
  isLoading,
  processingId,
  sortOption,
  pageSize,
  totalItems,
  currentPage,
  totalPages,
  pageStart,
  pageEnd,
  pageSizeOptions,
  onEdit,
  onToggleActive,
  onSortChange,
  onPageSizeChange,
  onPreviousPage,
  onNextPage,
}: ProductTableProps) {
  const sortOptions = [
    { value: 'name-asc' as const, label: 'Nome A–Z' },
    { value: 'name-desc' as const, label: 'Nome Z–A' },
    { value: 'created-desc' as const, label: 'Mais recentes' },
    { value: 'created-asc' as const, label: 'Mais antigos' },
    { value: 'stock-asc' as const, label: 'Estoque menor primeiro' },
    { value: 'stock-desc' as const, label: 'Estoque maior primeiro' },
  ]

  const pageSizeSelectOptions = pageSizeOptions.map((option) => ({
    value: option,
    label: `${option} por página`,
  }))

  if (isLoading) {
    return (
      <div className="app-empty-state text-sm text-slate-500 dark:text-slate-400">
        Carregando produtos...
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="app-empty-state">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
          Sem resultados
        </p>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Nenhum produto encontrado
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Ajuste a busca ou o filtro de status para localizar outro item. Se quiser começar um novo cadastro, use o botão de novo produto.
        </p>
      </div>
    )
  }

  return (
    <div className="app-table-shell overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-4 dark:border-slate-800/80 sm:px-6">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            Listagem
          </p>
          <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            Produtos encontrados
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {pageStart > 0 ? (
              <>
                Exibindo <span className="font-semibold text-slate-900 dark:text-slate-100">{pageStart}</span> a{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">{pageEnd}</span> de{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">{totalItems}</span> itens.
              </>
            ) : (
              'Nenhum item para exibir no momento.'
            )}
          </p>
        </div>

        <span className="app-badge border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {totalItems} {totalItems === 1 ? 'item' : 'itens'}
        </span>
      </div>

      <div className="grid gap-4 border-b border-slate-200/80 px-5 py-4 dark:border-slate-800/80 xl:grid-cols-[minmax(0,1fr)_220px_180px] sm:px-6">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Ordenar por</span>
          <AppSelect
            value={sortOption}
            onChange={onSortChange}
            options={sortOptions}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Itens por página</span>
          <AppSelect
            value={pageSize}
            onChange={onPageSizeChange}
            options={pageSizeSelectOptions}
          />
        </label>

        <div className="flex items-end">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/70 dark:text-slate-300">
            Página <span className="font-semibold text-slate-950 dark:text-slate-50">{currentPage}</span> de{' '}
            <span className="font-semibold text-slate-950 dark:text-slate-50">{totalPages}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-4 2xl:hidden">
        {products.map((product) => {
          const lowStock = isLowStock(product.stockQuantity)
          const isProcessing = processingId === product.id

          return (
            <article
              key={product.id}
              className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-950/5 dark:border-slate-800/80 dark:bg-slate-950/60 dark:shadow-black/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                    {product.name}
                  </h3>
                  <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                    ID: {product.id}
                  </p>
                </div>

                <ProductStatusBadge isActive={product.isActive} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="app-badge border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {product.category}
                </span>
                <span
                  className={[
                    'app-badge',
                    lowStock
                      ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200'
                      : 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200',
                  ].join(' ')}
                >
                  Estoque: {product.stockQuantity}
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-3 gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800/80 dark:bg-slate-900/70">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Custo
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                    {formatCurrency(product.costPrice)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Venda
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                    {formatCurrency(product.salePrice)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Estoque
                  </dt>
                  <dd
                    className={[
                      'mt-2 text-sm font-medium',
                      lowStock
                        ? 'text-amber-700 dark:text-amber-200'
                        : 'text-slate-900 dark:text-slate-100',
                    ].join(' ')}
                  >
                    {product.stockQuantity}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => onEdit(product)}
                  className="app-button-secondary w-full"
                >
                  Editar
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => void onToggleActive(product)}
                  className="app-button-secondary w-full"
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
            </article>
          )
        })}
      </div>

      <div className="hidden overflow-x-auto 2xl:block">
        <table className="app-table">
          <thead>
            <tr>
              <th className="px-6 py-4">Produto</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Custo</th>
              <th className="px-6 py-4">Venda</th>
              <th className="px-6 py-4">Estoque</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const lowStock = isLowStock(product.stockQuantity)
              const isProcessing = processingId === product.id

              return (
                <tr key={product.id}>
                  <td className="px-6 py-5">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {product.name}
                      </p>
                      <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                        ID: {product.id}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="app-badge border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {formatCurrency(product.costPrice)}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                      {formatCurrency(product.salePrice)}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span
                        className={[
                          'font-medium',
                          lowStock
                            ? 'text-amber-700 dark:text-amber-200'
                            : 'text-slate-700 dark:text-slate-300',
                        ].join(' ')}
                      >
                        {product.stockQuantity}
                      </span>
                      {lowStock ? (
                        <span className="app-badge border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                          Estoque baixo
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <ProductStatusBadge isActive={product.isActive} />
                  </td>
                  <td className="px-6 py-5">
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

      <div className="flex flex-col gap-3 border-t border-slate-200/80 px-5 py-4 dark:border-slate-800/80 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {pageStart > 0 ? (
            <>
              Mostrando <span className="font-medium text-slate-900 dark:text-slate-100">{pageStart}</span>–
              <span className="font-medium text-slate-900 dark:text-slate-100">{pageEnd}</span> de{' '}
              <span className="font-medium text-slate-900 dark:text-slate-100">{totalItems}</span> produtos.
            </>
          ) : (
            'Nenhum produto nesta página.'
          )}
        </p>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onPreviousPage}
            disabled={currentPage === 1}
            className="app-button-secondary w-full sm:w-auto"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={onNextPage}
            disabled={currentPage === totalPages || totalItems === 0}
            className="app-button-secondary w-full sm:w-auto"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  )
}
