import type { Service } from '@domain/entities'

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
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
        Carregando servicos...
      </div>
    )
  }

  if (!services.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Nenhum servico encontrado</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Ajuste os filtros ou cadastre um novo servico para iniciar a listagem.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
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
              <tr key={service.id} className="text-sm text-slate-600">
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
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => void onToggleActive(service)}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isProcessing
                        ? 'Atualizando...'
                        : service.isActive
                          ? 'Inativar'
                          : 'Reativar'}
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
