import { SaleItemType } from '@domain/enums/SaleItemType'

export type SaleItem = {
  id: string
  itemType: SaleItemType
  itemId: string
  name: string
  quantity: number
  unitCostPrice: number
  unitSalePrice: number
  subtotal: number
  profit: number
}
