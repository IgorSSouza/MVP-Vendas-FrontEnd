import type { DashboardPaymentSummaryItem, DashboardRecentSale } from '@shared/api/dashboard-api'
import type { SaleListItem } from '@shared/api/sales-api'
import { PaymentMethod } from '@domain/enums'

export type DashboardPeriod = 'today' | 'last7Days' | 'last30Days' | 'currentMonth'

export const dashboardPeriodOptions: Array<{
  value: DashboardPeriod
  label: string
  shortLabel: string
}> = [
  { value: 'today', label: 'Hoje', shortLabel: 'Hoje' },
  { value: 'last7Days', label: '7 dias', shortLabel: '7 dias' },
  { value: 'last30Days', label: '30 dias', shortLabel: '30 dias' },
  { value: 'currentMonth', label: 'Mês atual', shortLabel: 'Mês atual' },
]

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function isSameDay(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  )
}

function isCompletedSale(sale: SaleListItem) {
  return sale.status === 'completed'
}

export function filterSalesByPeriod(
  sales: SaleListItem[],
  period: DashboardPeriod,
  now = new Date(),
) {
  const currentDate = new Date(now)

  return sales.filter((sale) => {
    if (!isCompletedSale(sale)) {
      return false
    }

    const saleDate = new Date(sale.createdAt)

    switch (period) {
      case 'today':
        return isSameDay(saleDate, currentDate)
      case 'last7Days':
        return saleDate >= startOfDay(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 6))
      case 'last30Days':
        return saleDate >= startOfDay(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 29))
      case 'currentMonth':
        return saleDate >= startOfMonth(currentDate)
      default:
        return true
    }
  })
}

export function getTodaySalesCount(sales: SaleListItem[], now = new Date()) {
  return sales.filter((sale) => {
    return isCompletedSale(sale) && isSameDay(new Date(sale.createdAt), now)
  }).length
}

export function getCurrentMonthSalesCount(sales: SaleListItem[], now = new Date()) {
  const monthStart = startOfMonth(now)
  return sales.filter((sale) => {
    return isCompletedSale(sale) && new Date(sale.createdAt) >= monthStart
  }).length
}

export function summarizeSales(sales: SaleListItem[]) {
  const totalSalesCount = sales.length
  const grossRevenue = sales.reduce((sum, sale) => sum + sale.total, 0)
  const estimatedProfit = sales.reduce((sum, sale) => sum + sale.profit, 0)

  return {
    totalSalesCount,
    grossRevenue,
    estimatedProfit,
  }
}

export function mapRecentSales(sales: SaleListItem[], limit = 6): DashboardRecentSale[] {
  return [...sales]
    .sort((leftSale, rightSale) => {
      return new Date(rightSale.createdAt).getTime() - new Date(leftSale.createdAt).getTime()
    })
    .slice(0, limit)
    .map((sale) => ({
      id: sale.id,
      createdAt: sale.createdAt,
      paymentMethod: sale.paymentMethod,
      total: sale.total,
    }))
}

export function groupSalesByPaymentMethod(
  sales: SaleListItem[],
): DashboardPaymentSummaryItem[] {
  const groupedSales = new Map<
    PaymentMethod,
    { paymentMethod: PaymentMethod; count: number; total: number }
  >()

  sales.forEach((sale) => {
    const currentEntry = groupedSales.get(sale.paymentMethod)

    if (currentEntry) {
      currentEntry.count += 1
      currentEntry.total += sale.total
      return
    }

    groupedSales.set(sale.paymentMethod, {
      paymentMethod: sale.paymentMethod,
      count: 1,
      total: sale.total,
    })
  })

  return Array.from(groupedSales.values()).sort((leftItem, rightItem) => rightItem.total - leftItem.total)
}

export function getDashboardPeriodLabel(period: DashboardPeriod) {
  return dashboardPeriodOptions.find((option) => option.value === period)?.label ?? 'Hoje'
}
