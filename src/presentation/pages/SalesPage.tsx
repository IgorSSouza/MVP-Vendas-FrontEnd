import { useEffect, useMemo, useState } from 'react'

import type { Sale } from '@domain/entities'
import { PaymentMethod } from '@domain/enums'
import { saleRepository } from '@infra/mock/repositories'
import { SaleDetailsPanel } from '@presentation/components/sales/SaleDetailsPanel'
import { SalesTable } from '@presentation/components/sales/SalesTable'
import { LoadingNotice } from '@presentation/components/shared/LoadingNotice'
import { PageHeader } from '@presentation/components/shared/PageHeader'

type PaymentMethodFilter = 'all' | PaymentMethod

export function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [paymentFilter, setPaymentFilter] = useState<PaymentMethodFilter>('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  useEffect(() => {
    void loadSales()
  }, [])

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const normalizedSearch = search.toLowerCase()
      const matchesSearch =
        !normalizedSearch ||
        sale.id.toLowerCase().includes(normalizedSearch) ||
        sale.items.some((item) => item.name.toLowerCase().includes(normalizedSearch))

      const matchesPayment =
        paymentFilter === 'all' || sale.paymentMethod === paymentFilter

      const saleDate = new Date(sale.createdAt)
      const matchesStartDate = !startDate || saleDate >= new Date(`${startDate}T00:00:00`)
      const matchesEndDate = !endDate || saleDate <= new Date(`${endDate}T23:59:59`)

      return matchesSearch && matchesPayment && matchesStartDate && matchesEndDate
    })
  }, [endDate, paymentFilter, sales, search, startDate])

  async function loadSales() {
    setIsLoading(true)

    try {
      const data = await saleRepository.getAll()
      setSales(data)
    } finally {
      setIsLoading(false)
    }
  }

  function openDetails(sale: Sale) {
    setSelectedSale(sale)
    setIsDetailsOpen(true)
  }

  function closeDetails() {
    setIsDetailsOpen(false)
    setSelectedSale(null)
  }

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Vendas"
        title="Historico de vendas"
        description="Consulte as vendas realizadas, aplique filtros rapidos e visualize os detalhes de cada operacao."
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_220px_180px_180px]">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">Buscar</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Busque por ID ou nome do item"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">Pagamento</span>
            <select
              value={paymentFilter}
              onChange={(event) => setPaymentFilter(event.target.value as PaymentMethodFilter)}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            >
              <option value="all">Todos</option>
              <option value={PaymentMethod.PIX}>Pix</option>
              <option value={PaymentMethod.CASH}>Dinheiro</option>
              <option value={PaymentMethod.DEBIT_CARD}>Cartao de debito</option>
              <option value={PaymentMethod.CREDIT_CARD}>Cartao de credito</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">Data inicial</span>
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">Data final</span>
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            />
          </label>
        </div>

        {isLoading ? (
          <div className="mt-4">
            <LoadingNotice message="Carregando historico de vendas..." />
          </div>
        ) : null}
      </div>

      <SalesTable sales={filteredSales} isLoading={isLoading} onOpenDetails={openDetails} />

      <SaleDetailsPanel sale={selectedSale} isOpen={isDetailsOpen} onClose={closeDetails} />
    </section>
  )
}
