export type Product = {
  id: string
  name: string
  category: string
  barcode?: string | null
  costPrice: number
  salePrice: number
  stockQuantity: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}
