import { getPaymentMethodLabel } from '@presentation/components/sales/sale-utils'

type SalePaymentBadgeProps = {
  paymentMethod: string
}

export function SalePaymentBadge({ paymentMethod }: SalePaymentBadgeProps) {
  return (
    <span className="app-badge border-cyan-200 bg-cyan-50 text-cyan-800">
      {getPaymentMethodLabel(paymentMethod)}
    </span>
  )
}
