import type { Service } from '@domain/entities'
import { httpRequest } from '@shared/api/http-client'

type ServicePayload = Omit<Service, 'id' | 'createdAt' | 'updatedAt'>
type ServiceUpdatePayload = Partial<Omit<Service, 'id' | 'createdAt' | 'updatedAt'>>

export const servicesApi = {
  getAll() {
    return httpRequest<Service[]>('/api/services')
  },

  getById(id: string) {
    return httpRequest<Service>(`/api/services/${id}`)
  },

  create(payload: ServicePayload) {
    return httpRequest<Service>('/api/services', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  update(id: string, payload: ServiceUpdatePayload) {
    return httpRequest<Service>(`/api/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  toggleStatus(id: string) {
    return httpRequest<void>(`/api/services/${id}/toggle-status`, {
      method: 'PATCH',
    })
  },
}
