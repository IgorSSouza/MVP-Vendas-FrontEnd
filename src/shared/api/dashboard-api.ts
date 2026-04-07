import type { PaymentMethod } from '@domain/enums'
import { httpRequest } from '@shared/api/http-client'
import { normalizePaymentMethod } from '@shared/api/api-normalizers'

type DashboardPaymentSummaryItem = {
  paymentMethod: PaymentMethod
  count: number
  total: number
}

type DashboardLowStockProduct = {
  id: string
  name: string
  category: string
  stockQuantity: number
}

type DashboardRecentSale = {
  id: string
  createdAt: string
  paymentMethod: PaymentMethod
  total: number
}

type DashboardData = {
  totalSalesCount: number
  todaySalesCount: number
  monthSalesCount: number
  grossRevenue: number
  estimatedProfit: number
  salesByPaymentMethod: DashboardPaymentSummaryItem[]
  lowStockProducts: DashboardLowStockProduct[]
  recentSales: DashboardRecentSale[]
}

type ApiDashboardPaymentSummaryItem = Omit<DashboardPaymentSummaryItem, 'paymentMethod'> & {
  paymentMethod: string | number
}

type ApiDashboardRecentSale = Omit<DashboardRecentSale, 'paymentMethod'> & {
  paymentMethod: string | number
}

type ApiDashboardData = Omit<
  DashboardData,
  'salesByPaymentMethod' | 'recentSales'
> & {
  salesByPaymentMethod: ApiDashboardPaymentSummaryItem[]
  recentSales: ApiDashboardRecentSale[]
}

function mapPaymentSummaryItem(
  item: ApiDashboardPaymentSummaryItem,
): DashboardPaymentSummaryItem {
  return {
    ...item,
    paymentMethod: normalizePaymentMethod(item.paymentMethod),
  }
}

function mapRecentSale(item: ApiDashboardRecentSale): DashboardRecentSale {
  return {
    ...item,
    paymentMethod: normalizePaymentMethod(item.paymentMethod),
  }
}

export const dashboardApi = {
  async getData() {
    const response = await httpRequest<ApiDashboardData>('/api/dashboard')

    return {
      ...response,
      salesByPaymentMethod: response.salesByPaymentMethod.map(mapPaymentSummaryItem),
      recentSales: response.recentSales.map(mapRecentSale),
    }
  },
}

export type {
  DashboardData,
  DashboardLowStockProduct,
  DashboardPaymentSummaryItem,
  DashboardRecentSale,
}
