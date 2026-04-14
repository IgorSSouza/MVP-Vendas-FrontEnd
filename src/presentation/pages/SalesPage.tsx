import { useEffect, useMemo, useState } from 'react'

import type { Sale, SaleStatus } from '@domain/entities'
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
type SaleStatusFilter = 'all' | SaleStatus
type SortOption = 'created-desc' | 'created-asc' | 'total-desc' | 'total-asc'
type Feedback = { type: 'success' | 'error'; message: string }

const pageSizeOptions = [8, 12, 20]

function mapSaleToListItem(sale: Sale): SaleListItem {
  return {
    id: sale.id,
    createdAt: sale.createdAt,
    paymentMethod: sale.paymentMethod,
    status: sale.status,
    reversedAt: sale.reversedAt ?? null,
    reversalReason: sale.reversalReason ?? null,
    installments: sale.installments,
    installmentAmount: sale.installmentAmount,
    subtotal: sale.subtotal,
    discount: sale.discount,
    total: sale.total,
    profit: sale.profit,
    itemCount: sale.items.length,
  }
}

export function SalesPage() {
  const paymentOptions = [
    { value: 'all' as const, label: 'Todos' },
    { value: PaymentMethod.PIX, label: 'Pix' },
    { value: PaymentMethod.CASH, label: 'Dinheiro' },
    { value: PaymentMethod.DEBIT_CARD, label: 'Cartão de débito' },
    { value: PaymentMethod.CREDIT_CARD, label: 'Cartão de crédito' },
  ]

  const statusOptions = [
    { value: 'all' as const, label: 'Todos' },
    { value: 'completed' as const, label: 'Concluídas' },
    { value: 'reversed' as const, label: 'Estornadas' },
  ]

  const [sales, setSales] = useState<SaleListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [paymentFilter, setPaymentFilter] = useState<PaymentMethodFilter>('all')
  const [statusFilter, setStatusFilter] = useState<SaleStatusFilter>('all')
  const [sortOption, setSortOption] = useState<SortOption>('created-desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(pageSizeOptions[0])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDetailsLoading, setIsDetailsLoading] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)
  const [isReversing, setIsReversing] = useState(false)
  const [reverseFeedback, setReverseFeedback] = useState<Feedback | null>(null)

  useEffect(() => {
    void loadSales()
  }, [])

  const filteredSales = useMemo(() => {
    const visibleSales = sales.filter((sale) => {
      const normalizedSearch = search.trim().toLowerCase()
      const matchesSearch = !normalizedSearch || sale.id.toLowerCase().includes(normalizedSearch)
      const matchesPayment = paymentFilter === 'all' || sale.paymentMethod === paymentFilter
      const matchesStatus = statusFilter === 'all' || sale.status === statusFilter

      const saleDate = new Date(sale.createdAt)
      const matchesStartDate = !startDate || saleDate >= new Date(`${startDate}T00:00:00`)
      const matchesEndDate = !endDate || saleDate <= new Date(`${endDate}T23:59:59`)

      return (
        matchesSearch &&
        matchesPayment &&
        matchesStatus &&
        matchesStartDate &&
        matchesEndDate
      )
    })

    return [...visibleSales].sort((left, right) => {
      switch (sortOption) {
        case 'created-asc':
          return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
        case 'total-desc':
          return right.total - left.total
        case 'total-asc':
          return left.total - right.total
        case 'created-desc':
        default:
          return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      }
    })
  }, [endDate, paymentFilter, sales, search, sortOption, startDate, statusFilter])

  const totalFilteredSales = filteredSales.length
  const totalPages = Math.max(1, Math.ceil(totalFilteredSales / pageSize))

  const paginatedSales = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredSales.slice(start, start + pageSize)
  }, [currentPage, filteredSales, pageSize])

  const pageStart = totalFilteredSales === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const pageEnd = totalFilteredSales === 0 ? 0 : pageStart + paginatedSales.length - 1

  useEffect(() => {
    setCurrentPage(1)
  }, [search, paymentFilter, statusFilter, sortOption, pageSize, startDate, endDate])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

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
    setReverseFeedback(null)

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
    setIsReversing(false)
    setReverseFeedback(null)
  }

  async function handleReverseSale(saleId: string, reason: string) {
    setIsReversing(true)
    setReverseFeedback(null)
    setFeedback(null)

    try {
      const updatedSale = await salesApi.reverse(saleId, reason)
      const updatedListItem = mapSaleToListItem(updatedSale)

      setSelectedSale(updatedSale)
      setSales((currentSales) =>
        currentSales.map((item) => (item.id === saleId ? updatedListItem : item)),
      )

      const successMessage = 'Venda estornada com sucesso.'
      setReverseFeedback({ type: 'success', message: successMessage })
      setFeedback({ type: 'success', message: successMessage })
    } catch (error) {
      const message = getApiErrorMessage(error, 'Não foi possível estornar a venda.')
      setReverseFeedback({ type: 'error', message })
      throw error
    } finally {
      setIsReversing(false)
    }
  }

  return (
    <section className="space-y-6">
      <div className="app-enter-soft">
        <PageHeader
          eyebrow="Vendas"
          title="Histórico de vendas"
          description="Consulte as vendas realizadas, aplique filtros rápidos e acompanhe a operação com leitura mais clara em qualquer largura de tela."
        />
      </div>

      <div className="app-feedback-stack app-enter-soft-delay-1">
        {feedback ? <FeedbackBanner type={feedback.type} message={feedback.message} /> : null}
      </div>

      <div className="app-surface p-5 sm:p-6 app-enter-soft-delay-1">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-800/80 dark:text-cyan-300/80">
              Filtros e busca
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
              Localize, ordene e acompanhe as vendas com mais clareza
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Busque pelo identificador, filtre por pagamento, status e período e acompanhe o
              histórico com uma listagem mais estável em tela dividida ou em dispositivos menores.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/70 dark:text-slate-300">
            <span className="font-semibold text-slate-950 dark:text-slate-50">
              {totalFilteredSales}
            </span>{' '}
            {totalFilteredSales === 1 ? 'resultado visível' : 'resultados visíveis'}
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 2xl:grid-cols-[minmax(0,1fr)_220px_220px_180px_180px]">
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
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Pagamento
            </span>
            <AppSelect
              value={paymentFilter}
              onChange={setPaymentFilter}
              options={paymentOptions}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Status
            </span>
            <AppSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
            />
          </label>

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
        </div>

        {isLoading ? (
          <div className="mt-4">
            <LoadingNotice message="Carregando histórico de vendas..." />
          </div>
        ) : null}
      </div>

      <div className="app-enter-soft-delay-2">
        <SalesTable
          sales={paginatedSales}
          isLoading={isLoading}
          sortOption={sortOption}
          pageSize={pageSize}
          totalItems={totalFilteredSales}
          currentPage={currentPage}
          totalPages={totalPages}
          pageStart={pageStart}
          pageEnd={pageEnd}
          pageSizeOptions={pageSizeOptions}
          onOpenDetails={openDetails}
          onSortChange={setSortOption}
          onPageSizeChange={setPageSize}
          onPreviousPage={() => setCurrentPage((page) => Math.max(1, page - 1))}
          onNextPage={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
        />
      </div>

      <SaleDetailsPanel
        sale={selectedSale}
        isOpen={isDetailsOpen}
        isLoading={isDetailsLoading}
        isReversing={isReversing}
        errorMessage={detailsError}
        reverseFeedback={reverseFeedback}
        onClose={closeDetails}
        onReverse={handleReverseSale}
      />
    </section>
  )
}
