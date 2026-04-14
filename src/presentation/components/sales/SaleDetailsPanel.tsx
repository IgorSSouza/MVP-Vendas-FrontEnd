import { useEffect, useState } from 'react'

import type { Sale } from '@domain/entities'

import {
  formatCurrency,
  formatDateTime,
  getInstallmentLabel,
  getItemTypeLabel,
} from '@presentation/components/sales/sale-utils'
import { SalePaymentBadge } from '@presentation/components/sales/SalePaymentBadge'
import { SaleStatusBadge } from '@presentation/components/sales/SaleStatusBadge'
import { AppPortal } from '@presentation/components/shared/AppPortal'
import { FeedbackBanner } from '@presentation/components/shared/FeedbackBanner'
import { LoadingNotice } from '@presentation/components/shared/LoadingNotice'

type ReverseFeedback = {
  type: 'success' | 'error'
  message: string
}

type SaleDetailsPanelProps = {
  sale: Sale | null
  isOpen: boolean
  isLoading?: boolean
  isReversing?: boolean
  errorMessage?: string | null
  reverseFeedback?: ReverseFeedback | null
  onClose: () => void
  onReverse: (saleId: string, reason: string) => Promise<void>
}

export function SaleDetailsPanel({
  sale,
  isOpen,
  isLoading = false,
  isReversing = false,
  errorMessage = null,
  reverseFeedback = null,
  onClose,
  onReverse,
}: SaleDetailsPanelProps) {
  const [isReverseFormOpen, setIsReverseFormOpen] = useState(false)
  const [reverseReason, setReverseReason] = useState('')
  const [localReverseError, setLocalReverseError] = useState<string | null>(null)

  const installmentLabel = sale
    ? getInstallmentLabel(sale.installments, sale.installmentAmount)
    : null

  useEffect(() => {
    if (!isOpen) {
      setIsReverseFormOpen(false)
      setReverseReason('')
      setLocalReverseError(null)
      return
    }

    if (sale?.status === 'reversed') {
      setIsReverseFormOpen(false)
      setReverseReason('')
      setLocalReverseError(null)
    }
  }, [isOpen, sale?.id, sale?.status])

  async function handleReverseSubmit() {
    if (!sale) {
      return
    }

    const normalizedReason = reverseReason.trim()

    if (!normalizedReason) {
      setLocalReverseError('Informe o motivo do estorno antes de confirmar.')
      return
    }

    setLocalReverseError(null)

    try {
      await onReverse(sale.id, normalizedReason)
      setIsReverseFormOpen(false)
      setReverseReason('')
    } catch {
      return
    }
  }

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
                  Status
                </p>
                <div className="mt-2">
                  <SaleStatusBadge status={sale.status} />
                </div>
              </div>

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
                {installmentLabel ? (
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {installmentLabel}
                  </p>
                ) : null}
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800/80 dark:bg-slate-900/70">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  Total
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                  {formatCurrency(sale.total)}
                </p>
              </div>
            </div>

            {sale.status === 'reversed' ? (
              <div className="mt-6 rounded-3xl border border-rose-200/80 bg-rose-50/70 p-5 dark:border-rose-500/20 dark:bg-rose-500/10">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-700/80 dark:text-rose-300/80">
                  Venda estornada
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                      Estornada em
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                      {sale.reversedAt ? formatDateTime(sale.reversedAt) : 'Data não informada'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                      Motivo
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {sale.reversalReason || 'Motivo não informado.'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-3xl border border-slate-200/80 bg-slate-50/70 p-5 dark:border-slate-800/80 dark:bg-slate-900/60">
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700/80 dark:text-amber-300/80">
                      Estorno
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-50">
                      Reverter esta venda
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                      Use esta ação apenas quando for necessário cancelar a operação e devolver o estoque dos produtos.
                    </p>
                  </div>

                  {reverseFeedback ? (
                    <FeedbackBanner type={reverseFeedback.type} message={reverseFeedback.message} />
                  ) : null}

                  {isReverseFormOpen ? (
                    <div className="space-y-4">
                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Motivo do estorno
                        </span>
                        <textarea
                          value={reverseReason}
                          onChange={(event) => setReverseReason(event.target.value)}
                          rows={4}
                          maxLength={300}
                          className="app-input min-h-[112px] resize-y"
                          placeholder="Explique de forma breve o motivo do estorno."
                        />
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Campo obrigatório. Até 300 caracteres.
                        </span>
                      </label>

                      {localReverseError ? (
                        <FeedbackBanner type="error" message={localReverseError} />
                      ) : null}

                      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          disabled={isReversing}
                          onClick={() => {
                            setIsReverseFormOpen(false)
                            setReverseReason('')
                            setLocalReverseError(null)
                          }}
                          className="app-button-secondary w-full sm:w-auto"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          disabled={isReversing}
                          onClick={() => void handleReverseSubmit()}
                          className="w-full rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                        >
                          {isReversing ? 'Estornando...' : 'Confirmar estorno'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setIsReverseFormOpen(true)}
                        className="w-full rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500 sm:w-auto"
                      >
                        Estornar venda
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

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

              {installmentLabel ? (
                <div className="border-b border-slate-200/80 bg-white px-4 py-4 sm:px-6 dark:border-slate-800/80 dark:bg-slate-950/60">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                    Parcelamento
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                    {installmentLabel}
                  </p>
                </div>
              ) : null}

              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {sale.items.map((item) => (
                  <article key={item.id} className="px-4 py-5 sm:px-6">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                            {item.name}
                          </h3>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {getItemTypeLabel(item.itemType)}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                          <span>Quantidade: {item.quantity}</span>
                          <span>Unitário: {formatCurrency(item.unitSalePrice)}</span>
                          <span>Subtotal: {formatCurrency(item.subtotal)}</span>
                          <span
                            className={
                              item.profit >= 0
                                ? 'text-emerald-700 dark:text-emerald-300'
                                : 'text-rose-600 dark:text-rose-300'
                            }
                          >
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
