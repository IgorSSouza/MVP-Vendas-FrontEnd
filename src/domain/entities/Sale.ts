import { PaymentMethod } from '@domain/enums/PaymentMethod'
import type { SaleItem } from '@domain/entities/SaleItem'

export type Sale = {
  id: string
  items: SaleItem[]
  paymentMethod: PaymentMethod
  installments: number
  installmentAmount: number
  discount: number
  subtotal: number
  total: number
  profit: number
  createdAt: string
}
