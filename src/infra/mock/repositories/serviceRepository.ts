import type { Service } from '@domain/entities'
import { mockServices } from '@infra/mock/data/services'
import { clone } from '@infra/mock/utils/clone'
import { delay } from '@infra/mock/utils/delay'
import { generateMockId } from '@infra/mock/utils/id'

type CreateServiceInput = Omit<Service, 'id' | 'createdAt' | 'updatedAt'>
type UpdateServiceInput = Partial<Omit<Service, 'id' | 'createdAt'>> & {
  updatedAt?: string
}

let services = clone(mockServices)

export const serviceRepository = {
  async getAll() {
    await delay()

    return clone(services)
  },

  async getById(id: string) {
    await delay()

    const service = services.find((item) => item.id === id)

    return service ? clone(service) : null
  },

  async create(input: CreateServiceInput) {
    await delay()

    const timestamp = new Date().toISOString()
    const service: Service = {
      ...input,
      id: generateMockId('service'),
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    services = [...services, service]

    return clone(service)
  },

  async update(id: string, input: UpdateServiceInput) {
    await delay()

    const currentService = services.find((item) => item.id === id)

    if (!currentService) {
      return null
    }

    const updatedService: Service = {
      ...currentService,
      ...input,
      id: currentService.id,
      createdAt: currentService.createdAt,
      updatedAt: input.updatedAt ?? new Date().toISOString(),
    }

    services = services.map((item) => (item.id === id ? updatedService : item))

    return clone(updatedService)
  },

  async toggleActive(id: string) {
    await delay()

    const currentService = services.find((item) => item.id === id)

    if (!currentService) {
      return null
    }

    const updatedService: Service = {
      ...currentService,
      isActive: !currentService.isActive,
      updatedAt: new Date().toISOString(),
    }

    services = services.map((item) => (item.id === id ? updatedService : item))

    return clone(updatedService)
  },
}

export type { CreateServiceInput, UpdateServiceInput }
