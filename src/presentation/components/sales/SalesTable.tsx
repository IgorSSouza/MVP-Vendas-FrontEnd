import { SalePaymentBadge } from '@presentation/components/sales/SalePaymentBadge'
import {
  formatCurrency,
  formatDateTime,
  getInstallmentLabel,
} from '@presentation/components/sales/sale-utils'
import { AppSelect } from '@presentation/components/shared/AppSelect'
import type { SaleListItem } from '@shared/api/sales-api'

type SalesTableProps = {
  sales: SaleListItem[]
  isLoading: boolean
  sortOption: 'created-desc' | 'created-asc' | 'total-desc' | 'total-asc'
  pageSize: number
  totalItems: number
  currentPage: number
  totalPages: number
  pageStart: number
  pageEnd: number
  pageSizeOptions: number[]
  onOpenDetails: (sale: SaleListItem) => void
  onSortChange: (value: 'created-desc' | 'created-asc' | 'total-desc' | 'total-asc') => void
  onPageSizeChange: (value: number) => void
  onPreviousPage: () => void
  onNextPage: () => void
}

export function SalesTable({
  sales,
  isLoading,
  sortOption,
  pageSize,
  totalItems,
  currentPage,
  totalPages,
  pageStart,
  pageEnd,
  pageSizeOptions,
  onOpenDetails,
  onSortChange,
  onPageSizeChange,
  onPreviousPage,
  onNextPage,
}: SalesTableProps) {
  const sortOptions = [
    { value: 'created-desc' as const, label: 'Mais recentes' },
    { value: 'created-asc' as const, label: 'Mais antigas' },
    { value: 'total-desc' as const, label: 'Maior total' },
    { value: 'total-asc' as const, label: 'Menor total' },
  ]

  const pageSizeSelectOptions = pageSizeOptions.map((option) => ({
    value: option,
    label: `${option} por página`,
  }))

  if (isLoading) {
    return (
      <div className="app-empty-state text-sm text-slate-500 dark:text-slate-400">
        Carregando vendas...
      </div>
    )
  }

  if (!sales.length) {
    return (
      <div className="app-empty-state">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
          Sem resultados
        </p>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Nenhuma venda encontrada
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Ajuste os filtros ou realize uma nova venda para voltar a popular o histórico.
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
            Vendas encontradas
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {pageStart > 0 ? (
              <>
                Exibindo{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {pageStart}
                </span>{' '}
                a{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {pageEnd}
                </span>{' '}
                de{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {totalItems}
                </span>{' '}
                vendas.
              </>
            ) : (
              'Nenhuma venda para exibir no momento.'
            )}
          </p>
        </div>

        <span className="app-badge border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {totalItems} {totalItems === 1 ? 'item' : 'itens'}
        </span>
      </div>

      <div className="grid gap-4 border-b border-slate-200/80 px-5 py-4 dark:border-slate-800/80 sm:px-6 xl:grid-cols-[minmax(0,1fr)_220px_180px]">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Ordenar por
          </span>
          <AppSelect value={sortOption} onChange={onSortChange} options={sortOptions} />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Itens por página
          </span>
          <AppSelect
            value={pageSize}
            onChange={onPageSizeChange}
            options={pageSizeSelectOptions}
          />
        </label>

        <div className="flex items-end">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/70 dark:text-slate-300">
            Página{' '}
            <span className="font-semibold text-slate-950 dark:text-slate-50">{currentPage}</span>{' '}
            de{' '}
            <span className="font-semibold text-slate-950 dark:text-slate-50">{totalPages}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-4 2xl:hidden">
        {sales.map((sale) => {
          const installmentLabel = getInstallmentLabel(sale.installments, sale.installmentAmount)

          return (
            <article
              key={sale.id}
              className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-950/5 dark:border-slate-800/80 dark:bg-slate-950/60 dark:shadow-black/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                    {sale.id}
                  </h3>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <SalePaymentBadge paymentMethod={sale.paymentMethod} />
                  {installmentLabel ? (
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {sale.installments}x
                    </span>
                  ) : null}
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800/80 dark:bg-slate-900/70">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Data
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                    {formatDateTime(sale.createdAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Itens
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                    {sale.itemCount}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Total
                  </dt>
                  <dd className="mt-2 text-sm font-semibold text-slate-950 dark:text-slate-50">
                    {formatCurrency(sale.total)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Lucro
                  </dt>
                  <dd
                    className={[
                      'mt-2 text-sm font-semibold',
                      sale.profit >= 0
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-rose-600 dark:text-rose-300',
                    ].join(' ')}
                  >
                    {formatCurrency(sale.profit)}
                  </dd>
                </div>
              </dl>

              {installmentLabel ? (
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                  Parcelamento: <span className="font-medium">{installmentLabel}</span>
                </p>
              ) : null}

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => onOpenDetails(sale)}
                  className="app-button-secondary w-full"
                >
                  Ver detalhes
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
              <th className="px-6 py-4">Venda</th>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Itens</th>
              <th className="px-6 py-4">Pagamento</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Lucro</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => {
              const installmentLabel = getInstallmentLabel(
                sale.installments,
                sale.installmentAmount,
              )

              return (
                <tr key={sale.id}>
                  <td className="px-6 py-5">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900 dark:text-slate-100">
                        {sale.id}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5">{formatDateTime(sale.createdAt)}</td>
                  <td className="px-6 py-5">{sale.itemCount}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-start gap-2">
                      <SalePaymentBadge paymentMethod={sale.paymentMethod} />
                      {installmentLabel ? (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {sale.installments}x
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {formatCurrency(sale.total)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={
                        sale.profit >= 0
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : 'text-rose-600 dark:text-rose-300'
                      }
                    >
                      {formatCurrency(sale.profit)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
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
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200/80 px-5 py-4 dark:border-slate-800/80 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {pageStart > 0 ? (
            <>
              Mostrando{' '}
              <span className="font-medium text-slate-900 dark:text-slate-100">{pageStart}</span>–
              <span className="font-medium text-slate-900 dark:text-slate-100">{pageEnd}</span>{' '}
              de{' '}
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {totalItems}
              </span>{' '}
              vendas.
            </>
          ) : (
            'Nenhuma venda nesta página.'
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
