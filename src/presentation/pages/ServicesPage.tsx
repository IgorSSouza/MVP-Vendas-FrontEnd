import { useEffect, useMemo, useState } from 'react'

import type { Service } from '@domain/entities'
import { ServiceFormPanel } from '@presentation/components/services/ServiceFormPanel'
import type { ServiceFormValues } from '@presentation/components/services/service-form-schema'
import { ServiceTable } from '@presentation/components/services/ServiceTable'
import { AppSelect } from '@presentation/components/shared/AppSelect'
import { FeedbackBanner } from '@presentation/components/shared/FeedbackBanner'
import { LoadingNotice } from '@presentation/components/shared/LoadingNotice'
import { PageHeader } from '@presentation/components/shared/PageHeader'
import { getApiErrorMessage } from '@shared/api/http-client'
import { servicesApi } from '@shared/api/services-api'

type StatusFilter = 'all' | 'active' | 'inactive'
type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'created-desc'
  | 'created-asc'
  | 'sale-asc'
  | 'sale-desc'
type Feedback = {
  type: 'success' | 'error'
  message: string
}

const pageSizeOptions = [8, 12, 20]

export function ServicesPage() {
  const statusOptions = [
    { value: 'all' as const, label: 'Todos' },
    { value: 'active' as const, label: 'Ativos' },
    { value: 'inactive' as const, label: 'Inativos' },
  ]

  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortOption, setSortOption] = useState<SortOption>('name-asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(pageSizeOptions[0])
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [processingServiceId, setProcessingServiceId] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  useEffect(() => {
    void loadServices()
  }, [])

  const filteredServices = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    const visibleServices = services.filter((service) => {
      const matchesSearch =
        !normalizedSearch ||
        service.name.toLowerCase().includes(normalizedSearch) ||
        service.description.toLowerCase().includes(normalizedSearch)

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && service.isActive) ||
        (statusFilter === 'inactive' && !service.isActive)

      return matchesSearch && matchesStatus
    })

    return [...visibleServices].sort((left, right) => {
      switch (sortOption) {
        case 'name-desc':
          return right.name.localeCompare(left.name, 'pt-BR')
        case 'created-desc':
          return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
        case 'created-asc':
          return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
        case 'sale-asc':
          return left.salePrice - right.salePrice
        case 'sale-desc':
          return right.salePrice - left.salePrice
        case 'name-asc':
        default:
          return left.name.localeCompare(right.name, 'pt-BR')
      }
    })
  }, [search, services, sortOption, statusFilter])

  const totalFilteredServices = filteredServices.length
  const totalPages = Math.max(1, Math.ceil(totalFilteredServices / pageSize))

  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * pageSize

    return filteredServices.slice(start, start + pageSize)
  }, [currentPage, filteredServices, pageSize])

  const pageStart = totalFilteredServices === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const pageEnd = totalFilteredServices === 0 ? 0 : pageStart + paginatedServices.length - 1

  const totalServices = services.length
  const activeServices = services.filter((service) => service.isActive).length
  const describedServices = services.filter((service) => service.description.trim()).length

  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter, sortOption, pageSize])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  async function loadServices(showLoading = true) {
    if (showLoading) {
      setIsLoading(true)
    }

    try {
      const data = await servicesApi.getAll()
      setServices(data)
      setFeedback(null)
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(error, 'Não foi possível carregar os serviços.'),
      })
    } finally {
      if (showLoading) {
        setIsLoading(false)
      }
    }
  }

  function openCreatePanel() {
    setSelectedService(null)
    setIsPanelOpen(true)
  }

  function openEditPanel(service: Service) {
    setSelectedService(service)
    setIsPanelOpen(true)
  }

  function closePanel() {
    if (isSubmitting) {
      return
    }

    setIsPanelOpen(false)
    setSelectedService(null)
  }

  async function handleSubmit(values: ServiceFormValues) {
    setIsSubmitting(true)
    setFeedback(null)

    const payload = {
      ...values,
      description: values.description ?? '',
    }

    try {
      if (selectedService) {
        await servicesApi.update(selectedService.id, payload)
        setFeedback({
          type: 'success',
          message: 'Serviço atualizado com sucesso.',
        })
      } else {
        await servicesApi.create(payload)
        setFeedback({
          type: 'success',
          message: 'Serviço cadastrado com sucesso.',
        })
      }

      await loadServices(false)
      setIsPanelOpen(false)
      setSelectedService(null)
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(error, 'Não foi possível salvar o serviço.'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleToggleActive(service: Service) {
    setFeedback(null)
    setProcessingServiceId(service.id)

    try {
      await servicesApi.toggleStatus(service.id)
      await loadServices(false)
      setFeedback({
        type: 'success',
        message: service.isActive
          ? 'Serviço inativado com sucesso.'
          : 'Serviço reativado com sucesso.',
      })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(
          error,
          'Não foi possível alterar o status do serviço.',
        ),
      })
    } finally {
      setProcessingServiceId(null)
    }
  }

  return (
    <section className="space-y-6">
      <div className="app-enter-soft">
        <PageHeader
          eyebrow="Serviços"
          title="Catálogo de serviços"
          description="Organize o portfólio da assistência, acompanhe status e valores e mantenha a operação pronta para vender com clareza."
          action={
            <button
              type="button"
              onClick={openCreatePanel}
              className="app-button-primary w-full px-5 sm:w-auto"
            >
              Novo serviço
            </button>
          }
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 app-enter-soft-delay-1">
        <article className="app-surface-muted p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            Visão geral
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            {totalServices}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Serviços cadastrados na base atual.
          </p>
        </article>

        <article className="app-surface-muted p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700/80 dark:text-emerald-300/80">
            Status ativo
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            {activeServices}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Serviços disponíveis para venda e atendimento.
          </p>
        </article>

        <article className="app-surface-muted p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700/80 dark:text-cyan-300/80">
            Apresentação
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            {describedServices}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Serviços com descrição pronta para consulta comercial.
          </p>
        </article>
      </div>

      <div className="app-surface p-5 sm:p-6 app-enter-soft-delay-2">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-800/80 dark:text-cyan-300/80">
              Filtros e busca
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
              Localize e ajuste os serviços com rapidez
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Busque por nome ou descrição, filtre por status e acesse as ações principais sem perder o contexto da listagem.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/70 dark:text-slate-300">
            <span className="font-semibold text-slate-950 dark:text-slate-50">
              {totalFilteredServices}
            </span>{' '}
            {totalFilteredServices === 1 ? 'resultado visível' : 'resultados visíveis'}
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_220px_auto]">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Buscar</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Busque por nome do serviço ou descrição"
              className="app-input"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</span>
            <AppSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
            />
          </label>

          <div className="flex items-end xl:justify-end">
            <button
              type="button"
              onClick={openCreatePanel}
              className="app-button-primary w-full px-5 xl:w-auto"
            >
              Novo serviço
            </button>
          </div>
        </div>

        <div className="mt-4 app-feedback-stack">
          {feedback ? <FeedbackBanner {...feedback} /> : null}
          {isLoading ? <LoadingNotice message="Carregando catálogo de serviços..." /> : null}
        </div>
      </div>

      <div className="app-enter-soft-delay-3">
        <ServiceTable
          services={paginatedServices}
          isLoading={isLoading}
          processingId={processingServiceId}
          sortOption={sortOption}
          pageSize={pageSize}
          totalItems={totalFilteredServices}
          currentPage={currentPage}
          totalPages={totalPages}
          pageStart={pageStart}
          pageEnd={pageEnd}
          pageSizeOptions={pageSizeOptions}
          onEdit={openEditPanel}
          onToggleActive={handleToggleActive}
          onSortChange={setSortOption}
          onPageSizeChange={(value) => setPageSize(value)}
          onPreviousPage={() => setCurrentPage((page) => Math.max(1, page - 1))}
          onNextPage={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
        />
      </div>

      <ServiceFormPanel
        isOpen={isPanelOpen}
        service={selectedService}
        isSubmitting={isSubmitting}
        onClose={closePanel}
        onSubmit={handleSubmit}
      />
    </section>
  )
}
