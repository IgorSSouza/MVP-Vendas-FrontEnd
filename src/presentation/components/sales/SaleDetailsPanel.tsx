import type { Sale } from '@domain/entities'

import { formatCurrency, formatDateTime, getItemTypeLabel } from '@presentation/components/sales/sale-utils'
import { SalePaymentBadge } from '@presentation/components/sales/SalePaymentBadge'
import { AppPortal } from '@presentation/components/shared/AppPortal'
import { FeedbackBanner } from '@presentation/components/shared/FeedbackBanner'
import { LoadingNotice } from '@presentation/components/shared/LoadingNotice'

type SaleDetailsPanelProps = {
  sale: Sale | null
  isOpen: boolean
  isLoading?: boolean
  errorMessage?: string | null
  onClose: () => void
}

export function SaleDetailsPanel({
  sale,
  isOpen,
  isLoading = false,
  errorMessage = null,
  onClose,
}: SaleDetailsPanelProps) {
  return (
    <AppPortal>
      <div
        className={[
          'app-overlay',
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={onClose}
      />

      <aside
        className={[
          'app-drawer max-w-2xl border-l border-slate-200/80 dark:border-slate-800/80',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <div className="app-panel-header">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-800/80 dark:text-cyan-300/80">
                Detalhes da venda
              </p>
              <h2 className="mt-2 break-all text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                {sale?.id ?? 'Venda'}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Consulte os dados principais e os itens desta venda.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="app-button-secondary w-full rounded-xl px-3 py-2 sm:w-auto"
            >
              Fechar
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="px-4 py-6 sm:px-6">
            <LoadingNotice message="Carregando detalhes da venda..." />
          </div>
        ) : errorMessage ? (
          <div className="px-4 py-6 sm:px-6">
            <FeedbackBanner type="error" message={errorMessage} />
          </div>
        ) : sale ? (
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800/80 dark:bg-slate-900/70">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  Data
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                  {formatDateTime(sale.createdAt)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800/80 dark:bg-slate-900/70">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  Pagamento
                </p>
                <div className="mt-2">
                  <SalePaymentBadge paymentMethod={sale.paymentMethod} />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800/80 dark:bg-slate-900/70">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  Total
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                  {formatCurrency(sale.total)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800/80 dark:bg-slate-900/70">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  Lucro
                </p>
                <p className={['mt-2 text-sm font-medium', sale.profit >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'].join(' ')}>
                  {formatCurrency(sale.profit)}
                </p>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200/80 shadow-sm shadow-slate-950/5 dark:border-slate-800/80 dark:shadow-black/20">
              <div className="grid gap-4 border-b border-slate-200/80 bg-slate-50/80 px-4 py-4 sm:grid-cols-2 sm:px-6 xl:grid-cols-4 dark:border-slate-800/80 dark:bg-slate-900/70">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                    Subtotal
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                    {formatCurrency(sale.subtotal)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                    Desconto
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                    {formatCurrency(sale.discount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                    Itens
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                    {sale.items.length}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                    Identificador
                  </p>
                  <p className="mt-2 break-all text-sm font-medium text-slate-900 dark:text-slate-100">
                    {sale.id}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {sale.items.map((item) => (
                  <article key={item.id} className="px-4 py-5 sm:px-6">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</h3>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {getItemTypeLabel(item.itemType)}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                          <span>Quantidade: {item.quantity}</span>
                          <span>Unitário: {formatCurrency(item.unitSalePrice)}</span>
                          <span>Subtotal: {formatCurrency(item.subtotal)}</span>
                          <span className={item.profit >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'}>
                            Lucro: {formatCurrency(item.profit)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="px-4 py-6 sm:px-6">
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
              Selecione uma venda para visualizar os detalhes.
            </div>
          </div>
        )}
      </aside>
    </AppPortal>
  )
}
