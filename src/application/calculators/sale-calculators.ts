import type { SaleItem } from '@domain/entities/SaleItem'

export function calculateSaleItemSubtotal(quantity: number, unitSalePrice: number) {
  return quantity * unitSalePrice
}

export function calculateSaleItemProfit(
  quantity: number,
  unitCostPrice: number,
  unitSalePrice: number,
) {
  return (unitSalePrice - unitCostPrice) * quantity
}

export function calculateSaleSubtotal(items: Pick<SaleItem, 'subtotal'>[]) {
  return items.reduce((total, item) => total + item.subtotal, 0)
}

export function calculateSaleTotal(subtotal: number, discount: number) {
  return Math.max(subtotal - discount, 0)
}

export function calculateSaleProfit(items: Pick<SaleItem, 'profit'>[], discount: number) {
  const totalProfit = items.reduce((total, item) => total + item.profit, 0)

  return totalProfit - discount
}
