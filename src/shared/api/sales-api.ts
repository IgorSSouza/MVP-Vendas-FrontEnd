import type { Sale } from '@domain/entities'
import type { PaymentMethod, SaleItemType } from '@domain/enums'
import { httpRequest } from '@shared/api/http-client'

type CreateSaleItemPayload = {
  itemType: SaleItemType
  itemId: string
  quantity: number
}

type CreateSalePayload = {
  paymentMethod: PaymentMethod
  discount: number
  items: CreateSaleItemPayload[]
}

export const salesApi = {
  getAll() {
    return httpRequest<Sale[]>('/api/sales')
  },

  getById(id: string) {
    return httpRequest<Sale>(`/api/sales/${id}`)
  },

  create(payload: CreateSalePayload) {
    return httpRequest<Sale>('/api/sales', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}

export type { CreateSalePayload, CreateSaleItemPayload }
