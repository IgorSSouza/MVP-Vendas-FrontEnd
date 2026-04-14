import { useMemo, useState } from 'react'

import { SalePaymentBadge } from '@presentation/components/sales/SalePaymentBadge'
import { formatCurrency } from '@presentation/components/sales/sale-utils'
import { FeedbackBanner } from '@presentation/components/shared/FeedbackBanner'
import { LoadingNotice } from '@presentation/components/shared/LoadingNotice'
import { PageHeader } from '@presentation/components/shared/PageHeader'
import { reportsApi, type RevenueReport } from '@shared/api/reports-api'
import { getApiErrorMessage } from '@shared/api/http-client'

type Feedback = {
  type: 'error'
  message: string
}

const emptyReport: RevenueReport = {
  startDate: '',
  endDate: '',
  salesCount: 0,
  subtotalAmount: 0,
  totalAmount: 0,
  profitAmount: 0,
  paymentMethodBreakdown: [],
}

function formatDateForInput(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getDefaultStartDate() {
  const now = new Date()
  return formatDateForInput(new Date(now.getFullYear(), now.getMonth(), 1))
}

function getDefaultEndDate() {
  return formatDateForInput(new Date())
}

function formatReportDateLabel(value: string) {
  const dateOnly = value.includes('T') ? value.slice(0, 10) : value

  if (!dateOnly || !dateOnly.includes('-')) {
    return value
  }

  const [year, month, day] = dateOnly.split('-')

  if (!year || !month || !day) {
    return value
  }

  return `${day}/${month}/${year}`
}

export function RevenueReportPage() {
  const [startDate, setStartDate] = useState(getDefaultStartDate)
  const [endDate, setEndDate] = useState(getDefaultEndDate)
  const [report, setReport] = useState<RevenueReport | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const hasResults = (report?.salesCount ?? 0) > 0
  const breakdown = report?.paymentMethodBreakdown ?? emptyReport.paymentMethodBreakdown

  const rangeLabel = useMemo(() => {
    if (!report?.startDate || !report.endDate) {
      return null
    }

    return `${formatReportDateLabel(report.startDate)} até ${formatReportDateLabel(report.endDate)}`
  }, [report])

  async function handleSubmit() {
    setFeedback(null)

    if (!startDate || !endDate) {
      setFeedback({
        type: 'error',
        message: 'Informe a data inicial e a data final para consultar o relatório.',
      })
      return
    }

    if (startDate > endDate) {
      setFeedback({
        type: 'error',
        message: 'A data inicial não pode ser maior que a data final.',
      })
      return
    }

    setIsLoading(true)
    setHasSearched(true)

    try {
      const response = await reportsApi.getRevenue({ startDate, endDate })
      setReport(response)
      setFeedback(null)
    } catch (error) {
      setReport(null)
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(error, 'Não foi possível carregar o relatório de faturamento.'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="space-y-6">
      <div className="app-enter-soft">
        <PageHeader
          eyebrow="Relatório"
          title="Faturamento por período"
          description="Consulte um resumo simples de faturamento, lucro e meios de pagamento dentro de um intervalo específico."
        />
      </div>

      <div className="app-feedback-stack app-enter-soft-delay-1">
        {feedback ? <FeedbackBanner type={feedback.type} message={feedback.message} /> : null}
        {isLoading ? <LoadingNotice message="Consultando relatório de faturamento..." /> : null}
      </div>

      <div className="app-surface p-5 sm:p-6 app-enter-soft-delay-1">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-800/80 dark:text-cyan-300/80">
              Filtros
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
              Escolha o período para consultar o faturamento
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Informe a data inicial e a data final para trazer um resumo consolidado das vendas.
            </p>
          </div>

          {rangeLabel ? (
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/70 dark:text-slate-300">
              Período consultado:{' '}
              <span className="font-semibold text-slate-950 dark:text-slate-50">{rangeLabel}</span>
            </div>
          ) : null}
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[180px_180px_auto]">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Data inicial
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="app-input"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Data final
            </span>
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="app-input"
            />
          </label>

          <div className="flex items-end xl:justify-end">
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={isLoading}
              className="app-button-primary w-full px-5 xl:w-auto"
            >
              Consultar relatório
            </button>
          </div>
        </div>
      </div>

      {hasSearched ? (
        <>
          <div className="grid gap-4 app-enter-soft-delay-2 sm:grid-cols-2 2xl:grid-cols-4">
            <article className="app-surface-muted p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                Vendas
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                {report?.salesCount ?? 0}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Quantidade de vendas no período consultado.
              </p>
            </article>

            <article className="app-surface-muted p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                Subtotal
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                {formatCurrency(report?.subtotalAmount ?? 0)}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Soma dos subtotais antes dos descontos.
              </p>
            </article>

            <article className="app-surface-muted p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                Total
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                {formatCurrency(report?.totalAmount ?? 0)}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Valor final faturado no período.
              </p>
            </article>

            <article className="app-surface-muted p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                Lucro
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                {formatCurrency(report?.profitAmount ?? 0)}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Resultado estimado com base nas vendas do período.
              </p>
            </article>
          </div>

          <div className="app-surface overflow-hidden app-enter-soft-delay-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-4 dark:border-slate-800/80 sm:px-6">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  Quebra por pagamento
                </p>
                <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                  Formas de pagamento no período
                </h2>
              </div>

              <span className="app-badge border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {breakdown.length} {breakdown.length === 1 ? 'forma' : 'formas'}
              </span>
            </div>

            {hasResults && breakdown.length ? (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {breakdown.map((item) => (
                  <article
                    key={item.paymentMethod}
                    className="flex flex-col gap-4 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="min-w-0">
                      <SalePaymentBadge paymentMethod={item.paymentMethod} />
                      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                        {item.salesCount} {item.salesCount === 1 ? 'venda' : 'vendas'} registradas.
                      </p>
                    </div>

                    <dl className="grid gap-3 sm:grid-cols-3 lg:min-w-[460px] lg:gap-4">
                      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 dark:border-slate-800/80 dark:bg-slate-900/70">
                        <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                          Subtotal
                        </dt>
                        <dd className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(item.subtotalAmount)}
                        </dd>
                      </div>
                      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 dark:border-slate-800/80 dark:bg-slate-900/70">
                        <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                          Total
                        </dt>
                        <dd className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(item.totalAmount)}
                        </dd>
                      </div>
                      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 dark:border-slate-800/80 dark:bg-slate-900/70">
                        <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                          Lucro
                        </dt>
                        <dd className="mt-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                          {formatCurrency(item.profitAmount)}
                        </dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            ) : (
              <div className="app-empty-state">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  Sem resultados
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                  Nenhuma venda encontrada no período
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Ajuste o intervalo informado e faça uma nova consulta para visualizar o faturamento.
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="app-empty-state app-enter-soft-delay-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
            Relatório
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Faça uma consulta para visualizar o faturamento
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Escolha um período e clique em consultar relatório para carregar os indicadores principais.
          </p>
        </div>
      )}
    </section>
  )
}
