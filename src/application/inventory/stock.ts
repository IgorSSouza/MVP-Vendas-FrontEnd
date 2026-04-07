import { SaleItemType } from '@domain/enums/SaleItemType'

export function isValidStockQuantity(stockQuantity: number, quantityToDecrease: number) {
  if (stockQuantity < 0 || quantityToDecrease < 0) {
    return false
  }

  return stockQuantity - quantityToDecrease >= 0
}

export function decreaseStockQuantity(
  itemType: SaleItemType,
  stockQuantity: number,
  quantityToDecrease: number,
) {
  if (itemType === SaleItemType.SERVICE) {
    return stockQuantity
  }

  if (!isValidStockQuantity(stockQuantity, quantityToDecrease)) {
    return stockQuantity
  }

  return stockQuantity - quantityToDecrease
}
