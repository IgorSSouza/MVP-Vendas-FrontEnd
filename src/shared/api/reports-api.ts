import { normalizePaymentMethod } from '@shared/api/api-normalizers'
import { httpRequest } from '@shared/api/http-client'

type RevenueReportPaymentMethodBreakdown = {
  paymentMethod: string
  salesCount: number
  subtotalAmount: number
  totalAmount: number
  profitAmount: number
}

type ApiRevenueReportPaymentMethodBreakdown = Omit<
  RevenueReportPaymentMethodBreakdown,
  'paymentMethod'
> & {
  paymentMethod: string | number
}

type RevenueReport = {
  startDate: string
  endDate: string
  salesCount: number
  subtotalAmount: number
  totalAmount: number
  profitAmount: number
  paymentMethodBreakdown: RevenueReportPaymentMethodBreakdown[]
}

type ApiRevenueReport = Omit<RevenueReport, 'paymentMethodBreakdown'> & {
  paymentMethodBreakdown: ApiRevenueReportPaymentMethodBreakdown[]
}

function normalizeAmount(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function mapRevenueReport(response: ApiRevenueReport): RevenueReport {
  return {
    startDate: response.startDate,
    endDate: response.endDate,
    salesCount: normalizeAmount(response.salesCount),
    subtotalAmount: normalizeAmount(response.subtotalAmount),
    totalAmount: normalizeAmount(response.totalAmount),
    profitAmount: normalizeAmount(response.profitAmount),
    paymentMethodBreakdown: response.paymentMethodBreakdown.map((item) => ({
      paymentMethod: normalizePaymentMethod(item.paymentMethod),
      salesCount: normalizeAmount(item.salesCount),
      subtotalAmount: normalizeAmount(item.subtotalAmount),
      totalAmount: normalizeAmount(item.totalAmount),
      profitAmount: normalizeAmount(item.profitAmount),
    })),
  }
}

export const reportsApi = {
  async getRevenue(params: { startDate: string; endDate: string }) {
    const query = new URLSearchParams({
      startDate: params.startDate,
      endDate: params.endDate,
    })

    const response = await httpRequest<ApiRevenueReport>(`/api/reports/revenue?${query.toString()}`)
    return mapRevenueReport(response)
  },
}

export type { RevenueReport, RevenueReportPaymentMethodBreakdown }
