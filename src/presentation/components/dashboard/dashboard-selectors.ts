import type { Product, Sale } from '@domain/entities'
import { PaymentMethod } from '@domain/enums'
import { isLowStock } from '@presentation/components/products/product-utils'

type PaymentSummaryItem = {
  paymentMethod: PaymentMethod
  count: number
  total: number
}

export type DashboardMetrics = {
  salesToday: number
  salesThisMonth: number
  grossTotal: number
  estimatedProfit: number
  totalSalesCount: number
  paymentSummary: PaymentSummaryItem[]
  lowStockProducts: Product[]
  recentSales: Sale[]
}

function isSameDay(date: Date, comparison: Date) {
  return (
    date.getFullYear() === comparison.getFullYear() &&
    date.getMonth() === comparison.getMonth() &&
    date.getDate() === comparison.getDate()
  )
}

function isSameMonth(date: Date, comparison: Date) {
  return (
    date.getFullYear() === comparison.getFullYear() &&
    date.getMonth() === comparison.getMonth()
  )
}

export function getDashboardMetrics(
  sales: Sale[],
  products: Product[],
  referenceDate = new Date(),
): DashboardMetrics {
  const salesToday = sales.filter((sale) => isSameDay(new Date(sale.createdAt), referenceDate))
  const salesThisMonth = sales.filter((sale) =>
    isSameMonth(new Date(sale.createdAt), referenceDate),
  )

  const grossTotal = sales.reduce((total, sale) => total + sale.total, 0)
  const estimatedProfit = sales.reduce((total, sale) => total + sale.profit, 0)

  const paymentSummary = Object.values(PaymentMethod).map((paymentMethod) => {
    const salesByMethod = sales.filter((sale) => sale.paymentMethod === paymentMethod)

    return {
      paymentMethod,
      count: salesByMethod.length,
      total: salesByMethod.reduce((total, sale) => total + sale.total, 0),
    }
  })

  const lowStockProducts = products
    .filter((product) => product.isActive && isLowStock(product.stockQuantity))
    .sort((first, second) => first.stockQuantity - second.stockQuantity)

  const recentSales = [...sales]
    .sort((first, second) => {
      return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
    })
    .slice(0, 5)

  return {
    salesToday: salesToday.length,
    salesThisMonth: salesThisMonth.length,
    grossTotal,
    estimatedProfit,
    totalSalesCount: sales.length,
    paymentSummary,
    lowStockProducts,
    recentSales,
  }
}
