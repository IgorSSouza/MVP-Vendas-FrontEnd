import { useEffect, useMemo, useState } from 'react'

import type { Service } from '@domain/entities'
import { ServiceFormPanel } from '@presentation/components/services/ServiceFormPanel'
import type { ServiceFormValues } from '@presentation/components/services/service-form-schema'
import { ServiceTable } from '@presentation/components/services/ServiceTable'
import { FeedbackBanner } from '@presentation/components/shared/FeedbackBanner'
import { LoadingNotice } from '@presentation/components/shared/LoadingNotice'
import { PageHeader } from '@presentation/components/shared/PageHeader'
import { getApiErrorMessage } from '@shared/api/http-client'
import { servicesApi } from '@shared/api/services-api'

type StatusFilter = 'all' | 'active' | 'inactive'
type Feedback = {
  type: 'success' | 'error'
  message: string
}

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [processingServiceId, setProcessingServiceId] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  useEffect(() => {
    void loadServices()
  }, [])

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const normalizedSearch = search.toLowerCase()
      const matchesSearch =
        service.name.toLowerCase().includes(normalizedSearch) ||
        service.description.toLowerCase().includes(normalizedSearch)

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && service.isActive) ||
        (statusFilter === 'inactive' && !service.isActive)

      return matchesSearch && matchesStatus
    })
  }, [search, services, statusFilter])

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
          description="Gerencie os serviços da assistência com uma operação simples de cadastro, edição, status e consulta rápida."
        />
      </div>

      <div className="app-surface p-6 app-enter-soft-delay-1">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px] xl:w-full xl:max-w-3xl">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Buscar</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Digite o nome ou a descrição"
                className="app-input"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Status</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                className="app-select"
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={openCreatePanel}
            className="app-button-primary w-full px-5 sm:w-auto"
          >
            Novo serviço
          </button>
        </div>

        <div className="mt-4 app-feedback-stack">
          {feedback ? <FeedbackBanner {...feedback} /> : null}
          {isLoading ? <LoadingNotice message="Carregando lista de serviços..." /> : null}
        </div>
      </div>

      <div className="app-enter-soft-delay-2">
        <ServiceTable
          services={filteredServices}
          isLoading={isLoading}
          processingId={processingServiceId}
          onEdit={openEditPanel}
          onToggleActive={handleToggleActive}
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
