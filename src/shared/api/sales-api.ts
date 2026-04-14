import type { Sale, SaleStatus } from '@domain/entities'
import { PaymentMethod } from '@domain/enums'
import type { SaleItemType } from '@domain/enums'
import {
  normalizePaymentMethod,
  normalizeSaleItemType,
} from '@shared/api/api-normalizers'
import { httpRequest } from '@shared/api/http-client'

type SaleListItem = {
  id: string
  createdAt: string
  paymentMethod: PaymentMethod
  status: SaleStatus
  reversedAt?: string | null
  reversalReason?: string | null
  installments: number
  installmentAmount: number
  subtotal: number
  discount: number
  total: number
  profit: number
  itemCount: number
}

type ApiSaleListItem = Omit<SaleListItem, 'paymentMethod' | 'status'> & {
  paymentMethod: string | number
  status?: string | number
}

type ApiSaleItem = Sale['items'][number] & {
  itemType: string | number
}

type ApiSale = Omit<Sale, 'paymentMethod' | 'items' | 'status'> & {
  paymentMethod: string | number
  status?: string | number
  items: ApiSaleItem[]
}

type CreateSaleItemPayload = {
  itemType: SaleItemType
  itemId: string
  quantity: number
}

type CreateSalePayload = {
  paymentMethod: PaymentMethod
  installments: number
  discount: number
  items: CreateSaleItemPayload[]
}

type ApiCreateSalePayload = {
  paymentMethod: string
  installments: number
  discount: number
  items: CreateSaleItemPayload[]
}

function normalizeSaleStatus(status: unknown): SaleStatus {
  if (typeof status === 'string' && status.toLowerCase() === 'reversed') {
    return 'reversed'
  }

  return 'completed'
}

function mapSaleListItem(apiSale: ApiSaleListItem): SaleListItem {
  return {
    ...apiSale,
    paymentMethod: normalizePaymentMethod(apiSale.paymentMethod),
    status: normalizeSaleStatus(apiSale.status),
    reversedAt: apiSale.reversedAt ?? null,
    reversalReason: apiSale.reversalReason ?? null,
  }
}

function mapSale(apiSale: ApiSale): Sale {
  return {
    ...apiSale,
    paymentMethod: normalizePaymentMethod(apiSale.paymentMethod),
    status: normalizeSaleStatus(apiSale.status),
    reversedAt: apiSale.reversedAt ?? null,
    reversalReason: apiSale.reversalReason ?? null,
    items: apiSale.items.map((item) => ({
      ...item,
      itemType: normalizeSaleItemType(item.itemType),
    })),
  }
}

function serializePaymentMethod(paymentMethod: PaymentMethod) {
  const paymentMethodMap: Record<PaymentMethod, string> = {
    [PaymentMethod.PIX]: 'Pix',
    [PaymentMethod.CASH]: 'Cash',
    [PaymentMethod.DEBIT_CARD]: 'DebitCard',
    [PaymentMethod.CREDIT_CARD]: 'CreditCard',
  }

  return paymentMethodMap[paymentMethod]
}

function mapCreateSalePayload(payload: CreateSalePayload): ApiCreateSalePayload {
  return {
    ...payload,
    paymentMethod: serializePaymentMethod(payload.paymentMethod),
  }
}

export const salesApi = {
  async getAll() {
    const response = await httpRequest<ApiSaleListItem[]>('/api/sales')
    return response.map(mapSaleListItem)
  },

  async getById(id: string) {
    const response = await httpRequest<ApiSale>(`/api/sales/${id}`)
    return mapSale(response)
  },

  create(payload: CreateSalePayload) {
    return httpRequest<Sale>('/api/sales', {
      method: 'POST',
      body: JSON.stringify(mapCreateSalePayload(payload)),
    })
  },

  async reverse(id: string, reason: string) {
    await httpRequest<unknown>(`/api/sales/${id}/reverse`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    })

    return this.getById(id)
  },
}

export type { CreateSalePayload, CreateSaleItemPayload, SaleListItem }
