import type { Service } from '@domain/entities'

import { InlineSpinner } from '@presentation/components/shared/InlineSpinner'
import { ServiceStatusBadge } from '@presentation/components/services/ServiceStatusBadge'
import { formatCurrency } from '@presentation/components/services/service-utils'

type ServiceTableProps = {
  services: Service[]
  isLoading: boolean
  processingId: string | null
  onEdit: (service: Service) => void
  onToggleActive: (service: Service) => Promise<void>
}

export function ServiceTable({
  services,
  isLoading,
  processingId,
  onEdit,
  onToggleActive,
}: ServiceTableProps) {
  if (isLoading) {
    return (
      <div className="app-empty-state text-sm text-slate-500">
        Carregando servicos...
      </div>
    )
  }

  if (!services.length) {
    return (
      <div className="app-empty-state">
        <h3 className="text-lg font-semibold text-slate-900">Nenhum servico encontrado</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Ajuste os filtros ou cadastre um novo servico para iniciar a listagem.
        </p>
      </div>
    )
  }

  return (
    <div className="app-table-shell">
      <div className="overflow-x-auto">
        <table className="app-table">
          <thead>
            <tr>
              <th className="px-6 py-4">Servico</th>
              <th className="px-6 py-4">Descricao</th>
              <th className="px-6 py-4">Custo</th>
              <th className="px-6 py-4">Venda</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Acoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {services.map((service) => {
              const isProcessing = processingId === service.id

              return (
                <tr key={service.id}>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">{service.name}</p>
                      <p className="mt-1 text-xs text-slate-500">ID: {service.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="max-w-md text-sm leading-6 text-slate-600">
                      {service.description || 'Sem descricao cadastrada.'}
                    </p>
                  </td>
                  <td className="px-6 py-4">{formatCurrency(service.costPrice)}</td>
                  <td className="px-6 py-4">{formatCurrency(service.salePrice)}</td>
                  <td className="px-6 py-4">
                    <ServiceStatusBadge isActive={service.isActive} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => onEdit(service)}
                        className="app-button-secondary rounded-xl px-3 py-2"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => void onToggleActive(service)}
                        className="app-button-secondary rounded-xl px-3 py-2"
                      >
                        <span className="flex items-center justify-center gap-2">
                          {isProcessing ? <InlineSpinner className="h-3.5 w-3.5" /> : null}
                          <span>
                            {isProcessing
                              ? 'Atualizando...'
                              : service.isActive
                                ? 'Inativar'
                                : 'Reativar'}
                          </span>
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              )})}
          </tbody>
        </table>
      </div>
    </div>
  )
}
