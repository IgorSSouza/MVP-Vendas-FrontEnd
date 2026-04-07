export { formatCurrency } from '@shared/utils/formatters'

export function isLowStock(stockQuantity: number) {
  return stockQuantity <= 3
}
