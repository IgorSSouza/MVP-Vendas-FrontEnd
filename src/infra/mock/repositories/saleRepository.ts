import {
  calculateSaleItemProfit,
  calculateSaleItemSubtotal,
  calculateSaleProfit,
  calculateSaleSubtotal,
  calculateSaleTotal,
} from '@application/calculators'
import type { Sale, SaleItem } from '@domain/entities'
import { clone } from '@infra/mock/utils/clone'
import { mockSales } from '@infra/mock/data/sales'
import { delay } from '@infra/mock/utils/delay'
import { generateMockId } from '@infra/mock/utils/id'

type CreateSaleItemInput = Omit<SaleItem, 'id' | 'subtotal' | 'profit'>
type CreateSaleInput = {
  items: CreateSaleItemInput[]
  paymentMethod: Sale['paymentMethod']
  discount: number
}

let sales = clone(mockSales)

export const saleRepository = {
  async getAll() {
    await delay()

    return clone(sales)
  },

  async getById(id: string) {
    await delay()

    const sale = sales.find((item) => item.id === id)

    return sale ? clone(sale) : null
  },

  async create(input: CreateSaleInput) {
    await delay()

    const items = input.items.map((item) => {
      const subtotal = calculateSaleItemSubtotal(item.quantity, item.unitSalePrice)
      const profit = calculateSaleItemProfit(
        item.quantity,
        item.unitCostPrice,
        item.unitSalePrice,
      )

      return {
        ...item,
        id: generateMockId('sale_item'),
        subtotal,
        profit,
      }
    })

    const subtotal = calculateSaleSubtotal(items)
    const total = calculateSaleTotal(subtotal, input.discount)
    const profit = calculateSaleProfit(items, input.discount)

    const sale: Sale = {
      id: generateMockId('sale'),
      items,
      paymentMethod: input.paymentMethod,
      discount: input.discount,
      subtotal,
      total,
      profit,
      createdAt: new Date().toISOString(),
    }

    sales = [sale, ...sales]

    return clone(sale)
  },
}

export type { CreateSaleInput, CreateSaleItemInput }
