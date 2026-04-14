import {
  calculateSaleItemProfit,
  calculateSaleItemSubtotal,
  calculateSaleProfit,
  calculateSaleSubtotal,
  calculateSaleTotal,
} from '@application/calculators'
import type { Sale, SaleItem } from '@domain/entities'
import { PaymentMethod, SaleItemType } from '@domain/enums'

function createSaleItem(input: {
  id: string
  itemType: SaleItem['itemType']
  itemId: string
  name: string
  quantity: number
  unitCostPrice: number
  unitSalePrice: number
}): SaleItem {
  const subtotal = calculateSaleItemSubtotal(input.quantity, input.unitSalePrice)
  const profit = calculateSaleItemProfit(
    input.quantity,
    input.unitCostPrice,
    input.unitSalePrice,
  )

  return {
    ...input,
    subtotal,
    profit,
  }
}

function createSale(input: {
  id: string
  items: SaleItem[]
  paymentMethod: Sale['paymentMethod']
  installments?: number
  discount: number
  createdAt: string
  status?: Sale['status']
  reversedAt?: string | null
  reversalReason?: string | null
}): Sale {
  const subtotal = calculateSaleSubtotal(input.items)
  const total = calculateSaleTotal(subtotal, input.discount)
  const profit = calculateSaleProfit(input.items, input.discount)
  const installments =
    input.paymentMethod === PaymentMethod.CREDIT_CARD
      ? Math.min(Math.max(input.installments ?? 1, 1), 12)
      : 1

  return {
    ...input,
    status: input.status ?? 'completed',
    reversedAt: input.reversedAt ?? null,
    reversalReason: input.reversalReason ?? null,
    installments,
    installmentAmount: total / installments,
    subtotal,
    total,
    profit,
  }
}

export const mockSales: Sale[] = [
  createSale({
    id: 'sale_001',
    paymentMethod: PaymentMethod.PIX,
    discount: 10,
    createdAt: '2026-04-03T13:15:00.000Z',
    items: [
      createSaleItem({
        id: 'sale_item_001',
        itemType: SaleItemType.PRODUCT,
        itemId: 'product_typec_cable',
        name: 'Cabo USB-C 1m',
        quantity: 2,
        unitCostPrice: 12,
        unitSalePrice: 29.9,
      }),
      createSaleItem({
        id: 'sale_item_002',
        itemType: SaleItemType.SERVICE,
        itemId: 'service_software_update',
        name: 'Atualizacao de software',
        quantity: 1,
        unitCostPrice: 10,
        unitSalePrice: 60,
      }),
    ],
  }),
  createSale({
    id: 'sale_002',
    paymentMethod: PaymentMethod.CREDIT_CARD,
    installments: 3,
    discount: 15,
    createdAt: '2026-04-04T10:40:00.000Z',
    items: [
      createSaleItem({
        id: 'sale_item_003',
        itemType: SaleItemType.PRODUCT,
        itemId: 'product_turbo_charger',
        name: 'Carregador Turbo 20W',
        quantity: 1,
        unitCostPrice: 22,
        unitSalePrice: 49.9,
      }),
      createSaleItem({
        id: 'sale_item_004',
        itemType: SaleItemType.PRODUCT,
        itemId: 'product_tempered_glass',
        name: 'Película 3D Samsung A54',
        quantity: 1,
        unitCostPrice: 8,
        unitSalePrice: 24.9,
      }),
      createSaleItem({
        id: 'sale_item_005',
        itemType: SaleItemType.SERVICE,
        itemId: 'service_screen_replace',
        name: 'Troca de tela',
        quantity: 1,
        unitCostPrice: 120,
        unitSalePrice: 220,
      }),
    ],
  }),
  createSale({
    id: 'sale_003',
    paymentMethod: PaymentMethod.DEBIT_CARD,
    discount: 0,
    createdAt: '2026-04-05T15:05:00.000Z',
    status: 'reversed',
    reversedAt: '2026-04-06T12:10:00.000Z',
    reversalReason: 'Cliente desistiu da compra.',
    items: [
      createSaleItem({
        id: 'sale_item_006',
        itemType: SaleItemType.PRODUCT,
        itemId: 'product_bluetooth_headset',
        name: 'Fone Bluetooth TWS',
        quantity: 1,
        unitCostPrice: 55,
        unitSalePrice: 119.9,
      }),
      createSaleItem({
        id: 'sale_item_007',
        itemType: SaleItemType.PRODUCT,
        itemId: 'product_typec_cable',
        name: 'Cabo USB-C 1m',
        quantity: 1,
        unitCostPrice: 12,
        unitSalePrice: 29.9,
      }),
    ],
  }),
  createSale({
    id: 'sale_004',
    paymentMethod: PaymentMethod.CASH,
    discount: 20,
    createdAt: '2026-04-06T11:25:00.000Z',
    items: [
      createSaleItem({
        id: 'sale_item_008',
        itemType: SaleItemType.PRODUCT,
        itemId: 'product_iphone_battery',
        name: 'Bateria iPhone 11',
        quantity: 1,
        unitCostPrice: 85,
        unitSalePrice: 160,
      }),
      createSaleItem({
        id: 'sale_item_009',
        itemType: SaleItemType.SERVICE,
        itemId: 'service_battery_replace',
        name: 'Troca de bateria',
        quantity: 1,
        unitCostPrice: 45,
        unitSalePrice: 120,
      }),
    ],
  }),
]
