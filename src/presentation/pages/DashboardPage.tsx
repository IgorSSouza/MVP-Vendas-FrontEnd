import { useEffect, useMemo, useState } from 'react'

import { PaymentMethod } from '@domain/enums'
import { KpiCard } from '@presentation/components/dashboard/KpiCard'
import { LowStockCard } from '@presentation/components/dashboard/LowStockCard'
import { PaymentSummaryCard } from '@presentation/components/dashboard/PaymentSummaryCard'
import { RecentSalesCard } from '@presentation/components/dashboard/RecentSalesCard'
import {
  dashboardPeriodOptions,
  filterSalesByPeriod,
  getCurrentMonthSalesCount,
  getDashboardPeriodLabel,
  getTodaySalesCount,
  groupSalesByPaymentMethod,
  mapRecentSales,
  summarizeSales,
  type DashboardPeriod,
} from '@presentation/components/dashboard/dashboard-utils'
import { formatCurrency } from '@presentation/components/sales/sale-utils'
import { FeedbackBanner } from '@presentation/components/shared/FeedbackBanner'
import { LoadingNotice } from '@presentation/components/shared/LoadingNotice'
import { PageHeader } from '@presentation/components/shared/PageHeader'
import { dashboardApi, type DashboardData } from '@shared/api/dashboard-api'
import { getApiErrorMessage } from '@shared/api/http-client'
import { salesApi, type SaleListItem } from '@shared/api/sales-api'

const emptyDashboardData: DashboardData = {
  totalSalesCount: 0,
  todaySalesCount: 0,
  monthSalesCount: 0,
  grossRevenue: 0,
  estimatedProfit: 0,
  salesByPaymentMethod: [],
  lowStockProducts: [],
  recentSales: [],
}

export function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>(emptyDashboardData)
  const [sales, setSales] = useState<SaleListItem[]>([])
  const [period, setPeriod] = useState<DashboardPeriod>('last7Days')
  const [isLoading, setIsLoading] = useState(true)
  const [feedback, setFeedback] = useState<{ type: 'error'; message: string } | null>(null)

  async function loadDashboardData() {
    setIsLoading(true)
    setFeedback(null)

    try {
      const [dashboardResponse, salesResponse] = await Promise.all([
        dashboardApi.getData(),
        salesApi.getAll(),
      ])

      setDashboardData(dashboardResponse)
      setSales(salesResponse)
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(
          error,
          'Não foi possível carregar os dados do dashboard.',
        ),
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadDashboardData()
  }, [])

  const filteredSales = useMemo(() => filterSalesByPeriod(sales, period), [period, sales])
  const periodSummary = useMemo(() => summarizeSales(filteredSales), [filteredSales])
  const periodPaymentSummary = useMemo(
    () => groupSalesByPaymentMethod(filteredSales),
    [filteredSales],
  )
  const periodRecentSales = useMemo(() => mapRecentSales(filteredSales), [filteredSales])
  const periodLabel = getDashboardPeriodLabel(period)

  const paymentMixHighlight = useMemo(() => {
    if (!periodPaymentSummary.length) {
      return 'Sem pagamentos registrados no período.'
    }

    const topPayment = periodPaymentSummary[0]

    const labels: Record<PaymentMethod, string> = {
      [PaymentMethod.PIX]: 'Pix',
      [PaymentMethod.CASH]: 'Dinheiro',
      [PaymentMethod.DEBIT_CARD]: 'Cartão de débito',
      [PaymentMethod.CREDIT_CARD]: 'Cartão de crédito',
    }

    return `${labels[topPayment.paymentMethod]} lidera a receita em ${periodLabel.toLowerCase()}.`
  }, [periodLabel, periodPaymentSummary])

  return (
    <section className="space-y-6">
      <div className="app-enter-soft">
        <PageHeader
          eyebrow="Dashboard"
          title="Visão geral da operação"
          description="Acompanhe os principais números do caixa, o mix de pagamentos e os pontos de atenção da loja em um painel mais claro e direto."
          action={
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
              {dashboardPeriodOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPeriod(option.value)}
                  className={[
                    'rounded-full border px-3 py-2 text-sm font-medium transition',
                    period === option.value
                      ? 'border-cyan-500 bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/25'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800',
                  ].join(' ')}
                >
                  {option.shortLabel}
                </button>
              ))}
            </div>
          }
        />
      </div>

      <div className="app-feedback-stack app-enter-soft-delay-1">
        {feedback ? <FeedbackBanner type={feedback.type} message={feedback.message} /> : null}
        {isLoading ? <LoadingNotice message="Carregando indicadores do dashboard..." /> : null}
      </div>

      <div className="app-surface p-5 app-enter-soft-delay-1">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-700/80 dark:text-cyan-300/80">
              Leitura atual
            </p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Período selecionado: {periodLabel}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {paymentMixHighlight}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadDashboardData()}
            className="app-button-secondary w-full rounded-xl px-4 py-2 sm:w-auto"
          >
            Atualizar dashboard
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-12 app-enter-soft-delay-2">
        <div className="2xl:col-span-6">
          <KpiCard
            label="Total bruto"
            value={formatCurrency(periodSummary.grossRevenue)}
            helper={`Receita acumulada em ${periodLabel.toLowerCase()}.`}
            accent="emerald"
            size="featured"
          />
        </div>
        <div className="2xl:col-span-6">
          <KpiCard
            label="Lucro estimado"
            value={formatCurrency(periodSummary.estimatedProfit)}
            helper={`Lucro calculado sobre as vendas de ${periodLabel.toLowerCase()}.`}
            accent="amber"
            size="featured"
          />
        </div>
        <div className="2xl:col-span-4">
          <KpiCard
            label="Vendas do dia"
            value={String(getTodaySalesCount(sales))}
            helper="Quantidade registrada hoje, independente do filtro."
            accent="cyan"
          />
        </div>
        <div className="2xl:col-span-4">
          <KpiCard
            label="Vendas do mês"
            value={String(getCurrentMonthSalesCount(sales))}
            helper="Movimento consolidado no mês atual."
            accent="violet"
          />
        </div>
        <div className="2xl:col-span-4">
          <KpiCard
            label="Total de vendas"
            value={String(periodSummary.totalSalesCount)}
            helper={`Quantidade de vendas encontradas em ${periodLabel.toLowerCase()}.`}
            accent="slate"
          />
        </div>
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr] app-enter-soft-delay-3">
        <PaymentSummaryCard items={periodPaymentSummary} periodLabel={periodLabel} />
        <LowStockCard products={dashboardData.lowStockProducts} />
      </div>

      <div className="app-enter-soft-delay-3">
        <RecentSalesCard sales={periodRecentSales} periodLabel={periodLabel} />
      </div>
    </section>
  )
}
