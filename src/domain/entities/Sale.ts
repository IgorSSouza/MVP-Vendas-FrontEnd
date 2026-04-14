import { PaymentMethod } from '@domain/enums/PaymentMethod'
import type { SaleItem } from '@domain/entities/SaleItem'

export type SaleStatus = 'completed' | 'reversed'

export type Sale = {
  id: string
  items: SaleItem[]
  paymentMethod: PaymentMethod
  status: SaleStatus
  installments: number
  installmentAmount: number
  discount: number
  subtotal: number
  total: number
  profit: number
  createdAt: string
  reversedAt?: string | null
  reversalReason?: string | null
}
