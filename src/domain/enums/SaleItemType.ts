export const SaleItemType = {
  PRODUCT: 'product',
  SERVICE: 'service',
} as const

export type SaleItemType = (typeof SaleItemType)[keyof typeof SaleItemType]
