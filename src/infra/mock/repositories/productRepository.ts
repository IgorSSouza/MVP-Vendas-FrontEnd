import { decreaseStockQuantity, isValidStockQuantity } from '@application/inventory'
import type { Product } from '@domain/entities'
import { SaleItemType } from '@domain/enums'
import { clone } from '@infra/mock/utils/clone'
import { mockProducts } from '@infra/mock/data/products'
import { delay } from '@infra/mock/utils/delay'
import { generateMockId } from '@infra/mock/utils/id'

type CreateProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
type UpdateProductInput = Partial<Omit<Product, 'id' | 'createdAt'>> & {
  updatedAt?: string
}
type DecreaseStockInput = {
  id: string
  quantity: number
}

let products = clone(mockProducts)

export const productRepository = {
  async getAll() {
    await delay()

    return clone(products)
  },

  async getById(id: string) {
    await delay()

    const product = products.find((item) => item.id === id)

    return product ? clone(product) : null
  },

  async create(input: CreateProductInput) {
    await delay()

    const timestamp = new Date().toISOString()
    const product: Product = {
      ...input,
      id: generateMockId('product'),
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    products = [...products, product]

    return clone(product)
  },

  async update(id: string, input: UpdateProductInput) {
    await delay()

    const currentProduct = products.find((item) => item.id === id)

    if (!currentProduct) {
      return null
    }

    const updatedProduct: Product = {
      ...currentProduct,
      ...input,
      id: currentProduct.id,
      createdAt: currentProduct.createdAt,
      updatedAt: input.updatedAt ?? new Date().toISOString(),
    }

    products = products.map((item) => (item.id === id ? updatedProduct : item))

    return clone(updatedProduct)
  },

  async toggleActive(id: string) {
    await delay()

    const currentProduct = products.find((item) => item.id === id)

    if (!currentProduct) {
      return null
    }

    const updatedProduct: Product = {
      ...currentProduct,
      isActive: !currentProduct.isActive,
      updatedAt: new Date().toISOString(),
    }

    products = products.map((item) => (item.id === id ? updatedProduct : item))

    return clone(updatedProduct)
  },

  async decreaseStockBatch(input: DecreaseStockInput[]) {
    await delay()

    const groupedInput = input.reduce<Record<string, number>>((accumulator, item) => {
      accumulator[item.id] = (accumulator[item.id] ?? 0) + item.quantity

      return accumulator
    }, {})

    for (const [id, quantity] of Object.entries(groupedInput)) {
      const currentProduct = products.find((item) => item.id === id)

      if (!currentProduct || !isValidStockQuantity(currentProduct.stockQuantity, quantity)) {
        return null
      }
    }

    products = products.map((product) => {
      const quantity = groupedInput[product.id]

      if (!quantity) {
        return product
      }

      return {
        ...product,
        stockQuantity: decreaseStockQuantity(
          SaleItemType.PRODUCT,
          product.stockQuantity,
          quantity,
        ),
        updatedAt: new Date().toISOString(),
      }
    })

    return clone(products)
  },
}

export type { CreateProductInput, DecreaseStockInput, UpdateProductInput }
