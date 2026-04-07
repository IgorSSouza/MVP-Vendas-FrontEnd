export { productRepository } from '@infra/mock/repositories/productRepository'
export { saleRepository } from '@infra/mock/repositories/saleRepository'
export { serviceRepository } from '@infra/mock/repositories/serviceRepository'

export type {
  CreateProductInput,
  DecreaseStockInput,
  UpdateProductInput,
} from '@infra/mock/repositories/productRepository'
export type {
  CreateSaleInput,
  CreateSaleItemInput,
} from '@infra/mock/repositories/saleRepository'
export type {
  CreateServiceInput,
  UpdateServiceInput,
} from '@infra/mock/repositories/serviceRepository'
