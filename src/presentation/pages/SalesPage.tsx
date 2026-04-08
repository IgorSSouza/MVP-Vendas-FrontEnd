import { useEffect, useMemo, useState } from 'react'

import type { Sale } from '@domain/entities'
import { PaymentMethod } from '@domain/enums'
import { SaleDetailsPanel } from '@presentation/components/sales/SaleDetailsPanel'
import { SalesTable } from '@presentation/components/sales/SalesTable'
import { AppSelect } from '@presentation/components/shared/AppSelect'
import { FeedbackBanner } from '@presentation/components/shared/FeedbackBanner'
import { LoadingNotice } from '@presentation/components/shared/LoadingNotice'
import { PageHeader } from '@presentation/components/shared/PageHeader'
import { getApiErrorMessage } from '@shared/api/http-client'
import { salesApi, type SaleListItem } from '@shared/api/sales-api'

type PaymentMethodFilter = 'all' | PaymentMethod

export function SalesPage() {
  const paymentOptions = [
    { value: 'all' as const, label: 'Todos' },
    { value: PaymentMethod.PIX, label: 'Pix' },
    { value: PaymentMethod.CASH, label: 'Dinheiro' },
    { value: PaymentMethod.DEBIT_CARD, label: 'Cartão de débito' },
    { value: PaymentMethod.CREDIT_CARD, label: 'Cartão de crédito' },
  ]

  const [sales, setSales] = useState<SaleListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [paymentFilter, setPaymentFilter] = useState<PaymentMethodFilter>('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [feedback, setFeedback] = useState<{ type: 'error'; message: string } | null>(null)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDetailsLoading, setIsDetailsLoading] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)

  useEffect(() => {
    void loadSales()
  }, [])

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const normalizedSearch = search.toLowerCase()
      const matchesSearch = !normalizedSearch || sale.id.toLowerCase().includes(normalizedSearch)

      const matchesPayment = paymentFilter === 'all' || sale.paymentMethod === paymentFilter

      const saleDate = new Date(sale.createdAt)
      const matchesStartDate = !startDate || saleDate >= new Date(`${startDate}T00:00:00`)
      const matchesEndDate = !endDate || saleDate <= new Date(`${endDate}T23:59:59`)

      return matchesSearch && matchesPayment && matchesStartDate && matchesEndDate
    })
  }, [endDate, paymentFilter, sales, search, startDate])

  async function loadSales() {
    setIsLoading(true)
    setFeedback(null)

    try {
      const data = await salesApi.getAll()
      setSales(data)
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(error, 'Não foi possível carregar o histórico de vendas.'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function openDetails(sale: SaleListItem) {
    setIsDetailsOpen(true)
    setIsDetailsLoading(true)
    setDetailsError(null)
    setSelectedSale(null)

    try {
      const saleDetails = await salesApi.getById(sale.id)
      setSelectedSale(saleDetails)
    } catch (error) {
      setDetailsError(
        getApiErrorMessage(error, 'Não foi possível carregar os detalhes da venda.'),
      )
    } finally {
      setIsDetailsLoading(false)
    }
  }

  function closeDetails() {
    setIsDetailsOpen(false)
    setSelectedSale(null)
    setDetailsError(null)
    setIsDetailsLoading(false)
  }

  return (
    <section className="space-y-6">
      <div className="app-enter-soft">
        <PageHeader
          eyebrow="Vendas"
          title="Histórico de vendas"
          description="Consulte as vendas realizadas, aplique filtros rápidos e visualize os detalhes de cada operação."
        />
      </div>

      <div className="app-feedback-stack app-enter-soft-delay-1">
        {feedback ? <FeedbackBanner type={feedback.type} message={feedback.message} /> : null}
      </div>

      <div className="app-surface p-6 app-enter-soft-delay-1">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_220px_180px_180px]">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Buscar</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Busque pelo identificador da venda"
              className="app-input"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Pagamento</span>
            <AppSelect
              value={paymentFilter}
              onChange={setPaymentFilter}
              options={paymentOptions}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Data inicial</span>
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="app-input"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Data final</span>
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="app-input"
            />
          </label>
        </div>

        {isLoading ? (
          <div className="mt-4">
            <LoadingNotice message="Carregando histórico de vendas..." />
          </div>
        ) : null}
      </div>

      <div className="app-enter-soft-delay-2">
        <SalesTable sales={filteredSales} isLoading={isLoading} onOpenDetails={openDetails} />
      </div>

      <SaleDetailsPanel
        sale={selectedSale}
        isOpen={isDetailsOpen}
        isLoading={isDetailsLoading}
        errorMessage={detailsError}
        onClose={closeDetails}
      />
    </section>
  )
}
