import type { Sale } from '@domain/entities'
import { PaymentMethod, SaleItemType } from '@domain/enums'
import { httpRequest } from '@shared/api/http-client'

type SaleListItem = {
  id: string
  createdAt: string
  paymentMethod: PaymentMethod
  subtotal: number
  discount: number
  total: number
  profit: number
  itemCount: number
}

type ApiSaleListItem = Omit<SaleListItem, 'paymentMethod'> & {
  paymentMethod: string | number
}

type ApiSaleItem = Sale['items'][number] & {
  itemType: string | number
}

type ApiSale = Omit<Sale, 'paymentMethod' | 'items'> & {
  paymentMethod: string | number
  items: ApiSaleItem[]
}

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

function normalizeEnumValue(value: string) {
  return value.trim().toLowerCase().replace(/[\s-]+/g, '_')
}

function normalizePaymentMethod(paymentMethod: string | number): PaymentMethod {
  if (typeof paymentMethod === 'number') {
    const paymentMethodMap: Record<number, PaymentMethod> = {
      0: PaymentMethod.PIX,
      1: PaymentMethod.CASH,
      2: PaymentMethod.DEBIT_CARD,
      3: PaymentMethod.CREDIT_CARD,
    }

    return paymentMethodMap[paymentMethod] ?? PaymentMethod.PIX
  }

  const normalizedPaymentMethod = normalizeEnumValue(paymentMethod)

  const paymentMethodMap: Record<string, PaymentMethod> = {
    pix: PaymentMethod.PIX,
    cash: PaymentMethod.CASH,
    dinheiro: PaymentMethod.CASH,
    debit_card: PaymentMethod.DEBIT_CARD,
    debitcard: PaymentMethod.DEBIT_CARD,
    cartao_de_debito: PaymentMethod.DEBIT_CARD,
    credit_card: PaymentMethod.CREDIT_CARD,
    creditcard: PaymentMethod.CREDIT_CARD,
    cartao_de_credito: PaymentMethod.CREDIT_CARD,
  }

  return paymentMethodMap[normalizedPaymentMethod] ?? PaymentMethod.PIX
}

function normalizeSaleItemType(itemType: string | number): SaleItemType {
  if (typeof itemType === 'number') {
    const itemTypeMap: Record<number, SaleItemType> = {
      0: SaleItemType.PRODUCT,
      1: SaleItemType.SERVICE,
    }

    return itemTypeMap[itemType] ?? SaleItemType.PRODUCT
  }

  const normalizedItemType = normalizeEnumValue(itemType)

  const itemTypeMap: Record<string, SaleItemType> = {
    product: SaleItemType.PRODUCT,
    produto: SaleItemType.PRODUCT,
    service: SaleItemType.SERVICE,
    servico: SaleItemType.SERVICE,
    serviço: SaleItemType.SERVICE,
  }

  return itemTypeMap[normalizedItemType] ?? SaleItemType.PRODUCT
}

function mapSaleListItem(apiSale: ApiSaleListItem): SaleListItem {
  return {
    ...apiSale,
    paymentMethod: normalizePaymentMethod(apiSale.paymentMethod),
  }
}

function mapSale(apiSale: ApiSale): Sale {
  return {
    ...apiSale,
    paymentMethod: normalizePaymentMethod(apiSale.paymentMethod),
    items: apiSale.items.map((item) => ({
      ...item,
      itemType: normalizeSaleItemType(item.itemType),
    })),
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
      body: JSON.stringify(payload),
    })
  },
}

export type { CreateSalePayload, CreateSaleItemPayload, SaleListItem }
