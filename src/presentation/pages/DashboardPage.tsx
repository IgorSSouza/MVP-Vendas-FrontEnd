import { useEffect, useMemo, useState } from 'react'

import type { Product, Sale } from '@domain/entities'
import { productRepository, saleRepository } from '@infra/mock/repositories'
import { getDashboardMetrics } from '@presentation/components/dashboard/dashboard-selectors'
import type { DashboardMetrics } from '@presentation/components/dashboard/dashboard-selectors'
import { KpiCard } from '@presentation/components/dashboard/KpiCard'
import { LowStockCard } from '@presentation/components/dashboard/LowStockCard'
import { PaymentSummaryCard } from '@presentation/components/dashboard/PaymentSummaryCard'
import { RecentSalesCard } from '@presentation/components/dashboard/RecentSalesCard'
import { LoadingNotice } from '@presentation/components/shared/LoadingNotice'
import { PageHeader } from '@presentation/components/shared/PageHeader'
import { formatCurrency } from '@presentation/components/sales/sale-utils'

const emptyMetrics: DashboardMetrics = {
  salesToday: 0,
  salesThisMonth: 0,
  grossTotal: 0,
  estimatedProfit: 0,
  totalSalesCount: 0,
  paymentSummary: [],
  lowStockProducts: [],
  recentSales: [],
}

export function DashboardPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    void loadDashboardData()
  }, [])

  const metrics = useMemo(() => {
    if (isLoading) {
      return emptyMetrics
    }

    return getDashboardMetrics(sales, products)
  }, [isLoading, products, sales])

  async function loadDashboardData() {
    setIsLoading(true)

    try {
      const [salesData, productsData] = await Promise.all([
        saleRepository.getAll(),
        productRepository.getAll(),
      ])

      setSales(salesData)
      setProducts(productsData)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title="Visao geral da operacao"
        description="Acompanhe os principais numeros de vendas, lucro, estoque baixo e pagamentos em um painel simples e direto para o dia a dia da loja."
      />

      {isLoading ? <LoadingNotice message="Carregando indicadores do dashboard..." /> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          label="Vendas do dia"
          value={String(metrics.salesToday)}
          helper="Quantidade de vendas registradas hoje."
        />
        <KpiCard
          label="Vendas do mes"
          value={String(metrics.salesThisMonth)}
          helper="Quantidade de vendas no mes atual."
        />
        <KpiCard
          label="Total bruto"
          value={formatCurrency(metrics.grossTotal)}
          helper="Soma dos totais de todas as vendas registradas."
        />
        <KpiCard
          label="Lucro estimado"
          value={formatCurrency(metrics.estimatedProfit)}
          helper="Soma do lucro das vendas registradas."
        />
        <KpiCard
          label="Total de vendas"
          value={String(metrics.totalSalesCount)}
          helper="Quantidade total de vendas no sistema."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <PaymentSummaryCard items={metrics.paymentSummary} />
        <LowStockCard products={metrics.lowStockProducts} />
      </div>

      <RecentSalesCard sales={metrics.recentSales} />
    </section>
  )
}
