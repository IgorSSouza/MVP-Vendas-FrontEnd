import type { Product } from '@domain/entities'
import { httpRequest } from '@shared/api/http-client'

type ProductPayload = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
type ProductUpdatePayload = Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>

export const productsApi = {
  getAll() {
    return httpRequest<Product[]>('/api/products')
  },

  getById(id: string) {
    return httpRequest<Product>(`/api/products/${id}`)
  },

  create(payload: ProductPayload) {
    return httpRequest<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  update(id: string, payload: ProductUpdatePayload) {
    return httpRequest<Product>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  toggleStatus(id: string) {
    return httpRequest<void>(`/api/products/${id}/toggle-status`, {
      method: 'PATCH',
    })
  },
}
