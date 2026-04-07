import { useEffect, useState } from 'react'

import {
  dashboardApi,
  type DashboardData,
} from '@shared/api/dashboard-api'
import { KpiCard } from '@presentation/components/dashboard/KpiCard'
import { LowStockCard } from '@presentation/components/dashboard/LowStockCard'
import { PaymentSummaryCard } from '@presentation/components/dashboard/PaymentSummaryCard'
import { RecentSalesCard } from '@presentation/components/dashboard/RecentSalesCard'
import { FeedbackBanner } from '@presentation/components/shared/FeedbackBanner'
import { LoadingNotice } from '@presentation/components/shared/LoadingNotice'
import { PageHeader } from '@presentation/components/shared/PageHeader'
import { formatCurrency } from '@presentation/components/sales/sale-utils'
import { getApiErrorMessage } from '@shared/api/http-client'

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
  const [isLoading, setIsLoading] = useState(true)
  const [feedback, setFeedback] = useState<{ type: 'error'; message: string } | null>(null)

  async function loadDashboardData() {
    setIsLoading(true)
    setFeedback(null)

    try {
      const data = await dashboardApi.getData()
      setDashboardData(data)
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(
          error,
          'Nao foi possivel carregar os indicadores do dashboard.',
        ),
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadDashboardData()
  }, [])

  return (
    <section className="space-y-6">
      <div className="app-enter-soft">
        <PageHeader
          eyebrow="Dashboard"
          title="Visao geral da operacao"
          description="Acompanhe os principais numeros de vendas, lucro, estoque baixo e pagamentos em um painel simples e direto para o dia a dia da loja."
        />
      </div>

      <div className="app-feedback-stack app-enter-soft-delay-1">
        {feedback ? <FeedbackBanner type={feedback.type} message={feedback.message} /> : null}
        {isLoading ? <LoadingNotice message="Carregando indicadores do dashboard..." /> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5 app-enter-soft-delay-1">
        <KpiCard
          label="Vendas do dia"
          value={String(dashboardData.todaySalesCount)}
          helper="Quantidade de vendas registradas hoje."
        />
        <KpiCard
          label="Vendas do mes"
          value={String(dashboardData.monthSalesCount)}
          helper="Quantidade de vendas no mes atual."
        />
        <KpiCard
          label="Total bruto"
          value={formatCurrency(dashboardData.grossRevenue)}
          helper="Soma dos totais de todas as vendas registradas."
        />
        <KpiCard
          label="Lucro estimado"
          value={formatCurrency(dashboardData.estimatedProfit)}
          helper="Soma do lucro das vendas registradas."
        />
        <KpiCard
          label="Total de vendas"
          value={String(dashboardData.totalSalesCount)}
          helper="Quantidade total de vendas no sistema."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr] app-enter-soft-delay-2">
        <PaymentSummaryCard items={dashboardData.salesByPaymentMethod} />
        <LowStockCard products={dashboardData.lowStockProducts} />
      </div>

      <div className="app-enter-soft-delay-3">
        <RecentSalesCard sales={dashboardData.recentSales} />
      </div>
    </section>
  )
}
